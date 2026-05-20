<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];
$method = $_SERVER['REQUEST_METHOD'];

// GET
if ($method === 'GET') {
  if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $id = (int) $_GET['id'];
    $stmt = $conn->prepare("SELECT p.*, s.name as subject_name, u.name as mentor_name, stu.name as student_name, stu.roll_number FROM projects p JOIN subjects s ON p.subject_id=s.id JOIN users u ON p.mentor_id=u.id JOIN users stu ON p.student_id=stu.id WHERE p.id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($row = $res->fetch_assoc())
      sendJSON($row);
    else
      sendJSON(['error' => 'Not found'], 404);
  }
  $search = trim($_GET['search'] ?? '');
  if ($role === 'student') {
    $sql = "SELECT p.*, s.name as subject_name, u.name as mentor_name FROM projects p JOIN subjects s ON p.subject_id=s.id JOIN users u ON p.mentor_id=u.id WHERE p.student_id = ?";
    if ($search)
      $sql .= " AND (p.title LIKE ? OR p.description LIKE ?)";
    $sql .= " ORDER BY p.id DESC";
    $stmt = $conn->prepare($sql);
    if ($search) {
      $like = "%$search%";
      $stmt->bind_param("iss", $user_id, $like, $like);
    } else
      $stmt->bind_param("i", $user_id);
  } elseif ($role === 'mentor') {
    $sql = "SELECT p.*, u.name as student_name, u.roll_number, s.name as subject_name FROM projects p JOIN users u ON p.student_id=u.id JOIN subjects s ON p.subject_id=s.id WHERE p.mentor_id = ?";
    if ($search)
      $sql .= " AND (p.title LIKE ? OR u.name LIKE ?)";
    $sql .= " ORDER BY p.id DESC";
    $stmt = $conn->prepare($sql);
    if ($search) {
      $like = "%$search%";
      $stmt->bind_param("iss", $user_id, $like, $like);
    } else
      $stmt->bind_param("i", $user_id);
  } else {
    $stmt = $conn->prepare("SELECT p.*, stu.name as student_name, ment.name as mentor_name, s.name as subject_name FROM projects p JOIN users stu ON p.student_id=stu.id JOIN users ment ON p.mentor_id=ment.id JOIN subjects s ON p.subject_id=s.id ORDER BY p.id DESC");
    $stmt->execute();
    $res = $stmt->get_result();
    sendJSON($res->fetch_all(MYSQLI_ASSOC));
    exit;
  }
  $stmt->execute();
  $res = $stmt->get_result();
  sendJSON($res->fetch_all(MYSQLI_ASSOC));
}

// POST Create
if ($method === 'POST') {
  if ($role !== 'student')
    sendJSON(['error' => 'Only students can create'], 403);
  $title = trim($_POST['title'] ?? '');
  $desc = trim($_POST['description'] ?? '');
  $branch = $_POST['branch'] ?? 'CSE';
  $subject_id = (int) $_POST['subject_id'];
  $mentor_id = (int) $_POST['mentor_id'];
  $deadline = $_POST['deadline'] ?? null;
  $filePath = '';
  if (empty($title) || empty($desc) || !$subject_id || !$mentor_id)
    sendJSON(['error' => 'Missing required fields'], 400);
  if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $ext = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['jpg', 'jpeg', 'pdf', 'png']))
      sendJSON(['error' => 'Invalid file type'], 400);
    $fileName = time() . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
    $uploadDir = __DIR__ . '/../uploads/';
    if (!is_dir($uploadDir))
      mkdir($uploadDir, 0777, true);
    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadDir . $fileName))
      $filePath = $fileName;
    else
      sendJSON(['error' => 'File upload failed'], 500);
  }
  $stmt = $conn->prepare("INSERT INTO projects (title, description, branch, student_id, mentor_id, subject_id, file_path, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  $stmt->bind_param("sssiiiss", $title, $desc, $branch, $user_id, $mentor_id, $subject_id, $filePath, $deadline);
  if ($stmt->execute()) {
    $id = $stmt->insert_id;
    $act = $conn->prepare("INSERT INTO activity_logs (user_id, action, details) VALUES (?, 'created project', ?)");
    $details = "Project ID: $id";
    $act->bind_param("is", $user_id, $details);
    $act->execute();
    sendJSON(['success' => true, 'id' => $id]);
  } else
    sendJSON(['error' => 'DB error'], 500);
}

