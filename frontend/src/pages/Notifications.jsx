import React, { useEffect, useState } from "react";
import { getNotifications } from "../api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);
  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const getIcon = (type) => {
    switch (type) {
      case "deadline":
        return "⏰";
      case "overdue":
        return "⚠️";
      case "motivation":
        return "🎉";
      default:
        return "🔔";
    }
  };
  if (loading) return <div className="text-center py-10">Loading...</div>;
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
        🔔 Notifications
      </h2>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">📭 No notifications</div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="p-4 border-b flex gap-3">
              <div className="text-2xl">{getIcon(n.type)}</div>
              <div>
                <p>{n.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>
              {!n.is_read && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  New
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
