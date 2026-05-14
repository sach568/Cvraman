<?php
require_once '../config/db.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
  sendJSON(['error' => 'No JSON input'], 400);
}

$email = mysqli_real_escape_string($conn, trim($input['email']));
$password = md5($input['password']);

$sql = "SELECT * FROM users WHERE email='$email' AND password='$password'";
$res = mysqli_query($conn, $sql);
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
      'branch' => $user['branch'],
      'roll_number' => $user['roll_number']
    ]
  ]);
} else {
  sendJSON(['error' => 'Invalid credentials'], 401);
}
?>