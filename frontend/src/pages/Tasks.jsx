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
      console.error("Failed to load projects");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers([...res.data.students, ...res.data.mentors]);
    } catch (err) {
      console.error("Failed to load users");
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.project_id || !form.title) {
      toast.error("Project and Title are required");
      return;
    }
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
    if (!confirm("Delete this task permanently?")) return;
    try {
      await deleteTask(id);
      toast.success("Task deleted");
      fetchTasks();
    } catch (err) {
      toast.error("Delete failed");
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
            ✅ Task Manager
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Create, track, and manage your project tasks
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "pending", "in_progress", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === status
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status === "all"
              ? "📋 All"
              : status === "pending"
                ? "⏳ Pending"
                : status === "in_progress"
                  ? "🚧 In Progress"
                  : "✅ Completed"}
          </button>
        ))}
      </div>

      {/* Task Cards Grid */}
      {tasks.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm text-center py-16">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-gray-500">
            No tasks found. Create your first task!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-100"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                    {task.title}
                  </h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditModal(task)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded-lg hover:bg-blue-50 transition"
                      title="Edit"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50 transition"
                      title="Delete"
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
                </div>

                {task.description && (
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {task.description}
                  </p>
                )}

                <div className="mt-3 space-y-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>📁</span>{" "}
                    {task.project_title || "Project ID: " + task.project_id}
                  </p>
                  {task.due_date && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span>📅</span> Due:{" "}
                      {new Date(task.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task.id, e.target.value)
                    }
                    className="text-sm border rounded-lg px-2 py-1 bg-gray-50 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="in_progress">🚧 In Progress</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                  <span className="text-xs text-gray-400">ID: {task.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========== MODAL FORM WITH ENHANCED CSS ========== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 animate-fadeInUp">
            {/* Modal Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {editingTask ? "✏️ Edit Task" : "➕ Create New Task"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-white/80 hover:text-white transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Form Body with Better Spacing */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Project Select */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Project <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white shadow-sm"
                  value={form.project_id}
                  onChange={(e) =>
                    setForm({ ...form, project_id: e.target.value })
                  }
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Task Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Design Homepage"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white shadow-sm"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe the task details..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white shadow-sm resize-none"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              {/* Due Date & Assign To - side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white shadow-sm"
                    value={form.due_date}
                    onChange={(e) =>
                      setForm({ ...form, due_date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Assign To
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white shadow-sm"
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

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white shadow-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="in_progress">🚧 In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-medium shadow-md disabled:opacity-50 flex items-center gap-2"
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
                  ) : editingTask ? (
                    "Update Task"
                  ) : (
                    "Create Task"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
