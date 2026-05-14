import React, { useEffect, useState } from "react";
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
import { getAnalytics } from "../api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function Analytics() {
  const [data, setData] = useState({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await getAnalytics();
      setData(res.data);
    } catch (err) {
      console.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  // Custom chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14, weight: "bold" },
          color: "#374151",
          usePointStyle: true,
          pointStyle: "rectRounded",
        },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#f3f4f6",
        bodyColor: "#d1d5db",
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${context.raw} projects`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#e5e7eb", drawBorder: true },
        title: {
          display: true,
          text: "Number of Projects",
          color: "#6b7280",
          font: { weight: "bold", size: 12 },
        },
        ticks: { stepSize: 1, precision: 0 },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: "#374151",
          font: { weight: "500" },
          maxRotation: 45,
          minRotation: 30,
        },
      },
    },
    layout: { padding: { top: 20, right: 20, bottom: 10, left: 10 } },
  };

  const chartData = {
    labels: data.labels.map((label) => label.replace(/_/g, " ").toUpperCase()),
    datasets: [
      {
        label: "Projects",
        data: data.values,
        backgroundColor: [
          "#3b82f6", // blue
          "#f59e0b", // amber
          "#10b981", // emerald
          "#ef4444", // red
          "#8b5cf6", // violet
          "#ec4899", // pink
          "#06b6d4", // cyan
        ],
        borderRadius: 8,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
        hoverBackgroundColor: "#2563eb",
      },
    ],
  };

  // Calculate total projects
  const totalProjects = data.values.reduce((sum, v) => sum + v, 0);
  const mostCommon = data.labels.length
    ? data.labels[data.values.indexOf(Math.max(...data.values))].replace(
        /_/g,
        " ",
      )
    : "None";

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data.labels.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-700">No Data Yet</h3>
        <p className="text-gray-500 mt-2">
          Create projects to see analytics here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-5 text-white">
          <p className="text-sm opacity-90">Total Projects</p>
          <p className="text-3xl font-bold mt-1">{totalProjects}</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-5 text-white">
          <p className="text-sm opacity-90">Most Common Status</p>
          <p className="text-2xl font-bold mt-1 capitalize">{mostCommon}</p>
        </div>
      </div>

      {/* Chart Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                📊 Project Analytics
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Distribution of projects by status
              </p>
            </div>
            <div className="text-3xl">📈</div>
          </div>
        </div>
        <div className="p-6">
          <div className="h-96">
            <Bar data={chartData} options={options} />
          </div>
        </div>
      </div>

      {/* Insight Note */}
      {totalProjects > 0 && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5"
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
            <div>
              <p className="text-blue-800 text-sm font-medium">Insight</p>
              <p className="text-blue-700 text-sm">
                {data.values[data.labels.indexOf("approved")] >
                totalProjects / 2
                  ? "✅ Great progress! Most projects are approved."
                  : data.values[data.labels.indexOf("submitted")] > 0
                    ? "📌 Some projects are pending review. Mentors, please check your assigned projects."
                    : "📝 Start creating projects to see meaningful analytics."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
