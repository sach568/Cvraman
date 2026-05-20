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

$stmt = $conn->prepare("SELECT id, name, email, password, role, branch, roll_number FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
  sendJSON(['error' => 'Invalid email or password'], 401);
}

// यहाँ दोनों तरीकों से मिलान करें:
// 1) password_verify - यदि पासवर्ड हैश किया गया है
// 2) सीधा तुलना - आपके मौजूदा plain text पासवर्ड के लिए
$valid = false;
if (password_verify($password, $user['password'])) {
  $valid = true;
} elseif ($user['password'] === $password) {
  // ⚠️ अस्थायी समाधान – बाद में सभी पासवर्ड को हैश कर दें
  $valid = true;
}

if ($valid) {
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
  sendJSON(['error' => 'Invalid credentials'], 401);
}
?>