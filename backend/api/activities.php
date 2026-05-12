<?php
require_once '../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$project_id = $_GET['project_id'] ?? null;
$where = $project_id ? "WHERE details LIKE '%project ID $project_id%'" : "";
$query = "SELECT a.*, u.name as user_name FROM activity_logs a JOIN users u ON a.user_id=u.id $where ORDER BY a.id DESC LIMIT 50";
$res = mysqli_query($conn, $query);
sendJSON(mysqli_fetch_all($res, MYSQLI_ASSOC));
?>