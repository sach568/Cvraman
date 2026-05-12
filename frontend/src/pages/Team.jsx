import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

export default function Team() {
  const [mentors, setMentors] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    roll_number: "",
    branch: "",
  });
  const userRole = JSON.parse(localStorage.getItem("user") || "{}").role;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users.php");
      setMentors(res.data.mentors);
      setStudents(res.data.students);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    try {
      await api.delete(`/users.php?id=${id}`);
      toast.success(`${type} deleted`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || "Delete failed");
    }
  };

  const startEdit = (user, type) => {
    setEditingUser({ ...user, type });
    setEditForm({
      name: user.name,
      email: user.email,
      roll_number: user.roll_number || "",
      branch: user.branch || "CSE",
    });
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({ name: "", email: "", roll_number: "", branch: "" });
  };

  const saveEdit = async () => {
    if (!editForm.name || !editForm.email) {
      toast.error("Name and email are required");
      return;
    }
    try {
      const payload = {
        name: editForm.name,
        email: editForm.email,
        role: editingUser.type === "student" ? "student" : "mentor",
        ...(editingUser.type === "student" && {
          roll_number: editForm.roll_number,
          branch: editForm.branch,
        }),
      };
      await api.put(`/users.php?id=${editingUser.id}`, payload);
      toast.success("User updated");
      cancelEdit();
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    }
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
          👥 Team Members
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage mentors and students
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Mentors Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Mentors ({mentors.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {mentors.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No mentors found
              </div>
            ) : (
              mentors.map((m) => (
                <div
                  key={m.id}
                  className="p-4 hover:bg-gray-50 transition group"
                >
                  {editingUser?.id === m.id &&
                  editingUser?.type === "mentor" ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        placeholder="Name"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                      <input
                        type="email"
                        className="w-full border rounded-lg p-2"
                        placeholder="Email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-500 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {m.name}
                          </p>
                          <p className="text-sm text-gray-500">{m.email}</p>
                        </div>
                      </div>
                      {userRole === "admin" && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => startEdit(m, "mentor")}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(m.id, "Mentor")}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Students Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Students ({students.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {students.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No students found
              </div>
            ) : (
              students.map((s) => (
                <div
                  key={s.id}
                  className="p-4 hover:bg-gray-50 transition group"
                >
                  {editingUser?.id === s.id &&
                  editingUser?.type === "student" ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        placeholder="Name"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                      <input
                        type="email"
                        className="w-full border rounded-lg p-2"
                        placeholder="Email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        placeholder="Roll Number"
                        value={editForm.roll_number}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            roll_number: e.target.value,
                          })
                        }
                      />
                      <select
                        className="w-full border rounded-lg p-2"
                        value={editForm.branch}
                        onChange={(e) =>
                          setEditForm({ ...editForm, branch: e.target.value })
                        }
                      >
                        <option>CSE</option>
                        <option>IT</option>
                        <option>Mechanical</option>
                        <option>Civil</option>
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={saveEdit}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-500 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {s.name}
                          </p>
                          <p className="text-sm text-gray-500">{s.email}</p>
                          <p className="text-xs text-gray-400">
                            {s.roll_number} • {s.branch}
                          </p>
                        </div>
                      </div>
                      {userRole === "admin" && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => startEdit(s, "student")}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(s.id, "Student")}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
