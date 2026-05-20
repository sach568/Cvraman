<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$role = $_SESSION['role'];
$user_id = $_SESSION['user_id'];

if ($role === 'admin') {
  $res = $conn->query("SELECT status, COUNT(*) as count FROM projects GROUP BY status");
} elseif ($role === 'mentor') {
  $stmt = $conn->prepare("SELECT status, COUNT(*) as count FROM projects WHERE mentor_id=? GROUP BY status");
  $stmt->bind_param("i", $user_id);
  $stmt->execute();
  $res = $stmt->get_result();
} else {
  $stmt = $conn->prepare("SELECT status, COUNT(*) as count FROM projects WHERE student_id=? GROUP BY status");
  $stmt->bind_param("i", $user_id);
  $stmt->execute();
  $res = $stmt->get_result();
}
$labels = [];
$values = [];
while ($row = $res->fetch_assoc()) {
  $labels[] = $row['status'];
  $values[] = (int) $row['count'];
}
sendJSON(['labels' => $labels, 'values' => $values]);
?>