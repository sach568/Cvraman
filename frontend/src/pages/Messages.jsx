import React, { useState, useEffect, useRef } from "react";
import { getMessages, sendMessage, getUsers } from "../api";
import toast from "react-hot-toast";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchMessages();
    fetchUsers();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
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
    if (!receiverId) return toast.error("Select recipient");
    if (!message.trim()) return toast.error("Enter message");
    setSending(true);
    try {
      await sendMessage(receiverId, message);
      toast.success("Sent");
      setMessage("");
      fetchMessages();
    } catch (err) {
      toast.error("Failed to send");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent mb-6">
        💬 Messages
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h3 className="font-bold text-lg mb-3">New Message</h3>
          <select
            className="w-full border rounded-xl p-2 mb-3"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
          >
            <option value="">Select user...</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
          <textarea
            rows="4"
            className="w-full border rounded-xl p-2 mb-3"
            placeholder="Type message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={handleSend}
            disabled={sending}
            className="w-full bg-purple-600 text-white py-2 rounded-xl"
          >
            Send
          </button>
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gray-50 p-4 border-b">
            <h3 className="font-bold">Conversations</h3>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No messages yet
              </div>
            ) : (
              messages.map((msg) => {
                const isSender = msg.sender_id === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`p-4 border-b ${isSender ? "bg-blue-50/30" : ""}`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${isSender ? "bg-blue-500" : "bg-purple-500"}`}
                      >
                        {isSender
                          ? currentUser.name?.charAt(0) || "U"
                          : msg.sender_name?.charAt(0)}
                      </div>
                      <div>
                        <p>
                          <strong>{isSender ? "You" : msg.sender_name}</strong>{" "}
                          → {msg.receiver_name}{" "}
                          <span className="text-xs text-gray-400 ml-2">
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                        </p>
                        <p className="mt-1">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
