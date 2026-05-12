import { useEffect, useState } from "react";
import { getProjects } from "../api";

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    submitted: 0,
    approved: 0,
    revision: 0,
  });
  useEffect(() => {
    getProjects().then((res) => {
      const projects = res.data;
      setStats({
        submitted: projects.filter((p) => p.status === "submitted").length,
        approved: projects.filter((p) => p.status === "approved").length,
        revision: projects.filter((p) => p.status === "revisions_needed")
          .length,
      });
    });
  }, []);
  return (
    <div>
      <h2>Student Dashboard</h2>
      <div className="row mt-3">
        <div className="col-md-4">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h3>{stats.submitted}</h3>
              <p>Submitted</p>
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
        <div className="col-md-4">
          <div className="card text-white bg-danger">
            <div className="card-body">
              <h3>{stats.revision}</h3>
              <p>Revisions Needed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
