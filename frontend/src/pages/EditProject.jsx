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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, subjectsRes, usersRes] = await Promise.all([
          getProject(id),
          getSubjects(),
          getUsers(),
        ]);
        const p = projectRes.data;
        setForm({
          title: p.title,
          description: p.description,
          branch: p.branch,
          subject_id: p.subject_id,
          mentor_id: p.mentor_id,
          deadline: p.deadline || "",
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

  const validate = () => {
    let err = {};
    if (!form.title.trim()) err.title = "Title required";
    if (!form.description.trim()) err.description = "Description required";
    if (!form.subject_id) err.subject_id = "Subject required";
    if (!form.mentor_id) err.mentor_id = "Mentor required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await updateProject(id, form);
      toast.success("Project updated!");
      navigate("/projects");
    } catch (err) {
      toast.error(err.response?.data?.error || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center h-64 items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-teal-600 bg-clip-text text-transparent mb-4">
        ✏️ Edit Project
      </h2>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold">Title *</label>
            <input
              type="text"
              className={`w-full border rounded-lg px-4 py-2 ${errors.title ? "border-red-500" : "border-gray-300"}`}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="block font-semibold">Description *</label>
            <textarea
              rows="5"
              className={`w-full border rounded-lg px-4 py-2 resize-none ${errors.description ? "border-red-500" : "border-gray-300"}`}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            {errors.description && (
              <p className="text-red-500 text-xs">{errors.description}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Branch</label>
              <select
                className="w-full border rounded-lg px-4 py-2"
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
              <label>Deadline</label>
              <input
                type="date"
                className="w-full border rounded-lg px-4 py-2"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Subject *</label>
              <select
                className={`w-full border rounded-lg px-4 py-2 ${errors.subject_id ? "border-red-500" : "border-gray-300"}`}
                value={form.subject_id}
                onChange={(e) =>
                  setForm({ ...form, subject_id: e.target.value })
                }
              >
                <option value="">Select</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.subject_id && (
                <p className="text-red-500 text-xs">{errors.subject_id}</p>
              )}
            </div>
            <div>
              <label>Mentor *</label>
              <select
                className={`w-full border rounded-lg px-4 py-2 ${errors.mentor_id ? "border-red-500" : "border-gray-300"}`}
                value={form.mentor_id}
                onChange={(e) =>
                  setForm({ ...form, mentor_id: e.target.value })
                }
              >
                <option value="">Select</option>
                {mentors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              {errors.mentor_id && (
                <p className="text-red-500 text-xs">{errors.mentor_id}</p>
              )}
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold py-2 rounded-lg"
            >
              Update Project
            </button>
            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
