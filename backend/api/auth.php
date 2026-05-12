<?php
require_once '../config/db.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'];
$password = md5($data['password']);

$res = mysqli_query($conn, "SELECT * FROM users WHERE email='$email' AND password='$password'");
if ($user = mysqli_fetch_assoc($res)) {
  $_SESSION['user_id'] = $user['id'];
  $_SESSION['name'] = $user['name'];
  $_SESSION['role'] = $user['role'];
  $_SESSION['branch'] = $user['branch'];
  $_SESSION['roll_number'] = $user['roll_number'];
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