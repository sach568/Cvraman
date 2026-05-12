import { useEffect, useState } from "react";
import api, { createTask, updateTask, deleteTask } from "../api";
import toast from "react-hot-toast";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
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
    const res = await api.get(`/tasks.php?status=${filter}`);
    setTasks(res.data);
  };

  const fetchProjects = async () => {
    const res = await api.get("/projects.php");
    setProjects(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get("/users.php");
    setUsers([...res.data.students, ...res.data.mentors]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this task?")) {
      await deleteTask(id);
      toast.success("Deleted");
      fetchTasks();
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

  // Quick status change using the same updateTask
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
          ✅ Tasks
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition"
        >
          + New Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "pending", "in_progress", "completed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === s
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {s.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500">No tasks found. Create one!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {task.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {task.description || "No description"}
              </p>
              <p className="text-xs text-gray-500 mb-1">
                Project: {task.project_title}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Due: {task.due_date || "Not set"}
              </p>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                {/* Status Dropdown - working */}
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="border rounded-lg px-3 py-1 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(task)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded-lg hover:bg-blue-50 transition"
                    title="Edit Task"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded-lg hover:bg-red-50 transition"
                    title="Delete Task"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingTask ? "Edit Task" : "Create New Task"}
            </h3>
            <form onSubmit={handleSubmit}>
              <select
                className="w-full border rounded-lg p-2 mb-3"
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

              <input
                type="text"
                placeholder="Task Title"
                className="w-full border rounded-lg p-2 mb-3"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <textarea
                placeholder="Description"
                className="w-full border rounded-lg p-2 mb-3"
                rows="2"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <input
                type="date"
                className="w-full border rounded-lg p-2 mb-3"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />

              <select
                className="w-full border rounded-lg p-2 mb-3"
                value={form.assigned_to}
                onChange={(e) =>
                  setForm({ ...form, assigned_to: e.target.value })
                }
              >
                <option value="">Assign to (optional)</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>

              <select
                className="w-full border rounded-lg p-2 mb-4"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {editingTask ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
