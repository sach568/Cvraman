<?php
require_once 'config.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $email = mysqli_real_escape_string($conn, $_POST['email']);
  $password = md5($_POST['password']);
  $res = mysqli_query($conn, "SELECT * FROM users WHERE email='$email' AND password='$password'");
  if (mysqli_num_rows($res) == 1) {
    $user = mysqli_fetch_assoc($res);
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['name'] = $user['name'];
    $_SESSION['role'] = $user['role'];
    $_SESSION['branch'] = $user['branch'];
    $_SESSION['roll_number'] = $user['roll_number'];
    sendJSON(['success' => true, 'user' => ['id' => $user['id'], 'name' => $user['name'], 'role' => $user['role'], 'branch' => $user['branch'], 'roll_number' => $user['roll_number']]]);
  } else {
    http_response_code(401);
    sendJSON(['error' => 'Invalid credentials']);
  }
}
?>