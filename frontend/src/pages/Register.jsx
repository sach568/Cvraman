import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    let err = {};
    if (!form.name) err.name = "Name is required";
    if (!form.email) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Email is invalid";
    if (!form.roll_number) err.roll_number = "Roll number is required";
    if (!form.password) err.password = "Password is required";
    else if (form.password.length < 6)
      err.password = "Password must be at least 6 characters";
    if (form.password !== form.password_confirmation)
      err.password_confirmation = "Passwords do not match";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await register(form);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Registration successful!");
        navigate("/dashboard");
      } else {
        toast.error(res.data.error);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Student Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              name="name"
              placeholder="Full Name"
              className={`w-full border p-2 rounded ${errors.name ? "border-red-500" : "border-gray-300"}`}
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              className={`w-full border p-2 rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              name="roll_number"
              placeholder="Roll Number"
              className={`w-full border p-2 rounded ${errors.roll_number ? "border-red-500" : "border-gray-300"}`}
              value={form.roll_number}
              onChange={handleChange}
            />
            {errors.roll_number && (
              <p className="text-red-500 text-xs">{errors.roll_number}</p>
            )}
          </div>
          <select
            name="branch"
            className="w-full border p-2 rounded"
            value={form.branch}
            onChange={handleChange}
          >
            <option>CSE</option>
            <option>IT</option>
            <option>Mechanical</option>
            <option>Civil</option>
          </select>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              className={`w-full border p-2 rounded ${errors.password ? "border-red-500" : "border-gray-300"}`}
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>
          <div>
            <input
              name="password_confirmation"
              type="password"
              placeholder="Confirm Password"
              className={`w-full border p-2 rounded ${errors.password_confirmation ? "border-red-500" : "border-gray-300"}`}
              value={form.password_confirmation}
              onChange={handleChange}
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-xs">
                {errors.password_confirmation}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
