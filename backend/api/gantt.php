<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$q = "SELECT t.*, p.title as project_title FROM tasks t JOIN projects p ON t.project_id=p.id WHERE p.student_id=$user_id OR p.mentor_id=$user_id OR t.assigned_to=$user_id ORDER BY t.due_date ASC";
$res = mysqli_query($conn, $q);
sendJSON(mysqli_fetch_all($res, MYSQLI_ASSOC));
?>