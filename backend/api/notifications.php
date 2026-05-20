<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();
$user_id = $_SESSION['user_id'];
$stmt = $conn->prepare("SELECT * FROM notifications WHERE user_id=? ORDER BY id DESC LIMIT 20");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result();
sendJSON($res->fetch_all(MYSQLI_ASSOC));
?>