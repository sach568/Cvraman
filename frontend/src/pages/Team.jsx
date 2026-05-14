import React, { useEffect, useState } from "react";
import { getUsers } from "../api";

export default function Team() {
  const [users, setUsers] = useState({ students: [], mentors: [] });
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all"); // all, student, mentor

  useEffect(() => {
    getUsers().then((res) => setUsers(res.data));
  }, []);

  // Filter users based on search term and role
  const filterUsers = (list, role) => {
    if (filterRole !== "all" && filterRole !== role) return [];
    if (!search.trim()) return list;
    return list.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.roll_number?.toLowerCase().includes(search.toLowerCase()),
    );
  };

  const filteredStudents = filterUsers(users.students, "student");
  const filteredMentors = filterUsers(users.mentors, "mentor");

  // Helper to get initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
          👥 Team Members
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Connect with mentors and students in your department
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center border border-gray-100">
        <div className="relative w-full sm:w-80">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email or roll number..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterRole("all")}
            className={`px-4 py-2 rounded-lg transition ${
              filterRole === "all"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterRole("mentor")}
            className={`px-4 py-2 rounded-lg transition ${
              filterRole === "mentor"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            👨‍🏫 Mentors
          </button>
          <button
            onClick={() => setFilterRole("student")}
            className={`px-4 py-2 rounded-lg transition ${
              filterRole === "student"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            👨‍🎓 Students
          </button>
        </div>
      </div>

      {/* Mentors Section */}
      {(filterRole === "all" || filterRole === "mentor") && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
              👨‍🏫
            </div>
            <h3 className="text-xl font-bold text-gray-800">Mentors</h3>
            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-semibold">
              {filteredMentors.length}
            </span>
          </div>
          {filteredMentors.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-400">No mentors found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                >
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-lg shadow">
                        {getInitials(mentor.name)}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">
                          {mentor.name}
                        </h4>
                        <p className="text-purple-100 text-xs flex items-center gap-1">
                          <span>🎓</span> Mentor
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{mentor.email}</span>
                    </div>
                    {mentor.branch && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <span>{mentor.branch}</span>
                      </div>
                    )}
                    {mentor.roll_number && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 20h10M5 9h14M5 5h14M5 13h14M5 17h14"
                          />
                        </svg>
                        <span>ID: {mentor.roll_number}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Students Section */}
      {(filterRole === "all" || filterRole === "student") && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
              👨‍🎓
            </div>
            <h3 className="text-xl font-bold text-gray-800">Students</h3>
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
              {filteredStudents.length}
            </span>
          </div>
          {filteredStudents.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <p className="text-gray-400">No students found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                >
                  <div className="bg-gradient-to-r from-green-600 to-teal-600 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-lg shadow">
                        {getInitials(student.name)}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg">
                          {student.name}
                        </h4>
                        <p className="text-green-100 text-xs flex items-center gap-1">
                          <span>📚</span> Student
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{student.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 20h10M5 9h14M5 5h14M5 13h14M5 17h14"
                        />
                      </svg>
                      <span>Roll: {student.roll_number}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span>Branch: {student.branch}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
