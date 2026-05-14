<?php
require_once '../config/db.php';
requireLogin();

$file = $_GET['file'] ?? '';
if (empty($file)) {
  sendJSON(['error' => 'No file specified'], 400);
}

// Security: only allow alphanumeric, dot, underscore, dash
$file = basename($file);
if (!preg_match('/^[a-zA-Z0-9_.-]+$/', $file)) {
  sendJSON(['error' => 'Invalid file name'], 400);
}

$uploadDir = dirname(__DIR__) . '/uploads/';
$filePath = $uploadDir . $file;

if (!file_exists($filePath)) {
  sendJSON(['error' => 'File not found'], 404);
}

// Serve the file
header('Content-Type: ' . mime_content_type($filePath));
header('Content-Disposition: attachment; filename="' . basename($file) . '"');
readfile($filePath);
exit;
?>