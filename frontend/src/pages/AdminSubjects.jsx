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
    if (!newName.trim()) {
      toast.error("Subject name is required");
      return;
    }
    setLoading(true);
    try {
      await addSubject(newName);
      toast.success("Subject added");
      setNewName("");
      fetchSubjects();
    } catch (err) {
      toast.error(err.response?.data?.error || "Add failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this subject? This action cannot be undone.")) return;
    try {
      await deleteSubject(id);
      toast.success("Subject deleted");
      fetchSubjects();
    } catch (err) {
      toast.error(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
          📚 Manage Subjects
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Add or remove academic subjects for project categorization
        </p>
      </div>

      {/* Add Subject Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <span>➕</span> Add New Subject
          </h3>
        </div>
        <div className="p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter subject name (e.g., Artificial Intelligence)"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            />
            <button
              onClick={handleAdd}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Add Subject"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Subjects List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-gray-700 text-lg">
            📖 Subject List
          </h3>
          <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
            {subjects.length} subjects
          </span>
        </div>
        {subjects.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500">
              No subjects yet. Add your first subject above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="p-4 flex justify-between items-center hover:bg-gray-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {subject.id}
                  </div>
                  <span className="text-gray-800 font-medium">
                    {subject.name}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(subject.id)}
                  className="text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition px-3 py-1 rounded-lg hover:bg-red-50"
                  title="Delete subject"
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
