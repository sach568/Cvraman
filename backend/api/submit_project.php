<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();
if ($_SESSION['role'] !== 'student')
  sendJSON(['error' => 'Unauthorized'], 403);

$id = (int) ($_POST['id'] ?? 0);
$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("UPDATE projects SET status='submitted', submitted_at=NOW() WHERE id=? AND student_id=?");
$stmt->bind_param("ii", $id, $user_id);
if ($stmt->execute() && $stmt->affected_rows > 0) {
  $mentorQ = $conn->prepare("SELECT mentor_id FROM projects WHERE id=?");
  $mentorQ->bind_param("i", $id);
  $mentorQ->execute();
  $mentor = $mentorQ->get_result()->fetch_assoc();
  if ($mentor) {
    $msg = "Project #$id has been submitted for review.";
    $notif = $conn->prepare("INSERT INTO notifications (user_id, message, type, created_at) VALUES (?, ?, 'submission', NOW())");
    $notif->bind_param("is", $mentor['mentor_id'], $msg);
    $notif->execute();
  }
  sendJSON(['success' => true]);
} else {
  sendJSON(['error' => 'Submission failed'], 500);
}
?>