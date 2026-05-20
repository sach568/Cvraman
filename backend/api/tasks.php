<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $status = $_GET['status'] ?? 'all';
  $sql = "SELECT t.*, p.title as project_title FROM tasks t JOIN projects p ON t.project_id=p.id WHERE (t.assigned_to=? OR p.student_id=? OR p.mentor_id=?)";
  if ($status !== 'all')
    $sql .= " AND t.status=?";
  $sql .= " ORDER BY t.due_date ASC";
  $stmt = $conn->prepare($sql);
  if ($status !== 'all')
    $stmt->bind_param("iiis", $user_id, $user_id, $user_id, $status);
  else
    $stmt->bind_param("iii", $user_id, $user_id, $user_id);
  $stmt->execute();
  $res = $stmt->get_result();
  sendJSON($res->fetch_all(MYSQLI_ASSOC));
}

if ($method === 'POST') {
  $input = json_decode(file_get_contents('php://input'), true);
  if (!$input)
    sendJSON(['error' => 'Invalid JSON'], 400);
  $project_id = (int) $input['project_id'];
  $title = trim($input['title'] ?? '');
  $description = trim($input['description'] ?? '');
  $due_date = $input['due_date'] ?? null;
  $assigned_to = (int) ($input['assigned_to'] ?? 0);
  if (empty($title) || !$project_id)
    sendJSON(['error' => 'Project and Title are required'], 400);
  $stmt = $conn->prepare("INSERT INTO tasks (project_id, title, description, due_date, assigned_to) VALUES (?, ?, ?, ?, ?)");
  $stmt->bind_param("isssi", $project_id, $title, $description, $due_date, $assigned_to);
  if ($stmt->execute()) {
    $id = $stmt->insert_id;
    if ($assigned_to) {
      $msg = "New task '$title' assigned to you.";
      $notif = $conn->prepare("INSERT INTO notifications (user_id, message, type, created_at) VALUES (?, ?, 'task', NOW())");
      $notif->bind_param("is", $assigned_to, $msg);
      $notif->execute();
    }
    sendJSON(['success' => true, 'id' => $id]);
  } else
    sendJSON(['error' => 'DB error'], 500);
}

if ($method === 'PUT') {
  $input = json_decode(file_get_contents('php://input'), true);
  if (!$input)
    sendJSON(['error' => 'Invalid JSON'], 400);
  $id = (int) ($_GET['id'] ?? 0);
  $updates = [];
  $params = [];
  $types = '';
  if (isset($input['title'])) {
    $updates[] = "title=?";
    $params[] = $input['title'];
    $types .= 's';
  }
  if (isset($input['description'])) {
    $updates[] = "description=?";
    $params[] = $input['description'];
    $types .= 's';
  }
  if (isset($input['due_date'])) {
    $updates[] = "due_date=?";
    $params[] = $input['due_date'];
    $types .= 's';
  }
  if (isset($input['assigned_to'])) {
    $updates[] = "assigned_to=?";
    $params[] = $input['assigned_to'];
    $types .= 'i';
  }
  if (isset($input['status'])) {
    $updates[] = "status=?";
    $params[] = $input['status'];
    $types .= 's';
  }
  if (empty($updates))
    sendJSON(['error' => 'No fields'], 400);
  $sql = "UPDATE tasks SET " . implode(', ', $updates) . " WHERE id=?";
  $params[] = $id;
  $types .= 'i';
  $stmt = $conn->prepare($sql);
  $stmt->bind_param($types, ...$params);
  $stmt->execute();
  sendJSON(['success' => true]);
}

if ($method === 'DELETE') {
  $id = (int) ($_GET['id'] ?? 0);
  $check = $conn->prepare("SELECT t.id FROM tasks t JOIN projects p ON t.project_id=p.id WHERE t.id=? AND (p.student_id=? OR p.mentor_id=?)");
  $check->bind_param("iii", $id, $user_id, $user_id);
  $check->execute();
  if ($check->get_result()->num_rows === 0)
    sendJSON(['error' => 'Unauthorized'], 403);
  $del = $conn->prepare("DELETE FROM tasks WHERE id=?");
  $del->bind_param("i", $id);
  $del->execute();
  sendJSON(['success' => true]);
}
?>