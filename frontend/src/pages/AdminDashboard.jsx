import { useEffect, useState } from "react";
import { getProjects, getUsers } from "../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    students: 0,
    mentors: 0,
    pending: 0,
  });
  useEffect(() => {
    getProjects().then((res) =>
      setStats((prev) => ({
        ...prev,
        projects: res.data.length,
        pending: res.data.filter((p) => p.status === "submitted").length,
      })),
    );
    getUsers().then((res) =>
      setStats((prev) => ({
        ...prev,
        students: res.data.students.length,
        mentors: res.data.mentors.length,
      })),
    );
  }, []);
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="row mt-3">
        <div className="col-md-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h3>{stats.projects}</h3>
              <p>Projects</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h3>{stats.students}</h3>
              <p>Students</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h3>{stats.mentors}</h3>
              <p>Mentors</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
