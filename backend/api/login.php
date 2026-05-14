<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once __DIR__ . '/../config/db.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input)
  sendJSON(['error' => 'Invalid JSON'], 400);

$email = trim($input['email']);
$password = trim($input['password']); // plain text

$res = mysqli_query($conn, "SELECT * FROM users WHERE email='$email' AND password='$password'");
if (!$res)
  sendJSON(['error' => 'DB error'], 500);

if ($user = mysqli_fetch_assoc($res)) {
  $_SESSION['user_id'] = $user['id'];
  $_SESSION['name'] = $user['name'];
  $_SESSION['role'] = $user['role'];
  $_SESSION['branch'] = $user['branch'] ?? '';
  $_SESSION['roll_number'] = $user['roll_number'] ?? '';
  sendJSON([
    'success' => true,
    'user' => [
      'id' => $user['id'],
      'name' => $user['name'],
      'role' => $user['role'],
      'branch' => $user['branch'] ?? '',
      'roll_number' => $user['roll_number'] ?? ''
    ]
  ]);
} else {
  sendJSON(['error' => 'Invalid email or password'], 401);
}
?>