<?php
require_once '../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];

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
  $values[] = $row['count'];
}
sendJSON(['labels' => $labels, 'values' => $values]);
?>