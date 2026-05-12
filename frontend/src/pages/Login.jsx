import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import toast from "react-hot-toast";

export default function Login({ setUser }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      if (res.data.success) {
        setUser(res.data.user);
        toast.success(`Welcome ${res.data.user.name}`);
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Three Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-4 text-lg font-semibold transition ${
              role === "student"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setRole("student")}
          >
            👨‍🎓 Student
          </button>
          <button
            className={`flex-1 py-4 text-lg font-semibold transition ${
              role === "mentor"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setRole("mentor")}
          >
            👨‍🏫 Mentor
          </button>
          <button
            className={`flex-1 py-4 text-lg font-semibold transition ${
              role === "admin"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setRole("admin")}
          >
            🔧 Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {role === "student"
                ? "Student Email"
                : role === "mentor"
                  ? "Mentor Email"
                  : "Admin Email"}
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="email@cvr.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" className="mr-2 rounded" /> Remember me
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-[1.02]"
          >
            Login →
          </button>
          <p className="text-center text-gray-600 mt-6 text-sm">
            New student?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:underline font-semibold"
            >
              Create an account
            </a>
          </p>
        </form>

        {/* Demo Credentials Hint */}
        <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 text-center border-t">
          <p>
            Demo: student@cvr.edu / student123 &nbsp;|&nbsp; mentor@cvr.edu /
            mentor123 &nbsp;|&nbsp; admin@cvr.edu / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
