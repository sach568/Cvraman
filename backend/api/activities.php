<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];

if ($role === 'admin') {
  $q = "SELECT a.*, u.name as user_name FROM activity_logs a JOIN users u ON a.user_id = u.id ORDER BY a.id DESC LIMIT 50";
} elseif ($role === 'mentor') {
  // Mentor sees activities of projects they supervise
  $q = "SELECT a.*, u.name as user_name FROM activity_logs a 
          JOIN users u ON a.user_id = u.id 
          JOIN projects p ON (p.student_id = a.user_id OR p.mentor_id = a.user_id)
          WHERE p.mentor_id = $user_id 
          ORDER BY a.id DESC LIMIT 50";
} else { // student
  // Student sees only their own activities
  $q = "SELECT a.*, u.name as user_name FROM activity_logs a 
          JOIN users u ON a.user_id = u.id 
          WHERE a.user_id = $user_id 
          ORDER BY a.id DESC LIMIT 50";
}
$res = mysqli_query($conn, $q);
sendJSON(mysqli_fetch_all($res, MYSQLI_ASSOC));
?>