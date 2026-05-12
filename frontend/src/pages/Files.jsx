import { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

export default function Files() {
  const [files, setFiles] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await api.get("/files.php");
      setFiles(res.data);
    } catch (err) {
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append("file", selectedFile);
    fd.append("project_id", projectId);

    try {
      await api.post("/files.php", fd);
      toast.success("File uploaded successfully!");
      setSelectedFile(null);
      setProjectId("");
      fetchFiles();
      // Reset file input
      document.getElementById("fileInput").value = "";
    } catch (err) {
      toast.error(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <span className="text-3xl">📎</span> File Manager
      </h2>

      {/* Upload Card */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8 border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h3 className="text-white font-semibold text-lg">Upload New File</h3>
          <p className="text-blue-100 text-sm">
            Upload project documents, reports, or any relevant files
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project ID (Optional)
              </label>
              <input
                type="number"
                placeholder="e.g., 1, 2, 3..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank if file is not linked to a specific project
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="fileInput"
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {selectedFile && (
                <p className="text-xs text-green-600 mt-2">
                  Selected: {selectedFile.name} (
                  {formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={uploadFile}
              disabled={uploading || !selectedFile}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                  Uploading...
                </>
              ) : (
                <>📤 Upload File</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Files List */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800 text-lg">All Files</h3>
          <p className="text-sm text-gray-500">Total {files.length} file(s)</p>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-gray-500">No files uploaded yet</p>
            <p className="text-sm text-gray-400">
              Use the form above to upload your first file
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-5 hover:bg-gray-50 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">
                    {file.file_name?.match(/\.(pdf)$/i)
                      ? "📄"
                      : file.file_name?.match(/\.(jpg|jpeg|png|gif)$/i)
                        ? "🖼️"
                        : file.file_name?.match(/\.(doc|docx)$/i)
                          ? "📝"
                          : file.file_name?.match(/\.(xls|xlsx)$/i)
                            ? "📊"
                            : "📎"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {file.file_name}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                      <span>📁 Project #{file.project_id || "Not linked"}</span>
                      <span>👤 User ID: {file.user_id}</span>
                      <span>
                        📅 {new Date(file.uploaded_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <a
                  href={`http://localhost/cvr-pms-backend/uploads/${file.file_path}`}
                  download
                  className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm font-medium"
                >
                  ⬇️ Download
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
