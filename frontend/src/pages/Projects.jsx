import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api";
import toast from "react-hot-toast";

export default function Register({ setUser }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    roll_number: "",
    branch: "CSE",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email is invalid";
    if (!form.roll_number.trim())
      newErrors.roll_number = "Roll number is required";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 4)
      newErrors.password = "Password must be at least 4 characters";
    if (form.password !== form.password_confirmation)
      newErrors.password_confirmation = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await register(form);
      if (res.data.success) {
        setUser(res.data.user);
        toast.success("Registration successful! Welcome aboard 🎉");
        navigate("/dashboard");
      } else {
        toast.error(res.data.error || "Registration failed");
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Something went wrong";
      toast.error(msg);
      if (msg.includes("Email")) setErrors({ email: msg });
      else if (msg.includes("Roll")) setErrors({ roll_number: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-teal-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-5">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>📝</span> Student Registration
          </h2>
          <p className="text-green-100 text-sm mt-1">
            Join the CVR Project Management System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Full Name *
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Email Address *
            </label>
            <input
              type="email"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Roll Number */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Roll Number *
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.roll_number ? "border-red-500" : "border-gray-300"
              }`}
              value={form.roll_number}
              onChange={(e) =>
                setForm({ ...form, roll_number: e.target.value })
              }
            />
            {errors.roll_number && (
              <p className="text-red-500 text-xs mt-1">{errors.roll_number}</p>
            )}
          </div>

          {/* Branch */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Branch
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
            >
              <option value="CSE">Computer Science (CSE)</option>
              <option value="IT">Information Technology (IT)</option>
              <option value="Mechanical">Mechanical Engineering</option>
              <option value="Civil">Civil Engineering</option>
              <option value="ECE">Electronics & Communication</option>
              <option value="EEE">Electrical & Electronics</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Password *
            </label>
            <input
              type="password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Confirm Password *
            </label>
            <input
              type="password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.password_confirmation
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              value={form.password_confirmation}
              onChange={(e) =>
                setForm({ ...form, password_confirmation: e.target.value })
              }
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password_confirmation}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating account...
              </span>
            ) : (
              "Register Now →"
            )}
          </button>

          <p className="text-center text-gray-600 text-sm mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 hover:underline font-semibold"
            >
              Sign in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
