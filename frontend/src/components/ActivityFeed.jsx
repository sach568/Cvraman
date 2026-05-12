import { useEffect, useState } from "react";
import api from "../api";

export default function ActivityFeed({ projectId = null }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const url = projectId
      ? `/activities.php?project_id=${projectId}`
      : "/activities.php";
    api.get(url).then((res) => setActivities(res.data));
  }, [projectId]);

  return (
    <div className="space-y-3">
      {activities.map((act) => (
        <div
          key={act.id}
          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
        >
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            {act.user_name?.charAt(0)}
          </div>
          <div>
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
  );
}
