import { Outlet, Link, useNavigate } from "react-router-dom";
import { logout, getNotifications } from "../api";
import toast from "react-hot-toast";
import { useState, useEffect, useRef } from "react";

export default function Layout({ user, setUser }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications every 30 seconds
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login");
    toast.success("Logged out");
  };

  // Navigation items based on role – Dashboard always first
  const getNavItems = () => {
    const restCommon = [
      { path: "/tasks", label: "Tasks", icon: "✅" },
      { path: "/notifications", label: "Notifications", icon: "🔔" },
      { path: "/kanban", label: "Kanban", icon: "🎯" },
      { path: "/calendar", label: "Calendar", icon: "📅" },
      { path: "/team", label: "Team", icon: "👥" },
      { path: "/analytics", label: "Analytics", icon: "📈" },
      { path: "/messages", label: "Messages", icon: "💬" },
      { path: "/files", label: "Files", icon: "📎" },
    ];

    let roleSpecific = [];
    if (user?.role === "student") {
      roleSpecific = [
        { path: "/projects", label: "My Projects", icon: "📁" },
        { path: "/projects/create", label: "New Project", icon: "➕" },
      ];
    } else if (user?.role === "mentor") {
      roleSpecific = [
        { path: "/projects", label: "Assigned Projects", icon: "📋" },
      ];
    } else if (user?.role === "admin") {
      roleSpecific = [
        { path: "/admin/subjects", label: "Subjects", icon: "📚" },
        { path: "/admin/users", label: "Manage Users", icon: "👤" },
      ];
    }

    return [
      { path: "/dashboard", label: "Dashboard", icon: "📊" },
      ...roleSpecific,
      ...restCommon,
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (unchanged) */}
      <aside className="w-72 bg-gray-900 text-white flex flex-col shadow-xl">
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-2xl font-bold">📋 PMS</h2>
          <p className="text-xs text-gray-400">Project Management System</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 p-3 rounded-lg hover:bg-red-600 transition"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            Welcome back, {user?.name}! 🎉
          </h1>
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">
                      Notifications
                    </h3>
                    <Link
                      to="/notifications"
                      className="text-xs text-blue-600 hover:underline"
                      onClick={() => setShowNotifications(false)}
                    >
                      View all
                    </Link>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notif) => (
                        <div
                          key={notif.id}
                          className="p-3 border-b border-gray-100 hover:bg-gray-50"
                        >
                          <p className="text-sm text-gray-800">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notif.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User info */}
            <span className="text-gray-600 capitalize">{user?.role}</span>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

        <footer className="bg-white border-t p-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Dr. C.V. Raman University | Developed by
          Nishi And Co
        </footer>
      </div>
    </div>
  );
}
