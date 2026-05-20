import React, { useState, useEffect } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getProjects,
  getUsers,
} from "../api";
import toast from "react-hot-toast";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    project_id: "",
    title: "",
    description: "",
    due_date: "",
    assigned_to: "",
    status: "pending",
  });

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchUsers();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const res = await getTasks(filter);
      setTasks(res.data);
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  };
  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers([...res.data.students, ...res.data.mentors]);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setForm({
      project_id: "",
      title: "",
      description: "",
      due_date: "",
      assigned_to: "",
      status: "pending",
    });
    setEditingTask(null);
    setErrors({});
  };
  const validateForm = () => {
    let err = {};
    if (!form.project_id) err.project_id = "Project required";
    if (!form.title.trim()) err.title = "Title required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, form);
        toast.success("Task updated");
      } else {
        await createTask(form);
        toast.success("Task created");
      }
      setShowModal(false);
      resetForm();
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this task?")) {
      try {
        await deleteTask(id);
        toast.success("Deleted");
        fetchTasks();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };
  const openEditModal = (task) => {
    setEditingTask(task);
    setForm({
      project_id: task.project_id,
      title: task.title,
      description: task.description || "",
      due_date: task.due_date || "",
      assigned_to: task.assigned_to || "",
      status: task.status,
    });
    setShowModal(true);
  };
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      toast.success("Status updated");
      fetchTasks();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
          ✅ Task Manager
        </h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          ➕ New Task
        </button>
      </div>
      <div className="flex gap-2 mb-6">
        {["all", "pending", "in_progress", "completed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1 rounded-full text-sm ${filter === s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            {s === "all"
              ? "📋 All"
              : s === "pending"
                ? "⏳ Pending"
                : s === "in_progress"
                  ? "🚧 In Progress"
                  : "✅ Completed"}
          </button>
        ))}
      </div>
      {tasks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl">
          📭 No tasks yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-2xl shadow-md p-5">
              <div className="flex justify-between">
                <h3 className="text-lg font-bold">{task.title}</h3>
                <div>
                  <button
                    onClick={() => openEditModal(task)}
                    className="text-blue-600"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 ml-2"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              {task.description && (
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="mt-3 text-xs text-gray-500">
                📁 {task.project_title || `Project #${task.project_id}`}
              </div>
              {task.due_date && (
                <div className="text-xs text-gray-500">
                  📅 Due: {new Date(task.due_date).toLocaleDateString()}
                </div>
              )}
              <div className="mt-4 flex justify-between items-center">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="text-sm border rounded-lg px-2 py-1"
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="in_progress">🚧 In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>
                <span className="text-xs text-gray-400">ID: {task.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">
              {editingTask ? "✏️ Edit Task" : "➕ Create Task"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label>Project *</label>
                <select
                  className={`w-full border rounded-lg p-2 ${errors.project_id ? "border-red-500" : ""}`}
                  value={form.project_id}
                  onChange={(e) =>
                    setForm({ ...form, project_id: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
                {errors.project_id && (
                  <p className="text-red-500 text-xs">{errors.project_id}</p>
                )}
              </div>
              <div>
                <label>Title *</label>
                <input
                  type="text"
                  className={`w-full border rounded-lg p-2 ${errors.title ? "border-red-500" : ""}`}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs">{errors.title}</p>
                )}
              </div>
              <div>
                <label>Description</label>
                <textarea
                  rows="2"
                  className="w-full border rounded-lg p-2"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>Due Date</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg p-2"
                    value={form.due_date}
                    onChange={(e) =>
                      setForm({ ...form, due_date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label>Assign To</label>
                  <select
                    className="w-full border rounded-lg p-2"
                    value={form.assigned_to}
                    onChange={(e) =>
                      setForm({ ...form, assigned_to: e.target.value })
                    }
                  >
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label>Status</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {loading ? "Saving..." : editingTask ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
