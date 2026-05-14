<?php
require_once __DIR__ . '/../config/db.php';
if (!isLoggedIn())
  sendJSON(['authenticated' => false]);
sendJSON([
  'authenticated' => true,
  'user' => [
    'id' => $_SESSION['user_id'],
    'name' => $_SESSION['name'],
    'role' => $_SESSION['role'],
    'branch' => $_SESSION['branch'] ?? '',
    'roll_number' => $_SESSION['roll_number'] ?? ''
  ]
]);
?>