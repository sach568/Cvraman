import React, { useEffect, useState } from "react";
import { getUsers } from "../api";

export default function Team() {
  const [users, setUsers] = useState({ students: [], mentors: [] });
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    getUsers().then((res) => setUsers(res.data));
  }, []);

  const filterUsers = (list, role) => {
    if (filterRole !== "all" && filterRole !== role) return [];
    if (!search) return list;
    return list.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.roll_number?.toLowerCase().includes(search.toLowerCase()),
    );
  };

  const filteredStudents = filterUsers(users.students, "student");
  const filteredMentors = filterUsers(users.mentors, "mentor");
  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
          👥 Team Members
        </h2>
        <p className="text-gray-500">Connect with mentors and students</p>
      </div>
      <div className="bg-white rounded-xl p-4 mb-6 flex flex-wrap gap-4 justify-between">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-lg px-4 py-2 w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            onClick={() => setFilterRole("all")}
            className={`px-4 py-2 rounded-lg ${filterRole === "all" ? "bg-purple-600 text-white" : "bg-gray-100"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterRole("mentor")}
            className={`px-4 py-2 rounded-lg ${filterRole === "mentor" ? "bg-purple-600 text-white" : "bg-gray-100"}`}
          >
            👨‍🏫 Mentors
          </button>
          <button
            onClick={() => setFilterRole("student")}
            className={`px-4 py-2 rounded-lg ${filterRole === "student" ? "bg-purple-600 text-white" : "bg-gray-100"}`}
          >
            👨‍🎓 Students
          </button>
        </div>
      </div>
      {(filterRole === "all" || filterRole === "mentor") && (
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-3">
            Mentors ({filteredMentors.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMentors.map((m) => (
              <UserCard
                key={m.id}
                user={m}
                role="mentor"
                getInitials={getInitials}
              />
            ))}
          </div>
        </div>
      )}
      {(filterRole === "all" || filterRole === "student") && (
        <div>
          <h3 className="text-xl font-bold mb-3">
            Students ({filteredStudents.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStudents.map((s) => (
              <UserCard
                key={s.id}
                user={s}
                role="student"
                getInitials={getInitials}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UserCard({ user, role, getInitials }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div
        className={`px-4 py-3 ${role === "mentor" ? "bg-gradient-to-r from-purple-600 to-indigo-600" : "bg-gradient-to-r from-green-600 to-teal-600"}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
            {getInitials(user.name)}
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg">{user.name}</h4>
            <p className="text-white/80 text-xs">
              {role === "mentor" ? "🎓 Mentor" : "📚 Student"}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>📧</span> {user.email}
        </div>
        {user.roll_number && (
          <div className="flex items-center gap-2">
            <span>🆔</span> Roll: {user.roll_number}
          </div>
        )}
        {user.branch && (
          <div className="flex items-center gap-2">
            <span>🏛️</span> Branch: {user.branch}
          </div>
        )}
      </div>
    </div>
  );
}
