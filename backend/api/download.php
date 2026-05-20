<?php
require_once __DIR__ . '/../config/db.php';
requireLogin();

$file = $_GET['file'] ?? '';
if (empty($file))
  sendJSON(['error' => 'No file specified'], 400);
$file = basename($file);
if (!preg_match('/^[a-zA-Z0-9_.-]+$/', $file))
  sendJSON(['error' => 'Invalid file name'], 400);

$uploadDir = dirname(__DIR__) . '/uploads/';
$filePath = $uploadDir . $file;
if (!file_exists($filePath))
  sendJSON(['error' => 'File not found'], 404);

header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $file . '"');
header('Content-Length: ' . filesize($filePath));
readfile($filePath);
exit;
?>