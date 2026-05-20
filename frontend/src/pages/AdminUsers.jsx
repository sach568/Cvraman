import React, { useState, useEffect } from "react";
import { getUsers, createUser } from "../api";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState({ students: [], mentors: [] });
  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    roll_number: "",
    branch: "CSE",
  });
  const [mentorForm, setMentorForm] = useState({ name: "", email: "" });
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [loadingMentor, setLoadingMentor] = useState(false);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  // Validate student form
  const validateStudent = () => {
    if (!studentForm.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!studentForm.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentForm.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!studentForm.roll_number.trim()) {
      toast.error("Roll number is required");
      return false;
    }
    return true;
  };

  // Validate mentor form
  const validateMentor = () => {
    if (!mentorForm.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!mentorForm.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mentorForm.email)) {
      toast.error("Invalid email format");
      return false;
    }
    return true;
  };

  const addStudent = async () => {
    if (!validateStudent()) return;
    setLoadingStudent(true);
    try {
      await createUser("student", studentForm);
      toast.success("Student added successfully");
      setStudentForm({ name: "", email: "", roll_number: "", branch: "CSE" });
      fetch();
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to add student";
      toast.error(errorMsg);
    } finally {
      setLoadingStudent(false);
    }
  };

  const addMentor = async () => {
    if (!validateMentor()) return;
    setLoadingMentor(true);
    try {
      await createUser("mentor", mentorForm);
      toast.success("Mentor added successfully");
      setMentorForm({ name: "", email: "" });
      fetch();
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to add mentor";
      toast.error(errorMsg);
    } finally {
      setLoadingMentor(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">👥 Manage Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Add Student Card */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-3">Add Student</h3>
          <input
            placeholder="Name *"
            className="w-full border p-2 mb-2"
            value={studentForm.name}
            onChange={(e) =>
              setStudentForm({ ...studentForm, name: e.target.value })
            }
          />
          <input
            placeholder="Email *"
            className="w-full border p-2 mb-2"
            value={studentForm.email}
            onChange={(e) =>
              setStudentForm({ ...studentForm, email: e.target.value })
            }
          />
          <input
            placeholder="Roll Number *"
            className="w-full border p-2 mb-2"
            value={studentForm.roll_number}
            onChange={(e) =>
              setStudentForm({ ...studentForm, roll_number: e.target.value })
            }
          />
          <select
            className="w-full border p-2 mb-2"
            value={studentForm.branch}
            onChange={(e) =>
              setStudentForm({ ...studentForm, branch: e.target.value })
            }
          >
            <option>CSE</option>
            <option>IT</option>
            <option>Mechanical</option>
            <option>Civil</option>
          </select>
          <button
            onClick={addStudent}
            disabled={loadingStudent}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loadingStudent ? "Adding..." : "Add Student"}
          </button>
        </div>

        {/* Add Mentor Card */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-3">Add Mentor</h3>
          <input
            placeholder="Name *"
            className="w-full border p-2 mb-2"
            value={mentorForm.name}
            onChange={(e) =>
              setMentorForm({ ...mentorForm, name: e.target.value })
            }
          />
          <input
            placeholder="Email *"
            className="w-full border p-2 mb-2"
            value={mentorForm.email}
            onChange={(e) =>
              setMentorForm({ ...mentorForm, email: e.target.value })
            }
          />
          <button
            onClick={addMentor}
            disabled={loadingMentor}
            className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loadingMentor ? "Adding..." : "Add Mentor"}
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Students ({users.students.length})</h3>
          {users.students.length === 0 ? (
            <p className="text-gray-500 text-sm">No students yet</p>
          ) : (
            users.students.map((s) => (
              <div key={s.id} className="border-b py-1">
                {s.name} ({s.roll_number}) - {s.branch}
              </div>
            ))
          )}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Mentors ({users.mentors.length})</h3>
          {users.mentors.length === 0 ? (
            <p className="text-gray-500 text-sm">No mentors yet</p>
          ) : (
            users.mentors.map((m) => (
              <div key={m.id} className="border-b py-1">
                {m.name} - {m.email}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
