<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$method = $_SERVER['REQUEST_METHOD'];

// GET: return all subjects
if ($method === 'GET') {
  $res = mysqli_query($conn, "SELECT * FROM subjects ORDER BY id DESC");
  sendJSON(mysqli_fetch_all($res, MYSQLI_ASSOC));
}

// POST: add a new subject (admin only)
if ($method === 'POST') {
  if ($_SESSION['role'] !== 'admin')
    sendJSON(['error' => 'Forbidden'], 403);

  // Read JSON input
  $input = json_decode(file_get_contents('php://input'), true);
  if (!$input) {
    sendJSON(['error' => 'Invalid JSON'], 400);
  }
  $name = trim($input['name'] ?? '');
  if (empty($name)) {
    sendJSON(['error' => 'Subject name required'], 400);
  }
  $name = mysqli_real_escape_string($conn, $name);
  mysqli_query($conn, "INSERT INTO subjects (name) VALUES ('$name')");
  sendJSON(['success' => true]);
}

// DELETE: remove a subject (admin only)
if ($method === 'DELETE') {
  if ($_SESSION['role'] !== 'admin')
    sendJSON(['error' => 'Forbidden'], 403);
  $id = (int) ($_GET['id'] ?? 0);
  if ($id <= 0)
    sendJSON(['error' => 'Invalid subject ID'], 400);
  mysqli_query($conn, "DELETE FROM subjects WHERE id = $id");
  sendJSON(['success' => true]);
}
?>