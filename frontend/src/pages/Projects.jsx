import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects, submitProject, deleteProject } from "../api";
import toast from "react-hot-toast";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isMentor = user.role === "mentor";
  const isStudent = user.role === "student";

  useEffect(() => {
    fetchProjects();
  }, [search]);

  const fetchProjects = async () => {
    try {
      const res = await getProjects(search);
      setProjects(res.data);
    } catch (err) {
      toast.error("Failed to load projects");
    }
  };

  const handleSubmit = async (id) => {
    try {
      await submitProject(id);
      toast.success("Project submitted for review");
      fetchProjects();
    } catch (err) {
      toast.error("Submission failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        toast.success("Project deleted");
        fetchProjects();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      draft: { label: "Draft", color: "bg-gray-500" },
      submitted: { label: "Submitted", color: "bg-yellow-500" },
      under_review: { label: "Under Review", color: "bg-blue-500" },
      approved: { label: "Approved", color: "bg-green-500" },
      revisions_needed: { label: "Revisions Needed", color: "bg-red-500" },
    };
    const s = map[status] || { label: status, color: "bg-gray-500" };
    return (
      <span className={`px-2 py-1 rounded-full text-xs text-white ${s.color}`}>
        {s.label}
      </span>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
          📁{" "}
          {isStudent
            ? "My Projects"
            : isMentor
              ? "Assigned Projects"
              : "All Projects"}
        </h2>
        <div className="flex gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isStudent && (
            <Link
              to="/projects/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <span>➕</span> New Project
            </Link>
          )}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Title
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Subject
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  {isMentor ? "Student" : "Mentor"}
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No projects found.{" "}
                    {isStudent && (
                      <Link to="/projects/create" className="text-blue-600">
                        Create one
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium text-gray-800">{p.title}</td>
                    <td className="p-3 text-gray-600">{p.subject_name}</td>
                    <td className="p-3 text-gray-600">
                      {isMentor ? p.student_name : p.mentor_name}
                    </td>
                    <td className="p-3">{getStatusBadge(p.status)}</td>
                    <td className="p-3">
                      {isStudent && p.status === "draft" && (
                        <div className="flex gap-3">
                          <Link
                            to={`/projects/edit/${p.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleSubmit(p.id)}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Submit
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                      {isMentor && (
                        <Link
                          to={`/projects/review/${p.id}`}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          Review
                        </Link>
                      )}
                      {isStudent && p.status !== "draft" && (
                        <span className="text-gray-400 text-sm">
                          No actions
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
