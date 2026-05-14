<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];
$method = $_SERVER['REQUEST_METHOD'];

// ---------- GET ----------
if ($method === 'GET') {
  // Single project by ID
  if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = (int) $_GET['id'];
    $q = "SELECT p.*, s.name as subject_name, u.name as mentor_name, stu.name as student_name, stu.roll_number 
              FROM projects p 
              JOIN subjects s ON p.subject_id = s.id 
              JOIN users u ON p.mentor_id = u.id 
              JOIN users stu ON p.student_id = stu.id 
              WHERE p.id = $id";
    $res = mysqli_query($conn, $q);
    if ($row = mysqli_fetch_assoc($res))
      sendJSON($row);
    else
      sendJSON(['error' => 'Not found'], 404);
  }

  // List of projects with search
  $search = mysqli_real_escape_string($conn, $_GET['search'] ?? '');

  if ($role === 'student') {
    $where = "p.student_id = $user_id";
    if ($search) {
      $where .= " AND (p.title LIKE '%$search%' OR p.description LIKE '%$search%')";
    }
    $q = "SELECT p.*, s.name as subject_name, u.name as mentor_name 
              FROM projects p 
              JOIN subjects s ON p.subject_id = s.id 
              JOIN users u ON p.mentor_id = u.id 
              WHERE $where 
              ORDER BY p.id DESC";
  } elseif ($role === 'mentor') {
    $where = "p.mentor_id = $user_id";
    if ($search) {
      $where .= " AND (p.title LIKE '%$search%' OR (SELECT name FROM users WHERE id = p.student_id) LIKE '%$search%')";
    }
    $q = "SELECT p.*, u.name as student_name, u.roll_number, s.name as subject_name 
              FROM projects p 
              JOIN users u ON p.student_id = u.id 
              JOIN subjects s ON p.subject_id = s.id 
              WHERE $where 
              ORDER BY p.id DESC";
  } else { // admin
    $q = "SELECT p.*, stu.name as student_name, ment.name as mentor_name, s.name as subject_name 
              FROM projects p 
              JOIN users stu ON p.student_id = stu.id 
              JOIN users ment ON p.mentor_id = ment.id 
              JOIN subjects s ON p.subject_id = s.id 
              ORDER BY p.id DESC";
  }
  $res = mysqli_query($conn, $q);
  sendJSON(mysqli_fetch_all($res, MYSQLI_ASSOC));
}

// ---------- POST (Create) ----------
if ($method === 'POST') {
  if ($role !== 'student')
    sendJSON(['error' => 'Only students can create'], 403);

  $title = mysqli_real_escape_string($conn, $_POST['title']);
  $desc = mysqli_real_escape_string($conn, $_POST['description']);
  $branch = $_POST['branch'];
  $subject_id = (int) $_POST['subject_id'];
  $mentor_id = (int) $_POST['mentor_id'];
  $deadline = $_POST['deadline'] ?? null;
  $filePath = '';

  if (isset($_FILES['file']) && $_FILES['file']['error'] == 0) {
    $ext = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['jpg', 'jpeg', 'pdf', 'png']))
      sendJSON(['error' => 'Only JPG, PNG, PDF allowed'], 400);
    $fileName = time() . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
    move_uploaded_file($_FILES['file']['tmp_name'], __DIR__ . '/../uploads/' . $fileName);
    $filePath = $fileName;
  }

  $q = "INSERT INTO projects (title, description, branch, student_id, mentor_id, subject_id, file_path, deadline) 
          VALUES ('$title','$desc','$branch',$user_id,$mentor_id,$subject_id,'$filePath','$deadline')";
  mysqli_query($conn, $q);
  $id = mysqli_insert_id($conn);
  mysqli_query($conn, "INSERT INTO activity_logs (user_id, action, details) VALUES ($user_id, 'created project', 'Project ID: $id')");
  sendJSON(['success' => true, 'id' => $id]);
}

// ---------- PUT (Update) ----------
if ($method === 'PUT') {
  // Read JSON input (frontend sends application/json)
  $input = json_decode(file_get_contents('php://input'), true);
  if (!$input) {
    sendJSON(['error' => 'Invalid JSON'], 400);
  }
  $id = (int) $_GET['id'];

  if ($role === 'student') {
    // Student update: expects title, description, branch, subject_id, mentor_id, deadline
    $title = mysqli_real_escape_string($conn, $input['title'] ?? '');
    $desc = mysqli_real_escape_string($conn, $input['description'] ?? '');
    $branch = $input['branch'] ?? '';
    $subject_id = (int) ($input['subject_id'] ?? 0);
    $mentor_id = (int) ($input['mentor_id'] ?? 0);
    $deadline = $input['deadline'] ?? null;
    $q = "UPDATE projects SET title='$title', description='$desc', branch='$branch', subject_id=$subject_id, mentor_id=$mentor_id, deadline='$deadline' 
              WHERE id=$id AND student_id=$user_id";
    mysqli_query($conn, $q);
    sendJSON(['success' => true]);
  } elseif ($role === 'mentor') {
    // Mentor update: expects status, feedback, rating
    $status = mysqli_real_escape_string($conn, $input['status'] ?? '');
    $feedback = mysqli_real_escape_string($conn, $input['feedback'] ?? '');
    $rating = isset($input['rating']) ? (int) $input['rating'] : 'NULL';
    if (empty($status)) {
      sendJSON(['error' => 'Status is required'], 400);
    }
    $q = "UPDATE projects SET status='$status', feedback='$feedback', rating=$rating WHERE id=$id AND mentor_id=$user_id";
    mysqli_query($conn, $q);
    sendJSON(['success' => true]);
  } else {
    sendJSON(['error' => 'Unauthorized'], 403);
  }
}

// ---------- DELETE ----------
if ($method === 'DELETE') {
  if ($role !== 'student')
    sendJSON(['error' => 'Only students can delete'], 403);

  $id = (int) $_GET['id'];
  $res = mysqli_query($conn, "SELECT file_path FROM projects WHERE id=$id AND student_id=$user_id");
  if ($row = mysqli_fetch_assoc($res)) {
    if ($row['file_path'] && file_exists(__DIR__ . '/../uploads/' . $row['file_path']))
      unlink(__DIR__ . '/../uploads/' . $row['file_path']);
    mysqli_query($conn, "DELETE FROM projects WHERE id=$id");
    mysqli_query($conn, "INSERT INTO activity_logs (user_id, action, details) VALUES ($user_id, 'deleted project', 'Project ID: $id')");
    sendJSON(['success' => true]);
  } else {
    sendJSON(['error' => 'Not found'], 404);
  }
}
?>