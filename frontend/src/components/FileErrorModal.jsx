import React, { useState } from "react";
import { markFileError } from "../api";
import toast from "react-hot-toast";

export default function FileErrorModal({
  file,
  projectId,
  onClose,
  onSuccess,
}) {
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!errorText.trim()) return toast.error("Error description required");
    setLoading(true);
    try {
      await markFileError(file.id, projectId, errorText);
      toast.success("Error marked and student notified");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            ⚠️ Mark Error in File
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-600 text-sm mb-2">
          File: <span className="font-mono">{file.file_name}</span>
        </p>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-red-400 focus:border-red-400"
          placeholder="Describe the error clearly..."
          value={errorText}
          onChange={(e) => setErrorText(e.target.value)}
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Marking..." : "Mark Error"}
          </button>
        </div>
      </div>
    </div>
  );
}
