import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects.php");
      setSubjects(res.data);
    } catch (err) {
      toast.error("Failed to load subjects");
    }
  };

  const handleAdd = async () => {
    if (!newSubject.trim()) return toast.error("Subject name required");
    setLoading(true);
    try {
      await api.post("/subjects.php", { name: newSubject });
      toast.success("Subject added");
      setNewSubject("");
      fetchSubjects();
    } catch (err) {
      toast.error("Add failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this subject?")) return;
    try {
      await api.delete(`/subjects.php?id=${id}`);
      toast.success("Subject deleted");
      fetchSubjects();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📚 Manage Subjects</h2>
      <div className="bg-white rounded-xl shadow p-5 mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="New subject name"
            className="flex-1 border rounded-lg px-4 py-2"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Adding..." : "+ Add"}
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{s.id}</td>
                <td className="p-4 font-medium">{s.name}</td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(s.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {subjects.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">
                  No subjects yet. Add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
