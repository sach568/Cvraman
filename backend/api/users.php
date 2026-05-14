<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'GET') {
  $students = mysqli_query($conn, "SELECT id, name, email, roll_number, branch FROM users WHERE role='student'");
  $mentors = mysqli_query($conn, "SELECT id, name, email, branch, roll_number FROM users WHERE role='mentor'");
  sendJSON(['students' => mysqli_fetch_all($students, MYSQLI_ASSOC), 'mentors' => mysqli_fetch_all($mentors, MYSQLI_ASSOC)]);
}
if ($method === 'POST') {
  if ($_SESSION['role'] !== 'admin')
    sendJSON(['error' => 'Forbidden'], 403);
  $input = json_decode(file_get_contents('php://input'), true);
  $type = $input['type'] ?? '';
  if ($type === 'student') {
    $name = mysqli_real_escape_string($conn, $input['name']);
    $email = mysqli_real_escape_string($conn, $input['email']);
    $roll = mysqli_real_escape_string($conn, $input['roll_number']);
    $branch = $input['branch'];
    $pwd = md5('password'); // default password 'password'
    mysqli_query($conn, "INSERT INTO users (name, email, password, role, roll_number, branch) VALUES ('$name','$email','$pwd','student','$roll','$branch')");
    sendJSON(['success' => true]);
  } elseif ($type === 'mentor') {
    $name = mysqli_real_escape_string($conn, $input['name']);
    $email = mysqli_real_escape_string($conn, $input['email']);
    $pwd = md5('password');
    mysqli_query($conn, "INSERT INTO users (name, email, password, role, branch, roll_number) VALUES ('$name','$email','$pwd','mentor', 'CSE', CONCAT('M', FLOOR(RAND()*1000)))");
    sendJSON(['success' => true]);
  } else
    sendJSON(['error' => 'Invalid type'], 400);
}
?>