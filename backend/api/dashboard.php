<?php
require_once '../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];

if ($role === 'student') {
  $total = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM projects WHERE student_id=$user_id"))['count'];
  $completed = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM tasks WHERE assigned_to=$user_id AND status='completed'"))['count'];
  $pending = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM tasks WHERE assigned_to=$user_id AND status!='completed'"))['count'];
  $overdue = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM tasks WHERE assigned_to=$user_id AND due_date < CURDATE() AND status!='completed'"))['count'];
  sendJSON(['totalProjects' => $total, 'tasksCompleted' => $completed, 'pendingTasks' => $pending, 'overdueTasks' => $overdue]);
} elseif ($role === 'mentor') {
  $total = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM projects WHERE mentor_id=$user_id"))['count'];
  $pendingReviews = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM projects WHERE mentor_id=$user_id AND status='submitted'"))['count'];
  sendJSON(['totalProjects' => $total, 'pendingReviews' => $pendingReviews]);
} else {
  $projects = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM projects"))['count'];
  $students = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM users WHERE role='student'"))['count'];
  $mentors = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) as count FROM users WHERE role='mentor'"))['count'];
  sendJSON(['totalProjects' => $projects, 'students' => $students, 'mentors' => $mentors]);
}
?>