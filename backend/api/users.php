<?php
require_once '../config/db.php';

// GET: all users (for messages dropdown) or students/mentors
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  requireLogin();

  // If ?all=true, return all users except current one (for messaging)
  if (isset($_GET['all']) && $_GET['all'] == 'true') {
    $user_id = $_SESSION['user_id'];
    $res = mysqli_query($conn, "SELECT id, name, email, role FROM users WHERE id != $user_id ORDER BY name");
    sendJSON(['all' => mysqli_fetch_all($res, MYSQLI_ASSOC)]);
    exit;
  }

  // Default: return students and mentors separately
  $students = mysqli_query($conn, "SELECT id, name, email, roll_number, branch FROM users WHERE role='student'");
  $mentors = mysqli_query($conn, "SELECT id, name, email FROM users WHERE role='mentor'");
  sendJSON([
    'students' => mysqli_fetch_all($students, MYSQLI_ASSOC),
    'mentors' => mysqli_fetch_all($mentors, MYSQLI_ASSOC)
  ]);
  exit;
}

// POST, PUT, DELETE require admin role (for managing users)
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
  sendJSON(['error' => 'Forbidden'], 403);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
  $input = json_decode(file_get_contents('php://input'), true);
  if (!$input)
    sendJSON(['error' => 'Invalid JSON'], 400);
  $type = $input['type'] ?? '';

  if ($type === 'student') {
    $name = mysqli_real_escape_string($conn, $input['name'] ?? '');
    $email = mysqli_real_escape_string($conn, $input['email'] ?? '');
    $roll = mysqli_real_escape_string($conn, $input['roll_number'] ?? '');
    $branch = mysqli_real_escape_string($conn, $input['branch'] ?? 'CSE');
    if (empty($name) || empty($email) || empty($roll))
      sendJSON(['error' => 'Name, email, and roll number required'], 400);
    $check = mysqli_query($conn, "SELECT id FROM users WHERE email='$email' OR roll_number='$roll'");
    if (mysqli_num_rows($check) > 0)
      sendJSON(['error' => 'Email or Roll number already exists'], 400);
    $pwd = md5('password');
    mysqli_query($conn, "INSERT INTO users (name, email, password, role, roll_number, branch) VALUES ('$name','$email','$pwd','student','$roll','$branch')");
    sendJSON(['success' => true]);
  } elseif ($type === 'mentor') {
    $name = mysqli_real_escape_string($conn, $input['name'] ?? '');
    $email = mysqli_real_escape_string($conn, $input['email'] ?? '');
    if (empty($name) || empty($email))
      sendJSON(['error' => 'Name and email required'], 400);
    $check = mysqli_query($conn, "SELECT id FROM users WHERE email='$email'");
    if (mysqli_num_rows($check) > 0)
      sendJSON(['error' => 'Email already exists'], 400);
    $pwd = md5('password');
    mysqli_query($conn, "INSERT INTO users (name, email, password, role) VALUES ('$name','$email','$pwd','mentor')");
    sendJSON(['success' => true]);
  } else {
    sendJSON(['error' => 'Invalid type'], 400);
  }
}

if ($method === 'PUT') {
  parse_str(file_get_contents("php://input"), $_PUT);
  $id = (int) ($_GET['id'] ?? 0);
  if (!$id)
    sendJSON(['error' => 'User ID required'], 400);
  $name = mysqli_real_escape_string($conn, $_PUT['name'] ?? '');
  $email = mysqli_real_escape_string($conn, $_PUT['email'] ?? '');
  $role = $_PUT['role'] ?? '';
  $roll_number = mysqli_real_escape_string($conn, $_PUT['roll_number'] ?? '');
  $branch = mysqli_real_escape_string($conn, $_PUT['branch'] ?? '');
  if (empty($name) || empty($email))
    sendJSON(['error' => 'Name and email required'], 400);
  $check = mysqli_query($conn, "SELECT id FROM users WHERE email='$email' AND id != $id");
  if (mysqli_num_rows($check) > 0)
    sendJSON(['error' => 'Email already exists'], 400);
  if ($role === 'student') {
    if (empty($roll_number))
      sendJSON(['error' => 'Roll number required'], 400);
    $check_roll = mysqli_query($conn, "SELECT id FROM users WHERE roll_number='$roll_number' AND id != $id");
    if (mysqli_num_rows($check_roll) > 0)
      sendJSON(['error' => 'Roll number already exists'], 400);
    $q = "UPDATE users SET name='$name', email='$email', role='student', roll_number='$roll_number', branch='$branch' WHERE id=$id";
  } else {
    $q = "UPDATE users SET name='$name', email='$email', role='$role' WHERE id=$id";
  }
  mysqli_query($conn, $q);
  sendJSON(['success' => true]);
}

if ($method === 'DELETE') {
  $id = (int) ($_GET['id'] ?? 0);
  if (!$id)
    sendJSON(['error' => 'User ID required'], 400);
  if ($id == $_SESSION['user_id'])
    sendJSON(['error' => 'Cannot delete your own account'], 400);
  mysqli_query($conn, "DELETE FROM users WHERE id=$id");
  sendJSON(['success' => true]);
}
?>