import React from "react";
import { useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(form);
      if (res.data.success) {
        setUser(res.data.user);
        toast.success("Registered successfully!");
        navigate("/dashboard");
      } else {
        toast.error(res.data.error);
      }
    } catch (err) {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Student Register
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-2 mb-3 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 mb-3 rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Roll Number"
            className="w-full border p-2 mb-3 rounded"
            value={form.roll_number}
            onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
            required
          />
          <select
            className="w-full border p-2 mb-3 rounded"
            value={form.branch}
            onChange={(e) => setForm({ ...form, branch: e.target.value })}
          >
            <option>CSE</option>
            <option>IT</option>
            <option>Mechanical</option>
            <option>Civil</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 mb-3 rounded"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border p-2 mb-3 rounded"
            value={form.password_confirmation}
            onChange={(e) =>
              setForm({ ...form, password_confirmation: e.target.value })
            }
            required
          />
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
