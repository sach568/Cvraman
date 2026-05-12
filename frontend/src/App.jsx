import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "./api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";

import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import KanbanBoard from "./pages/KanbanBoard";
import Calendar from "./pages/Calendar";
import Team from "./pages/Team";
import Analytics from "./pages/Analytics";
import Messages from "./pages/Messages";
import Files from "./pages/Files";

import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";
import MentorProjectReview from "./pages/MentorProjectReview";
import AdminSubjects from "./pages/AdminSubjects";
import AdminUsers from "./pages/AdminUsers";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser()
      .then((res) => {
        if (res.data.authenticated) setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p>Loading...</p>
      </div>
    );

  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route element={<Layout user={user} setUser={setUser} />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route
            path="/dashboard"
            element={
              user?.role === "student" ? (
                <StudentDashboard />
              ) : user?.role === "mentor" ? (
                <MentorDashboard />
              ) : user?.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/team" element={<Team />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/files" element={<Files />} />
          <Route
            path="/projects/create"
            element={
              user?.role === "student" ? (
                <CreateProject />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/projects/edit/:id"
            element={
              user?.role === "student" ? (
                <EditProject />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/projects/review/:id"
            element={
              user?.role === "mentor" ? (
                <MentorProjectReview />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/admin/subjects"
            element={
              user?.role === "admin" ? (
                <AdminSubjects />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/admin/users"
            element={
              user?.role === "admin" ? (
                <AdminUsers />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
