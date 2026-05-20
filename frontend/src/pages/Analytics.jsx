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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="text-center py-10">Loading analytics...</div>;
  if (!data.labels.length)
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        📊 No data yet. Create projects.
      </div>
    );

  const total = data.values.reduce((a, b) => a + b, 0);
  const mostCommon =
    data.labels[data.values.indexOf(Math.max(...data.values))]?.replace(
      /_/g,
      " ",
    ) || "None";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-500 rounded-xl p-5 text-white">
          <p>Total Projects</p>
          <p className="text-3xl font-bold">{total}</p>
        </div>
        <div className="bg-indigo-500 rounded-xl p-5 text-white">
          <p>Most Common Status</p>
          <p className="text-2xl font-bold capitalize">{mostCommon}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-2xl font-bold mb-4">📊 Project Analytics</h2>
        <div className="h-96">
          <Bar
            data={{
              labels: data.labels.map((l) =>
                l.replace(/_/g, " ").toUpperCase(),
              ),
              datasets: [
                {
                  label: "Projects",
                  data: data.values,
                  backgroundColor: "#3b82f6",
                },
              ],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </div>
    </div>
  );
}
