import React, { useState } from "react";
import { markFileErrorBatch } from "../api";
import toast from "react-hot-toast";

export default function BatchErrorModal({
  file,
  projectId,
  onClose,
  onSuccess,
}) {
  const [errors, setErrors] = useState([
    { id: Date.now(), original: "", corrected: "", page: "" },
  ]);
  const [loading, setLoading] = useState(false);

  const addRow = () =>
    setErrors([
      ...errors,
      { id: Date.now() + Math.random(), original: "", corrected: "", page: "" },
    ]);
  const removeRow = (id) => {
    if (errors.length === 1) return toast.error("At least one error required");
    setErrors(errors.filter((e) => e.id !== id));
  };
  const update = (id, field, value) =>
    setErrors(errors.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  const handleSubmit = async () => {
    const valid = errors.filter((e) => e.original.trim());
    if (valid.length === 0)
      return toast.error("Add at least one incorrect word");
    setLoading(true);
    try {
      const batch = valid.map((e) => ({
        original_text: e.original,
        suggested_text: e.corrected,
        line_number: e.page ? parseInt(e.page) : null,
        error_description: `🔴 Change "${e.original}" to "${e.corrected || "??"}"`,
      }));
      await markFileErrorBatch(file.id, projectId, batch);
      toast.success(`${batch.length} errors marked`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Batch failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">🔴 Batch Error Marking</h3>
          <button onClick={onClose} className="text-gray-400">
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-2">File: {file.file_name}</p>
        <div className="max-h-96 overflow-y-auto border rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Incorrect</th>
                <th className="p-2">Corrected</th>
                <th className="p-2">Page</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {errors.map((err) => (
                <tr key={err.id} className="border-b">
                  <td className="p-2">
                    <input
                      className="w-full border rounded p-1"
                      value={err.original}
                      onChange={(e) =>
                        update(err.id, "original", e.target.value)
                      }
                      placeholder="e.g., sachin"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="w-full border rounded p-1"
                      value={err.corrected}
                      onChange={(e) =>
                        update(err.id, "corrected", e.target.value)
                      }
                      placeholder="e.g., sacins"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="w-20 border rounded p-1"
                      type="number"
                      value={err.page}
                      onChange={(e) => update(err.id, "page", e.target.value)}
                      placeholder="Page"
                    />
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => removeRow(err.id)}
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <button onClick={addRow} className="px-3 py-1 bg-blue-100 rounded">
            + Add More
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              {loading
                ? "Submitting..."
                : `Submit ${errors.filter((e) => e.original).length} Errors`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
