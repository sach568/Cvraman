<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];

if ($role === 'student') {
  $total = $conn->query("SELECT COUNT(*) as cnt FROM projects WHERE student_id=$user_id")->fetch_assoc()['cnt'];
  $completed = $conn->query("SELECT COUNT(*) as cnt FROM tasks WHERE assigned_to=$user_id AND status='completed'")->fetch_assoc()['cnt'];
  $pending = $conn->query("SELECT COUNT(*) as cnt FROM tasks WHERE assigned_to=$user_id AND status!='completed'")->fetch_assoc()['cnt'];
  $overdue = $conn->query("SELECT COUNT(*) as cnt FROM tasks WHERE assigned_to=$user_id AND due_date < CURDATE() AND status!='completed'")->fetch_assoc()['cnt'];
  sendJSON(['totalProjects' => $total, 'tasksCompleted' => $completed, 'pendingTasks' => $pending, 'overdueTasks' => $overdue]);
} elseif ($role === 'mentor') {
  $total = $conn->query("SELECT COUNT(*) as cnt FROM projects WHERE mentor_id=$user_id")->fetch_assoc()['cnt'];
  $pending = $conn->query("SELECT COUNT(*) as cnt FROM projects WHERE mentor_id=$user_id AND status='submitted'")->fetch_assoc()['cnt'];
  sendJSON(['totalProjects' => $total, 'pendingReviews' => $pending]);
} else {
  $projects = $conn->query("SELECT COUNT(*) as cnt FROM projects")->fetch_assoc()['cnt'];
  $students = $conn->query("SELECT COUNT(*) as cnt FROM users WHERE role='student'")->fetch_assoc()['cnt'];
  $mentors = $conn->query("SELECT COUNT(*) as cnt FROM users WHERE role='mentor'")->fetch_assoc()['cnt'];
  sendJSON(['totalProjects' => $projects, 'students' => $students, 'mentors' => $mentors]);
}
?>