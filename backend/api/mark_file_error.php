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

// Check if batch mode
if (isset($input['batch']) && is_array($input['batch'])) {
  // BATCH MODE
  $file_id = (int) ($input['file_id'] ?? 0);
  $project_id = (int) ($input['project_id'] ?? 0);
  if (!$file_id || !$project_id)
    sendJSON(['error' => 'Missing file/project ID'], 400);

  // Verify mentor is assigned to this project
  $check = $conn->prepare("SELECT p.mentor_id, p.student_id FROM projects p WHERE p.id = ? AND p.mentor_id = ?");
  $check->bind_param("ii", $project_id, $user_id);
  $check->execute();
  $result = $check->get_result();
  if ($result->num_rows === 0)
    sendJSON(['error' => 'Unauthorized'], 403);
  $row = $result->fetch_assoc();
  $student_id = $row['student_id'];

  $errors = $input['batch'];
  $inserted = 0;
  $stmt = $conn->prepare("INSERT INTO file_errors (file_id, project_id, mentor_id, error_description, line_number, original_text, suggested_text) VALUES (?, ?, ?, ?, ?, ?, ?)");

  foreach ($errors as $err) {
    $error_desc = trim($err['error_description'] ?? '');
    if (empty($error_desc)) {
      $error_desc = "🔴 Change \"{$err['original_text']}\" to \"{$err['suggested_text']}\"";
    }
    $line_number = isset($err['line_number']) ? (int) $err['line_number'] : null;
    $original_text = trim($err['original_text'] ?? '');
    $suggested_text = trim($err['suggested_text'] ?? '');

    $stmt->bind_param("iiisiss", $file_id, $project_id, $user_id, $error_desc, $line_number, $original_text, $suggested_text);
    if ($stmt->execute())
      $inserted++;
  }

  // Single notification for all errors
  $notif = $conn->prepare("INSERT INTO notifications (user_id, message, type, created_at) VALUES (?, ?, 'file_error', NOW())");
  $msg = "A mentor marked $inserted error(s) on your project file. Please check and fix.";
  $notif->bind_param("is", $student_id, $msg);
  $notif->execute();

  sendJSON(['success' => true, 'inserted' => $inserted]);
} else {
  // SINGLE MODE
  $file_id = (int) ($input['file_id'] ?? 0);
  $project_id = (int) ($input['project_id'] ?? 0);
  $error_desc = trim($input['error_description'] ?? '');
  $line_number = isset($input['line_number']) ? (int) $input['line_number'] : null;
  $original_text = trim($input['original_text'] ?? '');
  $suggested_text = trim($input['suggested_text'] ?? '');

  if (empty($error_desc)) {
    $error_desc = "🔴 Change \"$original_text\" to \"$suggested_text\"";
  }
  if (!$file_id || !$project_id)
    sendJSON(['error' => 'Missing required fields'], 400);

  $check = $conn->prepare("SELECT p.mentor_id, p.student_id FROM projects p WHERE p.id = ? AND p.mentor_id = ?");
  $check->bind_param("ii", $project_id, $user_id);
  $check->execute();
  $result = $check->get_result();
  if ($result->num_rows === 0)
    sendJSON(['error' => 'Unauthorized'], 403);
  $row = $result->fetch_assoc();
  $student_id = $row['student_id'];

  $stmt = $conn->prepare("INSERT INTO file_errors (file_id, project_id, mentor_id, error_description, line_number, original_text, suggested_text) VALUES (?, ?, ?, ?, ?, ?, ?)");
  $stmt->bind_param("iiisiss", $file_id, $project_id, $user_id, $error_desc, $line_number, $original_text, $suggested_text);
  if ($stmt->execute()) {
    $notif = $conn->prepare("INSERT INTO notifications (user_id, message, type, created_at) VALUES (?, ?, 'file_error', NOW())");
    $msg = "A mentor marked an error on your project file.";
    $notif->bind_param("is", $student_id, $msg);
    $notif->execute();
    sendJSON(['success' => true]);
  } else {
    sendJSON(['error' => 'DB error'], 500);
  }
}
?>