<?php
require_once __DIR__ . '/cors.php';
session_start();

$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'final_project_ms';

$conn = mysqli_connect($host, $user, $pass, $dbname);
if (!$conn) {
  http_response_code(500);
  echo json_encode(['error' => 'DB connection failed: ' . mysqli_connect_error()]);
  exit;
}

function sendJSON($data, $status = 200)
{
  http_response_code($status);
  header('Content-Type: application/json');
  echo json_encode($data);
  exit;
}

function isLoggedIn()
{
  return isset($_SESSION['user_id']);
}

function requireLogin()
{
  if (!isLoggedIn())
    sendJSON(['error' => 'Unauthorized'], 401);
}

function requireRole($role)
{
  requireLogin();
  if ($_SESSION['role'] != $role)
    sendJSON(['error' => 'Forbidden'], 403);
}
?>