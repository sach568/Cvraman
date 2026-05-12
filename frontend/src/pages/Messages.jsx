import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMessages();
    loadUsers();
  }, []);

  const loadMessages = async () => {
    setRefreshing(true);
    try {
      const res = await api.get("/messages.php");
      setMessages(res.data);
    } catch (err) {
      toast.error("Failed to load messages");
    } finally {
      setRefreshing(false);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get("/users.php?all=true");
      setUsers(res.data.all || []);
    } catch (err) {
      setUsers([]);
    }
  };

  const sendMessage = async () => {
    if (!receiverId) {
      toast.error("Please select a recipient");
      return;
    }
    if (!newMessage.trim()) {
      toast.error("Please write a message");
      return;
    }

    setLoading(true);
    try {
      await api.post("/messages.php", {
        receiver_id: receiverId,
        message: newMessage,
      });
      toast.success("Message sent!");
      setNewMessage("");
      setReceiverId("");
      loadMessages();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm("Delete this message?")) return;
    try {
      await api.delete(`/messages.php?id=${id}`);
      toast.success("Message deleted");
      loadMessages();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">💬 Messages</h1>
          <p className="text-gray-500 text-sm mt-1">
            Send and receive messages with other users
          </p>
        </div>
        <button
          onClick={loadMessages}
          disabled={refreshing}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-4">
            <h2 className="text-white font-semibold text-lg">✏️ New Message</h2>
            <p className="text-blue-100 text-sm">Send a message to any user</p>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
              >
                <option value="">-- Select a user --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-lg transition shadow-md disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
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
                </span>
              ) : (
                "Send Message"
              )}
            </button>
          </div>
        </div>

        {/* Message List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800 text-lg">
              📬 Conversation
            </h2>
            <p className="text-gray-500 text-sm">
              All your messages (sent & received)
            </p>
          </div>
          <div className="max-h-[500px] overflow-y-auto divide-y divide-gray-100">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-3">📭</div>
                <p className="text-gray-500">No messages yet</p>
                <p className="text-gray-400 text-sm">
                  Send a message to start a conversation
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 hover:bg-gray-50 transition group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-gray-800">
                          {msg.sender_name}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="font-medium text-gray-700">
                          {msg.receiver_name}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition ml-3 p-1"
                      title="Delete message"
                    >
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
