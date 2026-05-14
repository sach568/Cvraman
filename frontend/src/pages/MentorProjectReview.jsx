import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProject, updateProject, getComments, addComment } from "../api";
import toast from "react-hot-toast";

export default function MentorProjectReview() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  useEffect(() => {
    load();
  }, [id]);
  const load = async () => {
    const p = await getProject(id);
    setProject(p.data);
    setStatus(p.data.status);
    setFeedback(p.data.feedback || "");
    setRating(p.data.rating || 0);
    const c = await getComments(id);
    setComments(c.data);
  };
  const update = async () => {
    await updateProject(id, { status, feedback, rating });
    toast.success("Review saved");
    load();
  };
  const postComment = async () => {
    if (!newComment) return;
    await addComment(id, newComment);
    setNewComment("");
    load();
  };
  if (!project) return <div>Loading...</div>;
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">📋 Review: {project.title}</h2>
      <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded mb-4">
        <div>
          <strong>Student:</strong> {project.student_name}
        </div>
        <div>
          <strong>Roll:</strong> {project.roll_number}
        </div>
        <div>
          <strong>Subject:</strong> {project.subject_name}
        </div>
        <div>
          <strong>Branch:</strong> {project.branch}
        </div>
      </div>
      <p className="mb-4">
        <strong>Description:</strong>
        <br />
        {project.description}
      </p>
      {project.file_path && (
        <a
          href={`http://localhost/cvru-new/backend/uploads/${project.file_path}`}
          target="_blank"
          className="text-blue-600 mb-4 inline-block"
        >
          📎 Download File
        </a>
      )}
      <div className="mb-4">
        <label className="block font-bold">Rating</label>
        <div className="flex gap-2">
          {Array(5)
            .fill()
            .map((_, i) => (
              <button
                key={i}
                onClick={() => setRating(i + 1)}
                className={`text-2xl ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-bold">Status</label>
        <select
          className="border p-2 w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="revisions_needed">Revisions Needed</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-bold">Feedback</label>
        <textarea
          rows="3"
          className="border p-2 w-full"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </div>
      <button
        onClick={update}
        className="bg-indigo-600 text-white px-4 py-2 rounded mb-6"
      >
        Save Review
      </button>
      <hr className="my-4" />
      <h3 className="font-bold text-lg mb-3">💬 Discussion</h3>
      <div className="max-h-64 overflow-y-auto mb-3">
        {comments.map((c) => (
          <div key={c.id} className="bg-gray-100 p-2 mb-2 rounded">
            <span className="font-semibold">{c.name}</span>{" "}
            <span className="text-xs text-gray-500">
              {new Date(c.created_at).toLocaleString()}
            </span>
            <p>{c.comment}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <textarea
          className="border p-2 flex-1"
          rows="2"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write comment..."
        />
        <button
          onClick={postComment}
          className="bg-gray-800 text-white px-4 rounded"
        >
          Post
        </button>
      </div>
    </div>
  );
}
