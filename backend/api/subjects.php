<?php
require_once '../config/db.php';
requireLogin(); // only need login, not admin

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $res = mysqli_query($conn, "SELECT * FROM subjects ORDER BY id DESC");
  sendJSON(mysqli_fetch_all($res, MYSQLI_ASSOC));
}

if ($method === 'POST' || $method === 'DELETE') {
  // Only admin can modify
  if ($_SESSION['role'] !== 'admin')
    sendJSON(['error' => 'Forbidden'], 403);
  if ($method === 'POST') {
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    if (empty($name))
      sendJSON(['error' => 'Subject name required'], 400);
    mysqli_query($conn, "INSERT INTO subjects (name) VALUES ('$name')");
    sendJSON(['success' => true]);
  }
  if ($method === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $id = (int) $_DELETE['id'];
    mysqli_query($conn, "DELETE FROM subjects WHERE id=$id");
    sendJSON(['success' => true]);
  }
}
?>