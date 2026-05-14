import React, { useState, useEffect, useRef } from "react";
import { getMessages, sendMessage, getUsers } from "../api";
import toast from "react-hot-toast";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    fetchUsers();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await getMessages();
      setMessages(res.data);
    } catch (err) {
      toast.error("Failed to load messages");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers([...res.data.students, ...res.data.mentors]);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  const handleSend = async () => {
    if (!receiverId) {
      toast.error("Please select a recipient");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    setSending(true);
    try {
      await sendMessage(receiverId, message);
      toast.success("Message sent");
      setMessage("");
      fetchMessages();
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Get unique conversation partners (for potential conversation view)
  const getConversations = () => {
    const convMap = new Map();
    messages.forEach((msg) => {
      const otherId =
        msg.sender_id === JSON.parse(localStorage.getItem("user"))?.id
          ? msg.receiver_id
          : msg.sender_id;
      const otherName =
        msg.sender_id === JSON.parse(localStorage.getItem("user"))?.id
          ? msg.receiver_name
          : msg.sender_name;
      if (!convMap.has(otherId)) {
        convMap.set(otherId, {
          id: otherId,
          name: otherName,
          lastMessage: msg.message,
          lastTime: msg.created_at,
        });
      }
    });
    return Array.from(convMap.values());
  };

  const currentUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
          💬 Messages
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Send and receive messages with other users
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Card - Left Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-6">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                New Message
              </h3>
              <p className="text-purple-100 text-sm">
                Send a message to any user
              </p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  To:
                </label>
                <select
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition bg-white"
                  value={receiverId}
                  onChange={(e) => setReceiverId(e.target.value)}
                >
                  <option value="">Select a user...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Message
                </label>
                <textarea
                  rows="4"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                />
              </div>
              <button
                onClick={handleSend}
                disabled={sending}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    Send Message
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Conversation List - Right Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                All Conversations
                <span className="text-sm text-gray-500 ml-2 bg-gray-200 px-2 py-0.5 rounded-full">
                  {messages.length} messages
                </span>
              </h3>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-3">📭</div>
                  <p className="text-gray-500">No messages yet</p>
                  <p className="text-gray-400 text-sm">
                    Send a message to start a conversation
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {messages.map((msg) => {
                    const isCurrentUser = msg.sender_id === currentUser?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`p-4 hover:bg-gray-50 transition group ${isCurrentUser ? "bg-blue-50/30" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${isCurrentUser ? "bg-blue-500" : "bg-purple-500"}`}
                          >
                            {(isCurrentUser
                              ? currentUser?.name?.charAt(0)
                              : msg.sender_name?.charAt(0)
                            )?.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-800">
                                {isCurrentUser ? "You" : msg.sender_name}
                              </span>
                              <span className="text-gray-400 text-sm">→</span>
                              <span className="font-medium text-gray-700">
                                {msg.receiver_name}
                              </span>
                              <span className="text-xs text-gray-400 ml-auto">
                                {new Date(msg.created_at).toLocaleString()}
                              </span>
                            </div>
                            <div
                              className={`p-3 rounded-xl inline-block max-w-[80%] ${isCurrentUser ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-800"}`}
                            >
                              <p className="text-sm leading-relaxed">
                                {msg.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
