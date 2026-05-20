import React, { useState, useEffect } from "react";
import { getSubjects, addSubject, deleteSubject } from "../api";
import toast from "react-hot-toast";

export default function AdminSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);
  const fetchSubjects = async () => {
    try {
      const res = await getSubjects();
      setSubjects(res.data);
    } catch (err) {
      toast.error("Failed to load subjects");
    }
  };
  const handleAdd = async () => {
    if (!newName.trim()) return toast.error("Subject name required");
    setLoading(true);
    try {
      await addSubject(newName);
      toast.success("Added");
      setNewName("");
      fetchSubjects();
    } catch (err) {
      toast.error(err.response?.data?.error || "Add failed");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (confirm("Delete this subject?")) {
      try {
        await deleteSubject(id);
        toast.success("Deleted");
        fetchSubjects();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent mb-4">
        📚 Manage Subjects
      </h2>
      <div className="bg-white rounded-xl shadow-md p-5 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Subject name"
            className="flex-1 border rounded-lg px-4 py-2"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Add Subject
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gray-50 p-3 border-b">
          <h3 className="font-semibold">Subject List ({subjects.length})</h3>
        </div>
        {subjects.length === 0 ? (
          <div className="p-8 text-center">No subjects</div>
        ) : (
          subjects.map((s) => (
            <div
              key={s.id}
              className="p-3 border-b flex justify-between items-center"
            >
              <span>{s.name}</span>
              <button
                onClick={() => handleDelete(s.id)}
                className="text-red-600 hover:bg-red-50 p-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
