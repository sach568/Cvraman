import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects, submitProject, deleteProject } from "../api";

export default function StudentProjects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  const fetchProjects = async () => {
    const res = await getProjects(search);
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, [search]);

  const handleSubmit = async (id) => {
    await submitProject(id);
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
      fetchProjects();
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      draft: "secondary",
      submitted: "warning",
      under_review: "info",
      approved: "success",
      revisions_needed: "danger",
    };
    return `badge bg-${colors[status] || "secondary"}`;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h2>
          <i className="fas fa-folder-open"></i> My Projects
        </h2>
        <div className="d-flex gap-2 mt-2 mt-sm-0">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link to="/projects/create" className="btn btn-primary">
            <i className="fas fa-plus-circle"></i> New Project
          </Link>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Subject</th>
              <th>Mentor</th>
              <th>Status</th>
              <th>File</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No projects found.{" "}
                  <Link to="/projects/create">Create one</Link>
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.subject_name}</td>
                  <td>{p.mentor_name}</td>
                  <td>
                    <span className={getStatusBadge(p.status)}>
                      {p.status.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    {p.file_path && (
                      <a
                        href={`http://localhost/project-api/uploads/${p.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    )}
                  </td>
                  <td>
                    {p.status === "draft" && (
                      <>
                        <Link
                          to={`/projects/edit/${p.id}`}
                          className="btn btn-sm btn-info me-1"
                        >
                          <i className="fas fa-edit"></i> Edit
                        </Link>
                        <button
                          onClick={() => handleSubmit(p.id)}
                          className="btn btn-sm btn-success me-1"
                        >
                          <i className="fas fa-paper-plane"></i> Submit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="btn btn-sm btn-danger"
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </>
                    )}
                    {p.status !== "draft" && (
                      <span className="text-muted">No actions</span>
                    )}
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
