import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState({ students: [], mentors: [] });
  const [activeTab, setActiveTab] = useState("students");
  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    roll_number: "",
    branch: "CSE",
  });
  const [mentorForm, setMentorForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users.php");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  const addStudent = async () => {
    if (!studentForm.name || !studentForm.email || !studentForm.roll_number) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      await api.post("/users.php", { type: "student", ...studentForm });
      toast.success("Student added successfully");
      setStudentForm({ name: "", email: "", roll_number: "", branch: "CSE" });
      fetchUsers();
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to add student";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const addMentor = async () => {
    if (!mentorForm.name || !mentorForm.email) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      await api.post("/users.php", { type: "mentor", ...mentorForm });
      toast.success("Mentor added successfully");
      setMentorForm({ name: "", email: "" });
      fetchUsers();
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to add mentor";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">👥 Manage Users</h2>
      <div className="flex gap-2 border-b mb-6">
        <button
          onClick={() => setActiveTab("students")}
          className={`px-6 py-2 rounded-t-lg ${activeTab === "students" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Students
        </button>
        <button
          onClick={() => setActiveTab("mentors")}
          className={`px-6 py-2 rounded-t-lg ${activeTab === "mentors" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Mentors
        </button>
      </div>

      {activeTab === "students" ? (
        <div className="bg-white rounded-xl shadow p-5 mb-8">
          <h3 className="text-lg font-semibold mb-3">Add Student</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Name"
              className="border rounded p-2"
              value={studentForm.name}
              onChange={(e) =>
                setStudentForm({ ...studentForm, name: e.target.value })
              }
            />
            <input
              placeholder="Email"
              className="border rounded p-2"
              value={studentForm.email}
              onChange={(e) =>
                setStudentForm({ ...studentForm, email: e.target.value })
              }
            />
            <input
              placeholder="Roll Number"
              className="border rounded p-2"
              value={studentForm.roll_number}
              onChange={(e) =>
                setStudentForm({ ...studentForm, roll_number: e.target.value })
              }
            />
            <select
              className="border rounded p-2"
              value={studentForm.branch}
              onChange={(e) =>
                setStudentForm({ ...studentForm, branch: e.target.value })
              }
            >
              <option>CSE</option>
              <option>IT</option>
              <option>Mechanical</option>
              <option>Civil</option>
            </select>
          </div>
          <button
            onClick={addStudent}
            disabled={loading}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Add Student
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-5 mb-8">
          <h3 className="text-lg font-semibold mb-3">Add Mentor</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Name"
              className="border rounded p-2"
              value={mentorForm.name}
              onChange={(e) =>
                setMentorForm({ ...mentorForm, name: e.target.value })
              }
            />
            <input
              placeholder="Email"
              className="border rounded p-2"
              value={mentorForm.email}
              onChange={(e) =>
                setMentorForm({ ...mentorForm, email: e.target.value })
              }
            />
          </div>
          <button
            onClick={addMentor}
            disabled={loading}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg"
          >
            Add Mentor
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b">
          {activeTab === "students" ? "Student List" : "Mentor List"}
        </h3>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              {activeTab === "students" && (
                <th className="p-3 text-left">Roll No</th>
              )}
              {activeTab === "students" && (
                <th className="p-3 text-left">Branch</th>
              )}
            </tr>
          </thead>
          <tbody>
            {(activeTab === "students" ? users.students : users.mentors).map(
              (u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  {activeTab === "students" && (
                    <td className="p-3">{u.roll_number}</td>
                  )}
                  {activeTab === "students" && (
                    <td className="p-3">{u.branch}</td>
                  )}
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
