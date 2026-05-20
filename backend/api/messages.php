<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();
$user_id = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $stmt = $conn->prepare("SELECT m.*, u1.name as sender_name, u2.name as receiver_name FROM messages m JOIN users u1 ON m.sender_id=u1.id JOIN users u2 ON m.receiver_id=u2.id WHERE m.sender_id=? OR m.receiver_id=? ORDER BY m.id DESC");
  $stmt->bind_param("ii", $user_id, $user_id);
  $stmt->execute();
  $res = $stmt->get_result();
  sendJSON($res->fetch_all(MYSQLI_ASSOC));
}
if ($method === 'POST') {
  $input = json_decode(file_get_contents('php://input'), true);
  if (!$input)
    sendJSON(['error' => 'Invalid JSON'], 400);
  $receiver_id = (int) $input['receiver_id'];
  $message = trim($input['message'] ?? '');
  if (empty($receiver_id) || empty($message))
    sendJSON(['error' => 'Receiver and message required'], 400);
  $stmt = $conn->prepare("INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)");
  $stmt->bind_param("iis", $user_id, $receiver_id, $message);
  $stmt->execute();
  $notif = $conn->prepare("INSERT INTO notifications (user_id, message, type, created_at) VALUES (?, 'You have a new message', 'message', NOW())");
  $notif->bind_param("i", $receiver_id);
  $notif->execute();
  sendJSON(['success' => true]);
}
if ($method === 'DELETE') {
  $id = (int) $_GET['id'];
  $stmt = $conn->prepare("DELETE FROM messages WHERE id=? AND (sender_id=? OR receiver_id=?)");
  $stmt->bind_param("iii", $id, $user_id, $user_id);
  $stmt->execute();
  sendJSON(['success' => true]);
}
?>