<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$project_id = (int) ($_GET['project_id'] ?? 0);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  if (!$project_id)
    sendJSON(['error' => 'Project ID required'], 400);
  $stmt = $conn->prepare("SELECT c.*, u.name FROM comments c JOIN users u ON c.user_id=u.id WHERE c.project_id=? ORDER BY c.id ASC");
  $stmt->bind_param("i", $project_id);
  $stmt->execute();
  $res = $stmt->get_result();
  sendJSON($res->fetch_all(MYSQLI_ASSOC));
}

if ($method === 'POST') {
  $input = json_decode(file_get_contents('php://input'), true);
  if (!$input)
    sendJSON(['error' => 'Invalid JSON'], 400);
  $comment = trim($input['comment'] ?? '');
  if (empty($comment))
    sendJSON(['error' => 'Comment cannot be empty'], 400);
  $stmt = $conn->prepare("INSERT INTO comments (project_id, user_id, comment) VALUES (?, ?, ?)");
  $stmt->bind_param("iis", $project_id, $user_id, $comment);
  if ($stmt->execute()) {
    $projQ = $conn->prepare("SELECT student_id, mentor_id FROM projects WHERE id=?");
    $projQ->bind_param("i", $project_id);
    $projQ->execute();
    $proj = $projQ->get_result()->fetch_assoc();
    if ($proj && $proj['student_id'] != $user_id) {
      $notif = $conn->prepare("INSERT INTO notifications (user_id, message, type, created_at) VALUES (?, 'New comment on your project', 'comment', NOW())");
      $notif->bind_param("i", $proj['student_id']);
      $notif->execute();
    }
    if ($proj && $proj['mentor_id'] != $user_id) {
      $notif = $conn->prepare("INSERT INTO notifications (user_id, message, type, created_at) VALUES (?, 'New comment on a project you mentor', 'comment', NOW())");
      $notif->bind_param("i", $proj['mentor_id']);
      $notif->execute();
    }
    sendJSON(['success' => true]);
  } else
    sendJSON(['error' => 'Failed to add comment'], 500);
}
?>