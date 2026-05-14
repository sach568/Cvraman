import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProject, updateProject, getSubjects, getUsers } from "../api";
import toast from "react-hot-toast";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    branch: "CSE",
    subject_id: "",
    mentor_id: "",
    deadline: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, subjectsRes, usersRes] = await Promise.all([
          getProject(id),
          getSubjects(),
          getUsers(),
        ]);
        const project = projectRes.data;
        setForm({
          title: project.title || "",
          description: project.description || "",
          branch: project.branch || "CSE",
          subject_id: project.subject_id || "",
          mentor_id: project.mentor_id || "",
          deadline: project.deadline || "",
        });
        setSubjects(subjectsRes.data);
        setMentors(usersRes.data.mentors);
      } catch (err) {
        toast.error("Failed to load project");
        navigate("/projects");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateProject(id, form);
      toast.success("Project updated successfully!");
      navigate("/projects");
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-teal-600 bg-clip-text text-transparent">
          ✏️ Edit Project
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Update your project details
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500"></div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Project Title *
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Description *
            </label>
            <textarea
              rows="5"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </div>

          {/* Branch & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Branch
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
              >
                <option>CSE</option>
                <option>IT</option>
                <option>Mechanical</option>
                <option>Civil</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Deadline
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
          </div>

          {/* Subject & Mentor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Subject *
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
                value={form.subject_id}
                onChange={(e) =>
                  setForm({ ...form, subject_id: e.target.value })
                }
                required
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Mentor *
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
                value={form.mentor_id}
                onChange={(e) =>
                  setForm({ ...form, mentor_id: e.target.value })
                }
                required
              >
                <option value="">Select Mentor</option>
                {mentors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
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
                "Update Project"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
