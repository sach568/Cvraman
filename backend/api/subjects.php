<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $res = $conn->query("SELECT * FROM subjects ORDER BY id DESC");
  sendJSON($res->fetch_all(MYSQLI_ASSOC));
}

if ($method === 'POST') {
  requireRole('admin');
  $input = json_decode(file_get_contents('php://input'), true);
  if (!$input)
    sendJSON(['error' => 'Invalid JSON'], 400);
  $name = trim($input['name'] ?? '');
  if (empty($name))
    sendJSON(['error' => 'Subject name required'], 400);
  $stmt = $conn->prepare("INSERT INTO subjects (name) VALUES (?)");
  $stmt->bind_param("s", $name);
  $stmt->execute();
  sendJSON(['success' => true]);
}

if ($method === 'DELETE') {
  requireRole('admin');
  $id = (int) ($_GET['id'] ?? 0);
  if ($id <= 0)
    sendJSON(['error' => 'Invalid subject ID'], 400);
  $stmt = $conn->prepare("DELETE FROM subjects WHERE id=?");
  $stmt->bind_param("i", $id);
  $stmt->execute();
  sendJSON(['success' => true]);
}
?>