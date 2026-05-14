<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();
if ($_SESSION['role'] !== 'student')
  sendJSON(['error' => 'Unauthorized'], 403);
$id = (int) $_POST['id'];
mysqli_query($conn, "UPDATE projects SET status='submitted', submitted_at=NOW() WHERE id=$id AND student_id=" . $_SESSION['user_id']);
sendJSON(['success' => true]);
?>