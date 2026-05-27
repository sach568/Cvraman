import React, { useState } from "react";
import { markFileError } from "../api";
import toast from "react-hot-toast";

export default function FileErrorModal({
  file,
  projectId,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const [suggestedText, setSuggestedText] = useState("");
  const [lineNumber, setLineNumber] = useState("");

  const handleSubmit = async () => {
    if (!originalText.trim()) {
      toast.error("Please enter the incorrect word");
      return;
    }
    setLoading(true);
    try {
      const errorDesc = `🔴 Change "${originalText}" to "${suggestedText || "??"}"`;
      await markFileError(
        file.id,
        projectId,
        errorDesc,
        lineNumber || null,
        originalText,
        suggestedText,
      );
      toast.success("Error marked");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-2">🔴 Mark Error (Goal Circle)</h3>
        <p className="text-sm mb-3">File: {file.file_name}</p>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Incorrect word (e.g., sachin)"
            className="w-full border rounded p-2"
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
          />
          <input
            type="text"
            placeholder="Corrected word (e.g., sacins)"
            className="w-full border rounded p-2"
            value={suggestedText}
            onChange={(e) => setSuggestedText(e.target.value)}
          />
          <input
            type="number"
            placeholder="Page number (optional)"
            className="w-full border rounded p-2"
            value={lineNumber}
            onChange={(e) => setLineNumber(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Mark Error
          </button>
        </div>
      </div>
    </div>
  );
}
