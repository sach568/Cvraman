<?php
require_once '../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $status = $_GET['status'] ?? 'all';
  $where = $status !== 'all' ? "AND t.status='$status'" : "";
  $query = "SELECT t.*, p.title as project_title FROM tasks t JOIN projects p ON t.project_id=p.id WHERE (t.assigned_to=$user_id OR p.student_id=$user_id OR p.mentor_id=$user_id) $where ORDER BY t.due_date ASC";
  $res = mysqli_query($conn, $query);
  sendJSON(mysqli_fetch_all($res, MYSQLI_ASSOC));
}

if ($method === 'POST') {
  $input = json_decode(file_get_contents('php://input'), true);
  $project_id = (int) $input['project_id'];
  $title = mysqli_real_escape_string($conn, $input['title']);
  $description = mysqli_real_escape_string($conn, $input['description'] ?? '');
  $due_date = $input['due_date'];
  $assigned_to = (int) $input['assigned_to'];
  $q = "INSERT INTO tasks (project_id, title, description, due_date, assigned_to) VALUES ($project_id, '$title', '$description', '$due_date', $assigned_to)";
  if (mysqli_query($conn, $q)) {
    sendJSON(['success' => true, 'id' => mysqli_insert_id($conn)]);
  } else {
    sendJSON(['error' => mysqli_error($conn)], 500);
  }
}

if ($method === 'PUT') {
  $input = json_decode(file_get_contents('php://input'), true);
  $id = (int) $_GET['id'];

  // Allow updating any field
  $title = mysqli_real_escape_string($conn, $input['title'] ?? '');
  $description = mysqli_real_escape_string($conn, $input['description'] ?? '');
  $due_date = $input['due_date'] ?? null;
  $assigned_to = (int) ($input['assigned_to'] ?? 0);
  $status = mysqli_real_escape_string($conn, $input['status'] ?? '');

  $updates = [];
  if (!empty($title))
    $updates[] = "title='$title'";
  if (!empty($description))
    $updates[] = "description='$description'";
  if ($due_date)
    $updates[] = "due_date='$due_date'";
  if ($assigned_to > 0)
    $updates[] = "assigned_to=$assigned_to";
  if (!empty($status))
    $updates[] = "status='$status'";

  if (empty($updates))
    sendJSON(['error' => 'No fields to update'], 400);

  $query = "UPDATE tasks SET " . implode(', ', $updates) . " WHERE id=$id";
  mysqli_query($conn, $query);
  sendJSON(['success' => true]);
}

if ($method === 'DELETE') {
  $id = (int) $_GET['id'];
  // Check permission: user must be student/mentor of the project
  $check = mysqli_query($conn, "SELECT t.id FROM tasks t JOIN projects p ON t.project_id=p.id WHERE t.id=$id AND (p.student_id=$user_id OR p.mentor_id=$user_id)");
  if (mysqli_num_rows($check) === 0) {
    sendJSON(['error' => 'Unauthorized or task not found'], 403);
  }
  mysqli_query($conn, "DELETE FROM tasks WHERE id=$id");
  sendJSON(['success' => true]);
}
?>