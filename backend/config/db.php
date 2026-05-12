<?php
require_once __DIR__ . '/cors.php';
session_start();

$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'cvr_pms';

$conn = mysqli_connect($host, $user, $pass, $db);
if (!$conn)
  die(json_encode(['error' => 'DB connection failed']));

function sendJSON($data, $status = 200)
{
  http_response_code($status);
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