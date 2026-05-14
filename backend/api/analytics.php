<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$role = $_SESSION['role'];
$user_id = $_SESSION['user_id'];

if ($role === 'admin') {
  $res = mysqli_query($conn, "SELECT status, COUNT(*) as count FROM projects GROUP BY status");
} elseif ($role === 'mentor') {
  $res = mysqli_query($conn, "SELECT status, COUNT(*) as count FROM projects WHERE mentor_id=$user_id GROUP BY status");
} else {
  $res = mysqli_query($conn, "SELECT status, COUNT(*) as count FROM projects WHERE student_id=$user_id GROUP BY status");
}
$labels = [];
$values = [];
while ($row = mysqli_fetch_assoc($res)) {
  $labels[] = $row['status'];
  $values[] = (int) $row['count'];
}
sendJSON(['labels' => $labels, 'values' => $values]);
?>