import { useEffect, useState } from "react";
import { getProjects } from "../api";

export default function MentorDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  useEffect(() => {
    getProjects().then((res) => {
      const projects = res.data;
      setStats({
        total: projects.length,
        pending: projects.filter((p) => p.status === "submitted").length,
        approved: projects.filter((p) => p.status === "approved").length,
      });
    });
  }, []);
  return (
    <div>
      <h2>Mentor Dashboard</h2>
      <div className="row mt-3">
        <div className="col-md-4">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h3>{stats.total}</h3>
              <p>Assigned</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h3>{stats.pending}</h3>
              <p>Pending Review</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h3>{stats.approved}</h3>
              <p>Approved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
