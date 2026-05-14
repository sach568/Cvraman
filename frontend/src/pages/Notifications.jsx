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
      console.error("Failed to load notifications");
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
      case "inactivity":
        return "💤";
      case "motivation":
        return "🎉";
      default:
        return "🔔";
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span>🔔</span> Notifications
        </h2>
        <p className="text-gray-500 text-sm">
          Stay updated with your project activities
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500">No notifications yet</p>
            <p className="text-gray-400 text-sm">
              We'll notify you when something happens
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notif) => (
              <div key={notif.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getIcon(notif.type)}</div>
                  <div className="flex-1">
                    <p className="text-gray-800">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!notif.is_read && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
