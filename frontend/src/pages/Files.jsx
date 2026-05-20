import React, { useState, useEffect } from "react";
import { getFiles, uploadFile, downloadFile } from "../api";
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
      const res = await getFiles();
      setFiles(res.data);
    } catch (err) {
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) return toast.error("Select a file");
    if (selectedFile.size > 5 * 1024 * 1024) return toast.error("Max 5MB");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", selectedFile);
    fd.append("project_id", projectId);
    try {
      await uploadFile(fd);
      toast.success("Uploaded");
      setSelectedFile(null);
      setProjectId("");
      fetchFiles();
      document.getElementById("fileInput").value = "";
    } catch (err) {
      toast.error(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (name) => {
    const ext = name?.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "📄";
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "🖼️";
    return "📎";
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-6">
        📎 File Manager
      </h2>
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="font-bold text-lg mb-3">Upload New File</h3>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="number"
            placeholder="Project ID (optional)"
            className="border rounded-xl px-4 py-2 flex-1"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
          <div
            className="flex-1 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            {selectedFile ? (
              <p className="text-green-600">{selectedFile.name}</p>
            ) : (
              <p className="text-gray-500">Click to select file (max 5MB)</p>
            )}
          </div>
        </div>
        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl"
        >
          Upload
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gray-50 p-4 border-b">
          <h3 className="font-bold">All Files ({files.length})</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : files.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No files uploaded</div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="p-4 border-b flex justify-between items-center hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getFileIcon(file.file_name)}</span>
                <div>
                  <p className="font-medium">{file.file_name}</p>
                  <p className="text-xs text-gray-500">
                    Project #{file.project_id || "Not linked"} | Uploaded{" "}
                    {new Date(file.uploaded_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <a
                href={downloadFile(file.file_path)}
                download
                className="bg-gray-100 hover:bg-blue-100 px-4 py-2 rounded-lg"
              >
                Download
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
