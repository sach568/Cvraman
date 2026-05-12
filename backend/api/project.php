<?php
require_once 'config.php';
requireLogin();
$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
if (!$id)
  sendJSON(['error' => 'Project ID required']);

$method = $_SERVER['REQUEST_METHOD'];
$role = $_SESSION['role'];
$user_id = $_SESSION['user_id'];

if ($method == 'GET') {
  $query = "SELECT p.*, s.name as subject_name, u.name as mentor_name, stu.name as student_name, stu.roll_number FROM projects p JOIN subjects s ON p.subject_id=s.id JOIN users u ON p.mentor_id=u.id JOIN users stu ON p.student_id=stu.id WHERE p.id=$id";
  $res = mysqli_query($conn, $query);
  if ($row = mysqli_fetch_assoc($res))
    sendJSON($row);
  else
    sendJSON(['error' => 'Project not found']);
}

if ($method == 'PUT') {
  parse_str(file_get_contents("php://input"), $_PUT);
  if ($role == 'student') {
    $title = $_PUT['title'];
    $desc = $_PUT['description'];
    $branch = $_PUT['branch'];
    $subject_id = $_PUT['subject_id'];
    $mentor_id = $_PUT['mentor_id'];
    $q = "UPDATE projects SET title='$title', description='$desc', branch='$branch', subject_id=$subject_id, mentor_id=$mentor_id WHERE id=$id AND student_id=$user_id";
    mysqli_query($conn, $q);
    sendJSON(['success' => true]);
  } elseif ($role == 'mentor') {
    $status = $_PUT['status'];
    $feedback = $_PUT['feedback'];
    $q = "UPDATE projects SET status='$status', feedback='$feedback' WHERE id=$id AND mentor_id=$user_id";
    mysqli_query($conn, $q);
    sendJSON(['success' => true]);
  } else
    sendJSON(['error' => 'Unauthorized']);
}

if ($method == 'DELETE') {
  if ($role != 'student')
    sendJSON(['error' => 'Only students can delete']);
  $res = mysqli_query($conn, "SELECT file_path FROM projects WHERE id=$id AND student_id=$user_id");
  if ($row = mysqli_fetch_assoc($res)) {
    if ($row['file_path'] && file_exists("../uploads/" . $row['file_path']))
      unlink("../uploads/" . $row['file_path']);
    mysqli_query($conn, "DELETE FROM projects WHERE id=$id");
    sendJSON(['success' => true]);
  } else
    sendJSON(['error' => 'Not found']);
}
?>