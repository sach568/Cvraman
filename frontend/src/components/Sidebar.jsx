import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar({ user, setUser }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/projects", label: "Projects", icon: "📁" },
    { path: "/tasks", label: "Tasks", icon: "✅" },
    { path: "/kanban", label: "Kanban Board", icon: "🎯" },
    { path: "/calendar", label: "Calendar", icon: "📅" },
    { path: "/team", label: "Team", icon: "👥" },
    { path: "/analytics", label: "Analytics", icon: "📈" },
    { path: "/messages", label: "Messages", icon: "💬" },
    { path: "/files", label: "Files", icon: "📎" },
  ];

  if (user?.role === "admin") {
    navItems.push({ path: "/admin/users", label: "Manage Users", icon: "👤" });
  }

  return (
    <aside className="w-72 bg-gray-900 text-white flex flex-col shadow-xl h-screen sticky top-0">
      <div className="p-5 border-b border-gray-700">
        <h2 className="text-2xl font-bold">📋 PMS</h2>
        <p className="text-xs text-gray-400">Project Management System</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
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
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600 transition mt-8"
        >
          <span>🚪</span> <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
