import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, subjectsRes, usersRes] = await Promise.all([
          api.get(`/projects.php?id=${id}`),
          api.get("/subjects.php"),
          api.get("/users.php"),
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
        console.error(err);
        toast.error("Failed to load project data");
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
      await api.put(`/projects.php?id=${id}`, form);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-teal-600 bg-clip-text text-transparent">
            ✏️ Edit Project
          </h2>
          <p className="text-gray-500 mt-1">Update your project details</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500"></div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Project Title *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                Description *
              </label>
              <textarea
                rows="5"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Branch
                </label>
                <select
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
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
                <label className="block text-gray-700 font-semibold mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={form.deadline}
                  onChange={(e) =>
                    setForm({ ...form, deadline: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Subject *
                </label>
                <select
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
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
                <label className="block text-gray-700 font-semibold mb-2">
                  Assign Mentor *
                </label>
                <select
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
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

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? "Updating..." : "Update Project"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/projects")}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
