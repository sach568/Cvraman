import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProject, getSubjects, getUsers } from "../api";
import toast from "react-hot-toast";

export default function CreateProject() {
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
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getSubjects().then((res) => setSubjects(res.data));
    getUsers().then((res) => setMentors(res.data.mentors));
  }, []);

  const validate = () => {
    let err = {};
    if (!form.title.trim()) err.title = "Title is required";
    if (!form.description.trim()) err.description = "Description is required";
    if (!form.subject_id) err.subject_id = "Subject is required";
    if (!form.mentor_id) err.mentor_id = "Mentor is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append("file", file);
    try {
      await createProject(fd);
      toast.success("Project created successfully!");
      navigate("/projects");
    } catch (err) {
      toast.error(err.response?.data?.error || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
          ✨ Create New Project
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Fill in the details to add a new project
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Project Title *
            </label>
            <input
              type="text"
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 ${errors.title ? "border-red-500" : "border-gray-300"}`}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Description *
            </label>
            <textarea
              rows="5"
              className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? "border-red-500" : "border-gray-300"}`}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Subject *
              </label>
              <select
                className={`w-full border rounded-lg px-4 py-2 bg-white ${errors.subject_id ? "border-red-500" : "border-gray-300"}`}
                value={form.subject_id}
                onChange={(e) =>
                  setForm({ ...form, subject_id: e.target.value })
                }
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.subject_id && (
                <p className="text-red-500 text-xs mt-1">{errors.subject_id}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Mentor *
              </label>
              <select
                className={`w-full border rounded-lg px-4 py-2 bg-white ${errors.mentor_id ? "border-red-500" : "border-gray-300"}`}
                value={form.mentor_id}
                onChange={(e) =>
                  setForm({ ...form, mentor_id: e.target.value })
                }
              >
                <option value="">Select Mentor</option>
                {mentors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              {errors.mentor_id && (
                <p className="text-red-500 text-xs mt-1">{errors.mentor_id}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Upload File (PDF/Image)
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <input
                id="fileInput"
                type="file"
                accept=".jpg,.jpeg,.pdf,.png"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {file ? (
                <div className="text-green-600">
                  <p>{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">Click to change</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500">Click or drag to upload</p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG, PDF up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Creating..." : "Create Project"}
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
