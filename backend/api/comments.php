<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$project_id = (int) ($_GET['project_id'] ?? 0);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $res = mysqli_query($conn, "SELECT c.*, u.name FROM comments c JOIN users u ON c.user_id=u.id WHERE c.project_id=$project_id ORDER BY c.id ASC");
  sendJSON(mysqli_fetch_all($res, MYSQLI_ASSOC));
}
if ($method === 'POST') {
  $input = json_decode(file_get_contents('php://input'), true);
  $comment = mysqli_real_escape_string($conn, $input['comment']);
  mysqli_query($conn, "INSERT INTO comments (project_id, user_id, comment) VALUES ($project_id, $user_id, '$comment')");
  sendJSON(['success' => true]);
}
?>