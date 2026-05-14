<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $res = mysqli_query($conn, "SELECT * FROM project_files ORDER BY id DESC");
  sendJSON(mysqli_fetch_all($res, MYSQLI_ASSOC));
}

if ($method === 'POST') {
  if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    sendJSON(['error' => 'File upload error'], 400);
  }

  $project_id_raw = $_POST['project_id'] ?? '';
  // If empty, set to NULL; otherwise cast to int
  $project_id = ($project_id_raw === '') ? 'NULL' : (int) $project_id_raw;

  $originalName = basename($_FILES['file']['name']);
  $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
  $safeName = time() . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
  $uploadDir = __DIR__ . '/../uploads/';
  $targetPath = $uploadDir . $safeName;

  if (!is_dir($uploadDir))
    mkdir($uploadDir, 0777, true);

  if (move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
    if ($project_id === 'NULL') {
      $query = "INSERT INTO project_files (project_id, user_id, file_name, file_path) VALUES (NULL, $user_id, '$originalName', '$safeName')";
    } else {
      $query = "INSERT INTO project_files (project_id, user_id, file_name, file_path) VALUES ($project_id, $user_id, '$originalName', '$safeName')";
    }
    if (mysqli_query($conn, $query)) {
      sendJSON(['success' => true]);
    } else {
      unlink($targetPath);
      sendJSON(['error' => 'DB insert failed: ' . mysqli_error($conn)], 500);
    }
  } else {
    sendJSON(['error' => 'Move failed'], 500);
  }
}
?>