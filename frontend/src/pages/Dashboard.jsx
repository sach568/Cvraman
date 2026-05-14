import React, { useEffect, useState } from "react";
import { getDashboard, getProjects, getTasks } from "../api";
import ActivityFeed from "../components/ActivityFeed";
import GanttChart from "../components/GanttChart";
import ProjectHealth from "../components/ProjectHealth";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
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

  useEffect(() => {
    getDashboard().then((res) => setStats(res.data));
    getProjects().then((res) => setProjects(res.data.slice(0, 5)));
    getTasks().then((res) => setTasks(res.data));
  }, []);

  const chartData = {
    labels: tasks.map((t) => t.title?.slice(0, 15)),
    datasets: [
      {
        label: "Progress",
        data: tasks.map((t) =>
          t.status === "completed" ? 100 : t.status === "in_progress" ? 50 : 0,
        ),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          color="bg-blue-500"
        />
        <StatCard
          title="Tasks Completed"
          value={stats.tasksCompleted}
          color="bg-green-500"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          color="bg-yellow-500"
        />
        <StatCard
          title="Overdue Tasks"
          value={stats.overdueTasks}
          color="bg-red-500"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow">
          <h3 className="font-bold text-lg mb-3">📊 Task Progress</h3>
          <Bar data={chartData} />
        </div>
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-bold text-lg mb-3">💚 Project Health</h3>
          <ProjectHealth projects={projects} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-bold text-lg mb-3">🔄 Recent Activity</h3>
          <ActivityFeed limit={5} />
        </div>
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-bold text-lg mb-3">📅 Gantt Chart</h3>
          <GanttChart />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className={`${color} rounded-xl shadow-lg text-white p-5`}>
      <p className="text-sm opacity-90">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
