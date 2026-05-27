<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];
if ($role !== 'student')
  sendJSON(['error' => 'Only students can resolve'], 403);

$input = json_decode(file_get_contents('php://input'), true);
if (!$input)
  sendJSON(['error' => 'Invalid JSON'], 400);

$error_id = (int) ($input['error_id'] ?? 0);
if (!$error_id)
  sendJSON(['error' => 'Error ID required'], 400);

$check = $conn->prepare("
    SELECT fe.id FROM file_errors fe 
    JOIN projects p ON p.id = fe.project_id 
    WHERE fe.id = ? AND p.student_id = ?
");
$check->bind_param("ii", $error_id, $user_id);
$check->execute();
if ($check->get_result()->num_rows === 0)
  sendJSON(['error' => 'Unauthorized'], 403);

$stmt = $conn->prepare("UPDATE file_errors SET status='fixed', resolved_at=NOW() WHERE id=?");
$stmt->bind_param("i", $error_id);
$stmt->execute();
sendJSON(['success' => true]);
?>