<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();
$user_id = $_SESSION['user_id'];
$q = "SELECT * FROM notifications WHERE user_id=$user_id ORDER BY id DESC LIMIT 20";
$res = mysqli_query($conn, $q);
sendJSON(mysqli_fetch_all($res, MYSQLI_ASSOC));
?>