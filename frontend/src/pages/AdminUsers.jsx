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
  useEffect(() => {
    fetch();
  }, []);
  const fetch = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };
  const addStudent = async () => {
    await createUser("student", studentForm);
    toast.success("Student added");
    setStudentForm({ name: "", email: "", roll_number: "", branch: "CSE" });
    fetch();
  };
  const addMentor = async () => {
    await createUser("mentor", mentorForm);
    toast.success("Mentor added");
    setMentorForm({ name: "", email: "" });
    fetch();
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">👥 Manage Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-3">Add Student</h3>
          <input
            placeholder="Name"
            className="w-full border p-2 mb-2"
            value={studentForm.name}
            onChange={(e) =>
              setStudentForm({ ...studentForm, name: e.target.value })
            }
          />
          <input
            placeholder="Email"
            className="w-full border p-2 mb-2"
            value={studentForm.email}
            onChange={(e) =>
              setStudentForm({ ...studentForm, email: e.target.value })
            }
          />
          <input
            placeholder="Roll Number"
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
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Student
          </button>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-3">Add Mentor</h3>
          <input
            placeholder="Name"
            className="w-full border p-2 mb-2"
            value={mentorForm.name}
            onChange={(e) =>
              setMentorForm({ ...mentorForm, name: e.target.value })
            }
          />
          <input
            placeholder="Email"
            className="w-full border p-2 mb-2"
            value={mentorForm.email}
            onChange={(e) =>
              setMentorForm({ ...mentorForm, email: e.target.value })
            }
          />
          <button
            onClick={addMentor}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Add Mentor
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Students ({users.students.length})</h3>
          {users.students.map((s) => (
            <div key={s.id} className="border-b py-1">
              {s.name} ({s.roll_number}) - {s.branch}
            </div>
          ))}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Mentors ({users.mentors.length})</h3>
          {users.mentors.map((m) => (
            <div key={m.id} className="border-b py-1">
              {m.name} - {m.email}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
