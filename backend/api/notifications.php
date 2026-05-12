<?php
require_once '../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];

// Smart notifications: overdue tasks
$overdue = mysqli_query($conn, "SELECT * FROM tasks WHERE assigned_to=$user_id AND due_date < CURDATE() AND status != 'completed'");
while ($task = mysqli_fetch_assoc($overdue)) {
  $exists = mysqli_query($conn, "SELECT id FROM notifications WHERE user_id=$user_id AND message LIKE '%overdue%' AND created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)");
  if (mysqli_num_rows($exists) == 0) {
    mysqli_query($conn, "INSERT INTO notifications (user_id, message, type) VALUES ($user_id, 'Task \"{$task['title']}\" is overdue!', 'overdue')");
  }
}

// Inactivity (for students)
if ($_SESSION['role'] === 'student') {
  $inactive = mysqli_query($conn, "SELECT * FROM projects WHERE student_id=$user_id AND updated_at < DATE_SUB(NOW(), INTERVAL 5 DAY) AND status != 'approved'");
  if (mysqli_num_rows($inactive) > 0) {
    mysqli_query($conn, "INSERT INTO notifications (user_id, message, type) VALUES ($user_id, 'You haven’t updated your project in 5 days. Keep going!', 'inactivity')");
  }
}

$res = mysqli_query($conn, "SELECT * FROM notifications WHERE user_id=$user_id ORDER BY id DESC");
sendJSON(mysqli_fetch_all($res, MYSQLI_ASSOC));
?>