import React, { useState, useEffect } from "react";
import { getActivities } from "../api";

export default function ActivityFeed({ projectId = null, limit = 10 }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const url = projectId
        ? `/activities.php?project_id=${projectId}`
        : "/activities.php";
      const res = await getActivities(url);
      setActivities(res.data.slice(0, limit));
    } catch (err) {
      console.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, [projectId, limit]);

  if (loading)
    return <div className="text-center py-4">Loading activities...</div>;
  if (activities.length === 0)
    return (
      <div className="text-center py-4 text-gray-500">No recent activity</div>
    );

  return (
    <div className="space-y-3">
      {activities.map((act) => (
        <div
          key={act.id}
          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
        >
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {act.user_name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-semibold">{act.user_name}</span>{" "}
              <span className="text-gray-700">{act.action}</span>
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
  );
}
