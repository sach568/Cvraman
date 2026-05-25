import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function VideoConference() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState(
    `pms-project-${projectId || "demo"}`,
  );
  const [isJoined, setIsJoined] = useState(false);

  const joinRoom = () => setIsJoined(true);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            📹 Video Conference
            {projectId && (
              <span className="text-sm bg-white/20 px-2 py-1 rounded">
                Project #{projectId}
              </span>
            )}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
          >
            ← Back to Project
          </button>
        </div>

        {!isJoined ? (
          <div className="p-8 text-center">
            <div className="mb-6">
              <svg
                className="w-20 h-20 mx-auto text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Start or Join a Meeting
            </h3>
            <p className="text-gray-500 mb-6">
              Use this room to discuss your project live with your
              mentor/student.
            </p>
            <div className="flex flex-col items-center gap-4">
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-80 text-center focus:ring-2 focus:ring-purple-500"
                placeholder="Room name (auto-filled)"
              />
              <button
                onClick={joinRoom}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition flex items-center gap-2"
              >
                <span>🚀</span> Join Meeting
              </button>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-[600px] bg-gray-900">
            <iframe
              src={`https://meet.jit.si/${roomName}`}
              allow="camera; microphone; fullscreen; display-capture"
              className="w-full h-full border-0"
              title="Video Conference"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
              <button
                onClick={() => setIsJoined(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg transition"
              >
                Leave Meeting
              </button>
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg transition"
              >
                Back to Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
