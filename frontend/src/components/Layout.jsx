import { Outlet, Link, useNavigate } from "react-router-dom";
import { logout } from "../api";
import toast from "react-hot-toast";

export default function Layout({ user, setUser }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login");
    toast.success("Logged out");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-900 text-white flex flex-col shadow-xl">
        <div className="p-5 border-b border-gray-700">
          <h2 className="text-2xl font-bold">📋 PMS</h2>
          <p className="text-xs text-gray-400">Project Management System</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems(user).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition"
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        {/* Logout button at bottom */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 p-3 rounded-lg hover:bg-red-600 transition"
          >
            <span className="text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            Welcome back, {user?.name}! 🎉
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 capitalize">{user?.role}</span>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
        <footer className="bg-white border-t p-4 text-center text-gray-500 text-sm">
          © 2026 Dr. C.V. Raman University | Developed by Nishi And Co
        </footer>
      </div>
    </div>
  );
}

function navItems(user) {
  const base = [
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
    base.push({ path: "/admin/users", label: "Manage Users", icon: "👤" });
  }
  return base;
}
