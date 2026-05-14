<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $status = $_GET['status'] ?? 'all';
  $where = $status !== 'all' ? "AND t.status='$status'" : "";
  $q = "SELECT t.*, p.title as project_title FROM tasks t JOIN projects p ON t.project_id=p.id WHERE (t.assigned_to=$user_id OR p.student_id=$user_id OR p.mentor_id=$user_id) $where ORDER BY t.due_date ASC";
  $res = mysqli_query($conn, $q);
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
  if (mysqli_query($conn, $q))
    sendJSON(['success' => true, 'id' => mysqli_insert_id($conn)]);
  else
    sendJSON(['error' => mysqli_error($conn)], 500);
}

if ($method === 'PUT') {
  $input = json_decode(file_get_contents('php://input'), true);
  $id = (int) $_GET['id'];
  $updates = [];
  if (isset($input['title']))
    $updates[] = "title='" . mysqli_real_escape_string($conn, $input['title']) . "'";
  if (isset($input['description']))
    $updates[] = "description='" . mysqli_real_escape_string($conn, $input['description']) . "'";
  if (isset($input['due_date']))
    $updates[] = "due_date='{$input['due_date']}'";
  if (isset($input['assigned_to']))
    $updates[] = "assigned_to={$input['assigned_to']}";
  if (isset($input['status']))
    $updates[] = "status='{$input['status']}'";
  if (empty($updates))
    sendJSON(['error' => 'No fields'], 400);
  $q = "UPDATE tasks SET " . implode(', ', $updates) . " WHERE id=$id";
  mysqli_query($conn, $q);
  sendJSON(['success' => true]);
}

if ($method === 'DELETE') {
  $id = (int) $_GET['id'];
  $check = mysqli_query($conn, "SELECT t.id FROM tasks t JOIN projects p ON t.project_id=p.id WHERE t.id=$id AND (p.student_id=$user_id OR p.mentor_id=$user_id)");
  if (mysqli_num_rows($check) === 0)
    sendJSON(['error' => 'Unauthorized'], 403);
  mysqli_query($conn, "DELETE FROM tasks WHERE id=$id");
  sendJSON(['success' => true]);
}
?>