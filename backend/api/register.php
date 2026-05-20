<?php
require_once __DIR__ . '/../config/db.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input)
    sendJSON(['error' => 'Invalid JSON'], 400);

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$roll = trim($input['roll_number'] ?? '');
$branch = trim($input['branch'] ?? 'CSE');
$password = $input['password'] ?? '';
$confirm = $input['password_confirmation'] ?? '';

if (empty($name))
    sendJSON(['error' => 'Name required'], 400);
if (!filter_var($email, FILTER_VALIDATE_EMAIL))
    sendJSON(['error' => 'Invalid email'], 400);
if (empty($roll))
    sendJSON(['error' => 'Roll number required'], 400);
if (strlen($password) < 6)
    sendJSON(['error' => 'Password must be at least 6 characters'], 400);
if ($password !== $confirm)
    sendJSON(['error' => 'Passwords do not match'], 400);

$stmt = $conn->prepare("SELECT id FROM users WHERE email = ? OR roll_number = ?");
$stmt->bind_param("ss", $email, $roll);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0)
    sendJSON(['error' => 'Email or Roll number already exists'], 400);
$stmt->close();

$hashed = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (name, email, password, role, roll_number, branch) VALUES (?, ?, ?, 'student', ?, ?)");
$stmt->bind_param("sssss", $name, $email, $hashed, $roll, $branch);
if ($stmt->execute()) {
    $id = $stmt->insert_id;
    $_SESSION['user_id'] = $id;
    $_SESSION['name'] = $name;
    $_SESSION['role'] = 'student';
    $_SESSION['branch'] = $branch;
    $_SESSION['roll_number'] = $roll;
    sendJSON(['success' => true, 'user' => ['id' => $id, 'name' => $name, 'role' => 'student', 'branch' => $branch, 'roll_number' => $roll]]);
} else {
    sendJSON(['error' => 'Registration failed'], 500);
}
?>