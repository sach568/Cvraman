<?php
require_once '../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($method === 'GET') {
  $res = mysqli_query($conn, "SELECT * FROM project_files ORDER BY id DESC");
  sendJSON(mysqli_fetch_all($res, MYSQLI_ASSOC));
}

if ($method === 'POST') {
  // Check if file was uploaded
  if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errorMsg = isset($_FILES['file']) ? 'Upload error code: ' . $_FILES['file']['error'] : 'No file uploaded';
    sendJSON(['error' => $errorMsg], 400);
  }

  $project_id = (int) ($_POST['project_id'] ?? 0);
  $fileName = basename($_FILES['file']['name']);
  // Sanitize filename
  $filePath = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $fileName);
  $targetDir = __DIR__ . '/../uploads/';

  // Create uploads directory if it doesn't exist
  if (!is_dir($targetDir)) {
    if (!mkdir($targetDir, 0777, true)) {
      sendJSON(['error' => 'Failed to create uploads directory'], 500);
    }
  }

  $targetFile = $targetDir . $filePath;

  // Move uploaded file
  if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
    $stmt = mysqli_prepare($conn, "INSERT INTO project_files (project_id, user_id, file_name, file_path) VALUES (?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "iiss", $project_id, $user_id, $fileName, $filePath);
    if (mysqli_stmt_execute($stmt)) {
      sendJSON(['success' => true]);
    } else {
      sendJSON(['error' => 'Database insert failed: ' . mysqli_error($conn)], 500);
    }
    mysqli_stmt_close($stmt);
  } else {
    sendJSON(['error' => 'Failed to move uploaded file. Check uploads folder permissions.'], 500);
  }
}
?>