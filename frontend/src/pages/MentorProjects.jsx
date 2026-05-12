import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../api";

export default function MentorProjects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getProjects(search).then((res) => setProjects(res.data));
  }, [search]);

  return (
    <div>
      <h2>Assigned Projects</h2>
      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by title or student name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Student</th>
              <th>Roll</th>
              <th>Title</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No projects assigned
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.student_name} </td>
                  <td>{p.roll_number} </td>
                  <td>{p.title} </td>
                  <td>{p.subject_name} </td>
                  <td>
                    <span
                      className={`badge bg-${p.status === "submitted" ? "warning" : p.status === "approved" ? "success" : "secondary"}`}
                    >
                      {p.status.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <Link
                      to={`/projects/review/${p.id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
