<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $res = $conn->query("SELECT * FROM project_files ORDER BY id DESC");
  sendJSON($res->fetch_all(MYSQLI_ASSOC));
}

if ($method === 'POST') {
  if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK)
    sendJSON(['error' => 'File upload error'], 400);
  $project_id_raw = $_POST['project_id'] ?? '';
  $project_id = ($project_id_raw === '') ? null : (int) $project_id_raw;
  $originalName = basename($_FILES['file']['name']);
  $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
  $safeName = time() . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
  $uploadDir = __DIR__ . '/../uploads/';
  if (!is_dir($uploadDir))
    mkdir($uploadDir, 0777, true);
  if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadDir . $safeName)) {
    $stmt = $conn->prepare("INSERT INTO project_files (project_id, user_id, file_name, file_path) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiss", $project_id, $user_id, $originalName, $safeName);
    if ($stmt->execute())
      sendJSON(['success' => true]);
    else {
      unlink($uploadDir . $safeName);
      sendJSON(['error' => 'DB insert failed'], 500);
    }
  } else
    sendJSON(['error' => 'Move failed'], 500);
}
?>