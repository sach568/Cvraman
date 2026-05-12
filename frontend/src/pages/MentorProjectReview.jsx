import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

export default function MentorProjectReview() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const p = await api.get(`/projects.php?id=${id}`);
    setProject(p.data);
    setStatus(p.data.status);
    setFeedback(p.data.feedback || "");
    const c = await api.get(`/comments.php?project_id=${id}`);
    setComments(c.data);
  };

  const updateStatus = async () => {
    await api.put(`/projects.php?id=${id}`, { status, feedback });
    toast.success("Updated");
    loadData();
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    await api.post("/comments.php", { project_id: id, comment: newComment });
    setNewComment("");
    loadData();
  };

  if (!project) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Review: {project.title}</h2>
      <p>
        <strong>Student:</strong> {project.student_name} ({project.roll_number})
      </p>
      <p>
        <strong>Subject:</strong> {project.subject_name}
      </p>
      <p>
        <strong>Branch:</strong> {project.branch}
      </p>
      <p>
        <strong>Description:</strong>
        <br />
        {project.description}
      </p>
      {project.file_path && (
        <p>
          <a
            href={`http://localhost/cvr-pms-backend/uploads/${project.file_path}`}
            target="_blank"
            className="text-blue-600"
          >
            Download File
          </a>
        </p>
      )}
      <hr className="my-4" />
      <div className="mb-4">
        <label className="block font-medium">Status</label>
        <select
          className="w-full border rounded p-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="revisions_needed">Revisions Needed</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium">Feedback</label>
        <textarea
          rows="3"
          className="w-full border rounded p-2"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </div>
      <button
        onClick={updateStatus}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update Status
      </button>
      <hr className="my-4" />
      <h3 className="font-bold text-lg">Discussion</h3>
      {comments.map((c) => (
        <div key={c.id} className="border p-2 mb-2 rounded">
          <strong>{c.name}</strong>{" "}
          <span className="text-xs text-gray-500">
            {new Date(c.created_at).toLocaleString()}
          </span>
          <p>{c.comment}</p>
        </div>
      ))}
      <textarea
        rows="2"
        className="w-full border rounded p-2 mt-2"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write a comment..."
      ></textarea>
      <button
        onClick={addComment}
        className="mt-2 bg-gray-600 text-white px-4 py-2 rounded"
      >
        Post Comment
      </button>
    </div>
  );
}
