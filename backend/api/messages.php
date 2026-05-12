<?php
require_once '../config/db.php';
requireLogin();

$user_id = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
  $res = mysqli_query($conn, "SELECT m.*, u1.name as sender_name, u2.name as receiver_name 
                                FROM messages m 
                                JOIN users u1 ON m.sender_id=u1.id 
                                JOIN users u2 ON m.receiver_id=u2.id 
                                WHERE m.sender_id=$user_id OR m.receiver_id=$user_id 
                                ORDER BY m.id DESC");
  sendJSON(mysqli_fetch_all($res, MYSQLI_ASSOC));
}

if ($method === 'POST') {
  $input = json_decode(file_get_contents('php://input'), true);
  $receiver_id = (int) $input['receiver_id'];
  $message = mysqli_real_escape_string($conn, $input['message']);
  if (empty($receiver_id) || empty($message)) {
    sendJSON(['error' => 'Receiver and message required'], 400);
  }
  mysqli_query($conn, "INSERT INTO messages (sender_id, receiver_id, message) VALUES ($user_id, $receiver_id, '$message')");
  sendJSON(['success' => true]);
}

if ($method === 'DELETE') {
  $id = (int) ($_GET['id'] ?? 0);
  if (!$id)
    sendJSON(['error' => 'Message ID required'], 400);
  // Only sender or receiver can delete
  mysqli_query($conn, "DELETE FROM messages WHERE id=$id AND (sender_id=$user_id OR receiver_id=$user_id)");
  sendJSON(['success' => true]);
}
?>