// PUT Update
if ($method === 'PUT') {
  $input = json_decode(file_get_contents('php://input'), true);
  if (!$input)
    sendJSON(['error' => 'Invalid JSON'], 400);
  $id = (int) ($_GET['id'] ?? 0);
  if ($role === 'student') {
    $title = $input['title'] ?? '';
    $desc = $input['description'] ?? '';
    $branch = $input['branch'] ?? '';
    $subject_id = (int) ($input['subject_id'] ?? 0);
    $mentor_id = (int) ($input['mentor_id'] ?? 0);
    $deadline = $input['deadline'] ?? null;
    $stmt = $conn->prepare("UPDATE projects SET title=?, description=?, branch=?, subject_id=?, mentor_id=?, deadline=? WHERE id=? AND student_id=?");
    $stmt->bind_param("sssiiisi", $title, $desc, $branch, $subject_id, $mentor_id, $deadline, $id, $user_id);
    $stmt->execute();
    sendJSON(['success' => true]);
  } elseif ($role === 'mentor') {
    $status = $input['status'] ?? '';
    $feedback = $input['feedback'] ?? '';
    $rating = isset($input['rating']) ? (int) $input['rating'] : null;
    if (empty($status))
      sendJSON(['error' => 'Status required'], 400);
    $stmt = $conn->prepare("UPDATE projects SET status=?, feedback=?, rating=? WHERE id=? AND mentor_id=?");
    $stmt->bind_param("ssiii", $status, $feedback, $rating, $id, $user_id);
    $stmt->execute();
    $studQ = $conn->prepare("SELECT student_id FROM projects WHERE id=?");
    $studQ->bind_param("i", $id);
    $studQ->execute();
    $stud = $studQ->get_result()->fetch_assoc();
    if ($stud) {
      $msg = "Your project #$id has been reviewed. Status: $status";
      $notif = $conn->prepare("INSERT INTO notifications (user_id, message, type, created_at) VALUES (?, ?, 'review', NOW())");
      $notif->bind_param("is", $stud['student_id'], $msg);
      $notif->execute();
    }
    sendJSON(['success' => true]);
  } else
    sendJSON(['error' => 'Unauthorized'], 403);
}

// DELETE
if ($method === 'DELETE') {
  if ($role !== 'student')
    sendJSON(['error' => 'Only students can delete'], 403);
  $id = (int) ($_GET['id'] ?? 0);
  $stmt = $conn->prepare("SELECT file_path FROM projects WHERE id=? AND student_id=?");
  $stmt->bind_param("ii", $id, $user_id);
  $stmt->execute();
  $row = $stmt->get_result()->fetch_assoc();
  if ($row) {
    if ($row['file_path'] && file_exists(__DIR__ . '/../uploads/' . $row['file_path']))
      unlink(__DIR__ . '/../uploads/' . $row['file_path']);
    $del = $conn->prepare("DELETE FROM projects WHERE id=? AND student_id=?");
    $del->bind_param("ii", $id, $user_id);
    $del->execute();
    $act = $conn->prepare("INSERT INTO activity_logs (user_id, action, details) VALUES (?, 'deleted project', ?)");
    $details = "Project ID: $id";
    $act->bind_param("is", $user_id, $details);
    $act->execute();
    sendJSON(['success' => true]);
  } else
    sendJSON(['error' => 'Not found'], 404);
}
?>