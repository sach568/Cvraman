<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];
if ($role !== 'mentor')
  sendJSON(['error' => 'Only mentors can mark errors'], 403);

$input = json_decode(file_get_contents('php://input'), true);
if (!$input)
  sendJSON(['error' => 'Invalid JSON'], 400);

$file_id = (int) ($input['file_id'] ?? 0);
$project_id = (int) ($input['project_id'] ?? 0);
$error_desc = trim($input['error_description'] ?? '');

if (!$file_id || !$project_id || empty($error_desc)) {
  sendJSON(['error' => 'Missing required fields', 'debug' => ['file_id' => $file_id, 'project_id' => $project_id]], 400);
}

// Verify that the file exists and belongs to the project, and that the current user is the mentor of that project
$check = $conn->prepare("
    SELECT pf.id, p.mentor_id, p.student_id 
    FROM project_files pf 
    JOIN projects p ON p.id = pf.project_id 
    WHERE pf.id = ? AND pf.project_id = ? AND p.mentor_id = ?
");
$check->bind_param("iii", $file_id, $project_id, $user_id);
$check->execute();
$result = $check->get_result();
if ($result->num_rows === 0) {
  sendJSON(['error' => 'Unauthorized or file not found'], 403);
}
$row = $result->fetch_assoc();
$student_id = $row['student_id'];

// Insert error
$stmt = $conn->prepare("INSERT INTO file_errors (file_id, project_id, mentor_id, error_description) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiis", $file_id, $project_id, $user_id, $error_desc);
if ($stmt->execute()) {
  // Send notification to student
  $notif = $conn->prepare("INSERT INTO notifications (user_id, message, type, created_at) VALUES (?, ?, 'file_error', NOW())");
  $msg = "Error marked on your project file. Please check and fix.";
  $notif->bind_param("is", $student_id, $msg);
  $notif->execute();
  sendJSON(['success' => true]);
} else {
  sendJSON(['error' => 'DB error: ' . $conn->error], 500);
}
?>