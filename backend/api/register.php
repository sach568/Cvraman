<?php
require_once __DIR__ . '/../config/db.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input)
    sendJSON(['error' => 'Invalid JSON'], 400);

$name = mysqli_real_escape_string($conn, $input['name']);
$email = mysqli_real_escape_string($conn, $input['email']);
$roll = mysqli_real_escape_string($conn, $input['roll_number']);
$branch = $input['branch'];
$password = $input['password']; // plain text
$confirm = $input['password_confirmation'];

if ($password != $confirm)
    sendJSON(['error' => 'Passwords do not match'], 400);

$check = mysqli_query($conn, "SELECT id FROM users WHERE email='$email' OR roll_number='$roll'");
if (mysqli_num_rows($check) > 0)
    sendJSON(['error' => 'Email or Roll number exists'], 400);

$q = "INSERT INTO users (name, email, password, role, roll_number, branch) VALUES ('$name','$email','$password','student','$roll','$branch')";
if (mysqli_query($conn, $q)) {
    $id = mysqli_insert_id($conn);
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