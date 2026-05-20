<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];

if ($role === 'admin') {
  $res = $conn->query("SELECT a.*, u.name as user_name FROM activity_logs a JOIN users u ON a.user_id=u.id ORDER BY a.id DESC LIMIT 50");
} elseif ($role === 'mentor') {
  $stmt = $conn->prepare("SELECT a.*, u.name as user_name FROM activity_logs a JOIN users u ON a.user_id=u.id JOIN projects p ON (p.student_id = a.user_id OR p.mentor_id = a.user_id) WHERE p.mentor_id = ? ORDER BY a.id DESC LIMIT 50");
  $stmt->bind_param("i", $user_id);
  $stmt->execute();
  $res = $stmt->get_result();
} else {
  $stmt = $conn->prepare("SELECT a.*, u.name as user_name FROM activity_logs a JOIN users u ON a.user_id=u.id WHERE a.user_id = ? ORDER BY a.id DESC LIMIT 50");
  $stmt->bind_param("i", $user_id);
  $stmt->execute();
  $res = $stmt->get_result();
}
sendJSON($res->fetch_all(MYSQLI_ASSOC));
?>