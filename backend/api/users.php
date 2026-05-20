<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $students = $conn->query("SELECT id, name, email, roll_number, branch FROM users WHERE role='student'");
  $mentors = $conn->query("SELECT id, name, email, branch, roll_number FROM users WHERE role='mentor'");
  sendJSON([
    'students' => $students->fetch_all(MYSQLI_ASSOC),
    'mentors' => $mentors->fetch_all(MYSQLI_ASSOC)
  ]);
}

if ($method === 'POST') {
  requireRole('admin');
  $input = json_decode(file_get_contents('php://input'), true);
  if (!$input)
    sendJSON(['error' => 'Invalid JSON'], 400);

  $type = $input['type'] ?? '';

  if ($type === 'student') {
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $roll = trim($input['roll_number'] ?? '');
    $branch = $input['branch'] ?? 'CSE';

    // ✅ Validation
    if (empty($name))
      sendJSON(['error' => 'Name is required'], 400);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL))
      sendJSON(['error' => 'Invalid email'], 400);
    if (empty($roll))
      sendJSON(['error' => 'Roll number is required'], 400);

    // ✅ Duplicate check
    $check = $conn->prepare("SELECT id FROM users WHERE email = ? OR roll_number = ?");
    $check->bind_param("ss", $email, $roll);
    $check->execute();
    if ($check->get_result()->num_rows > 0) {
      sendJSON(['error' => 'Email or Roll number already exists!'], 400);
    }

    $pwd = password_hash('password', PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, role, roll_number, branch) VALUES (?, ?, ?, 'student', ?, ?)");
    $stmt->bind_param("sssss", $name, $email, $pwd, $roll, $branch);
    if ($stmt->execute()) {
      sendJSON(['success' => true]);
    } else {
      sendJSON(['error' => 'Failed to add student'], 500);
    }

  } elseif ($type === 'mentor') {
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');

    // ✅ Validation
    if (empty($name))
      sendJSON(['error' => 'Name is required'], 400);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL))
      sendJSON(['error' => 'Invalid email'], 400);

    // ✅ Duplicate check (only email, because mentor may not have roll_number)
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    if ($check->get_result()->num_rows > 0) {
      sendJSON(['error' => 'Email already exists!'], 400);
    }

    $pwd = password_hash('password', PASSWORD_DEFAULT);
    $roll = 'M' . rand(100, 999); // auto-generate roll number
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, role, branch, roll_number) VALUES (?, ?, ?, 'mentor', 'CSE', ?)");
    $stmt->bind_param("ssss", $name, $email, $pwd, $roll);
    if ($stmt->execute()) {
      sendJSON(['success' => true]);
    } else {
      sendJSON(['error' => 'Failed to add mentor'], 500);
    }

  } else {
    sendJSON(['error' => 'Invalid type'], 400);
  }
}
?>