import React, { useEffect, useState } from "react";
import { getFileErrors, resolveFileError } from "../api";
import toast from "react-hot-toast";

export default function FileErrorList({ projectId, userRole }) {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchErrors = async () => {
    try {
      const res = await getFileErrors(projectId);
      setErrors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchErrors();
  }, [projectId]);

  const handleResolve = async (errorId) => {
    if (window.confirm("Mark this error as fixed?")) {
      try {
        await resolveFileError(errorId);
        toast.success("Error marked as fixed");
        fetchErrors();
      } catch (err) {
        toast.error("Failed");
      }
    }
  };

  if (loading)
    return <div className="text-sm text-gray-500">Loading errors...</div>;
  if (errors.length === 0) return null;

  return (
    <div className="mt-6 border-t pt-4">
      <h4 className="font-semibold text-red-700 flex items-center gap-2">
        ⚠️ File Errors ({errors.length})
      </h4>
      <div className="space-y-3 mt-2">
        {errors.map((err) => (
          <div
            key={err.id}
            className="bg-red-50 p-3 rounded-lg border border-red-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="font-medium text-red-800">
                  📄 {err.file_name}
                </span>
                <p className="text-sm text-red-700 mt-1">
                  {err.error_description}
                </p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(err.created_at).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                Marked by: {err.mentor_name}
              </span>
              {userRole === "student" && err.status === "pending" && (
                <button
                  onClick={() => handleResolve(err.id)}
                  className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full hover:bg-green-200"
                >
                  ✓ Mark as Fixed
                </button>
              )}
              {err.status === "fixed" && (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  ✓ Fixed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
