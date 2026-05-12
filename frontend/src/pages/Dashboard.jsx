import { useEffect, useState } from "react";
import {
  getDashboard,
  getProjects,
  getTasks,
  getNotifications,
  getActivities,
  getUsers,
  getAnalytics,
} from "../api";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import ProjectHealth from "../components/ProjectHealth";
import GanttChart from "../components/GanttChart";
import toast from "react-hot-toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    tasksCompleted: 0,
    pendingTasks: 0,
    overdueTasks: 0,
  });
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [team, setTeam] = useState({ students: [], mentors: [] });
  const [analytics, setAnalytics] = useState({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          statsRes,
          projectsRes,
          tasksRes,
          activitiesRes,
          usersRes,
          analyticsRes,
        ] = await Promise.all([
          getDashboard(),
          getProjects(),
          getTasks(),
          getActivities(),
          getUsers(),
          getAnalytics(),
        ]);
        setStats(statsRes.data);
        setProjects(projectsRes.data.slice(0, 4));
        setTasks(tasksRes.data);
        setActivities(activitiesRes.data.slice(0, 5));
        setTeam(usersRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate project progress stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const progressPercent = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  // Bar chart data for project status distribution
  const barChartData = {
    labels: analytics.labels?.length
      ? analytics.labels
      : ["Draft", "Submitted", "Under Review", "Approved", "Revisions"],
    datasets: [
      {
        label: "Number of Projects",
        data: analytics.values?.length ? analytics.values : [0, 0, 0, 0, 0],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderRadius: 8,
      },
    ],
  };

  // Doughnut chart for task completion
  const doughnutData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [completedTasks, totalTasks - completedTasks],
        backgroundColor: ["#10b981", "#f59e0b"],
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          title="Total Projects"
          value={stats.totalProjects || 0}
          change="+12%"
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <Card
          title="Tasks Completed"
          value={stats.tasksCompleted || 0}
          change="+8%"
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <Card
          title="Pending Tasks"
          value={stats.pendingTasks || 0}
          change="-5%"
          color="bg-gradient-to-br from-yellow-500 to-yellow-600"
        />
        <Card
          title="Overdue Tasks"
          value={stats.overdueTasks || 0}
          change="-20%"
          color="bg-gradient-to-br from-red-500 to-red-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Distribution */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-bold text-lg text-gray-800 mb-3">
            📊 Project Status Distribution
          </h3>
          <Bar
            data={barChartData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </div>

        {/* Task Completion Rate */}
        <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
          <h3 className="font-bold text-lg text-gray-800 mb-3">
            ✅ Task Completion Rate
          </h3>
          <div className="w-48 h-48">
            <Doughnut
              data={doughnutData}
              options={{
                cutout: "60%",
                plugins: { legend: { position: "bottom" } },
              }}
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-3xl font-bold text-gray-800">
              {progressPercent}%
            </p>
            <p className="text-sm text-gray-500">
              Completed out of {totalTasks} total tasks
            </p>
          </div>
        </div>
      </div>

      {/* Project Progress Overview & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-5">
          <h3 className="font-bold text-lg mb-3">
            📈 Project Progress Overview
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold text-blue-600">
                {progressPercent}%
              </p>
              <p className="text-gray-500">Overall Progress</p>
            </div>
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{progressPercent}%</span>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 56}
                  strokeDashoffset={
                    2 * Math.PI * 56 * (1 - progressPercent / 100)
                  }
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4 bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Tasks: {totalTasks}</span>
              <span>
                Completed: {completedTasks} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-bold text-lg mb-3">⏰ Upcoming Deadlines</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {tasks
              .filter((t) => t.status !== "completed")
              .slice(0, 5)
              .map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-gray-500">
                      {task.project_title}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium ${getDaysLeft(task.due_date) <= 2 ? "text-red-600" : getDaysLeft(task.due_date) <= 5 ? "text-yellow-600" : "text-green-600"}`}
                  >
                    {getDaysLeft(task.due_date)} days left
                  </span>
                </div>
              ))}
            {tasks.filter((t) => t.status !== "completed").length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No pending deadlines 🎉
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Activity Feed & Team Members */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-bold text-lg mb-3">🔄 Recent Activity</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {activities.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                  {act.user_name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{act.user_name}</span>{" "}
                    {act.action}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(act.created_at).toLocaleString()}
                  </p>
                  {act.details && (
                    <p className="text-xs text-gray-500 mt-1">{act.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-bold text-lg mb-3">👥 Team Members</h3>
          <div className="grid grid-cols-2 gap-3">
            {team.mentors?.slice(0, 4).map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm">{m.name}</p>
                  <p className="text-xs text-gray-500">Mentor</p>
                </div>
              </div>
            ))}
            {team.students?.slice(0, 4).map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gantt Chart & Health Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-5">
          <h3 className="font-bold text-lg mb-3">📅 Gantt Chart / Timeline</h3>
          <GanttChart projects={projects} />
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-bold text-lg mb-3">💚 Project Health Meter</h3>
          <ProjectHealth projects={projects} />
        </div>
      </div>

      {/* AI Assistant */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white rounded-xl shadow p-5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-bold text-xl">🤖 AI Assistant</h3>
          <p>Hi there! How can I help you today?</p>
          <div className="flex flex-wrap gap-3 mt-3">
            <button className="bg-white/20 hover:bg-white/30 px-4 py-1 rounded-full text-sm transition">
              Show overdue tasks
            </button>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-1 rounded-full text-sm transition">
              Project health report
            </button>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-1 rounded-full text-sm transition">
              Team productivity
            </button>
          </div>
        </div>
        <input
          type="text"
          placeholder="Ask something..."
          className="bg-white/20 rounded-full px-4 py-2 text-white placeholder-white/70 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
      </div>
    </div>
  );
}

function Card({ title, value, change, color }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`${color} rounded-xl shadow-lg text-white p-5 transition-all`}
    >
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <p className="text-xs mt-2 opacity-80">{change}</p>
    </motion.div>
  );
}

function getDaysLeft(dueDate) {
  if (!dueDate) return 0;
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}
