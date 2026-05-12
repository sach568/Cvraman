import { useEffect, useState } from "react";
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
import api from "../api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function Analytics() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [summary, setSummary] = useState({ total: 0, statusCounts: {} });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/analytics.php");
      const data = res.data;
      setChartData({
        labels: data.labels,
        datasets: [
          {
            label: "Number of Projects",
            data: data.values,
            backgroundColor: [
              "#3b82f6", // blue
              "#f59e0b", // amber
              "#10b981", // emerald
              "#ef4444", // red
              "#8b5cf6", // violet
              "#ec4899", // pink
            ],
            borderRadius: 8,
            barPercentage: 0.7,
            categoryPercentage: 0.8,
          },
        ],
      });

      // Calculate summary
      const total = data.values.reduce((sum, val) => sum + val, 0);
      const statusCounts = {};
      data.labels.forEach((label, idx) => {
        statusCounts[label] = data.values[idx];
      });
      setSummary({ total, statusCounts });
    } catch (err) {
      console.error("Failed to load analytics", err);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 12, weight: "bold" },
          color: "#374151",
        },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#f3f4f6",
        bodyColor: "#d1d5db",
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${context.raw} projects`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#e5e7eb" },
        title: {
          display: true,
          text: "Number of Projects",
          color: "#6b7280",
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#374151", fontWeight: "500" },
      },
    },
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
          📈 Project Analytics
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Visual insights into project status distribution
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-gray-500 text-xs uppercase font-semibold">
            Total Projects
          </p>
          <p className="text-2xl font-bold text-gray-800">{summary.total}</p>
        </div>
        {Object.entries(summary.statusCounts).map(([status, count]) => (
          <div
            key={status}
            className="bg-white rounded-xl shadow-sm p-4 border-l-4"
            style={{ borderLeftColor: getStatusColor(status) }}
          >
            <p className="text-gray-500 text-xs uppercase font-semibold">
              {status.replace("_", " ")}
            </p>
            <p className="text-2xl font-bold text-gray-800">{count}</p>
          </div>
        ))}
      </div>

      {/* Chart Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="h-96">
          <Bar data={chartData} options={options} />
        </div>
      </div>

      {/* Insight Note */}
      {summary.total > 0 && (
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-blue-800 text-sm">
              Most projects are in{" "}
              <strong>{getMostCommonStatus(summary.statusCounts)}</strong>{" "}
              status.
              {summary.statusCounts.approved < summary.total / 2 &&
                " Keep reviewing to move projects forward."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status) {
  const colors = {
    draft: "#6b7280",
    submitted: "#f59e0b",
    under_review: "#3b82f6",
    approved: "#10b981",
    revisions_needed: "#ef4444",
  };
  return colors[status] || "#6b7280";
}

function getMostCommonStatus(statusCounts) {
  if (Object.keys(statusCounts).length === 0) return "none";
  return Object.entries(statusCounts)
    .reduce((a, b) => (a[1] > b[1] ? a : b))[0]
    .replace("_", " ");
}
