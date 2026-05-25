<?php
require_once __DIR__ . '/../config/db.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input)
  sendJSON(['error' => 'Invalid JSON'], 400);

$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
  sendJSON(['error' => 'Email and password required'], 400);
}

$stmt = $conn->prepare("SELECT id, name, email, password, role, branch, roll_number FROM users WHERE email = ? AND password = ?");
$stmt->bind_param("ss", $email, $password);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user) {
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