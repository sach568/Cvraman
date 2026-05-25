<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];
$project_id = (int) ($_GET['project_id'] ?? 0);
if (!$project_id)
  sendJSON(['error' => 'Project ID required'], 400);

// Permission check
if ($role === 'student') {
  $perm = $conn->prepare("SELECT id FROM projects WHERE id=? AND student_id=?");
  $perm->bind_param("ii", $project_id, $user_id);
} else {
  $perm = $conn->prepare("SELECT id FROM projects WHERE id=? AND mentor_id=?");
  $perm->bind_param("ii", $project_id, $user_id);
}
$perm->execute();
if ($perm->get_result()->num_rows === 0)
  sendJSON(['error' => 'Unauthorized'], 403);

$stmt = $conn->prepare("
    SELECT fe.*, pf.file_name, pf.file_path, u.name as mentor_name 
    FROM file_errors fe 
    JOIN project_files pf ON pf.id = fe.file_id 
    JOIN users u ON u.id = fe.mentor_id 
    WHERE fe.project_id = ? 
    ORDER BY fe.created_at DESC
");
$stmt->bind_param("i", $project_id);
$stmt->execute();
$res = $stmt->get_result();
sendJSON($res->fetch_all(MYSQLI_ASSOC));
?>