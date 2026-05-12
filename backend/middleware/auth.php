<?php
require_once __DIR__ . '/../config/jwt.php';
require_once __DIR__ . '/../config/db.php';

function authenticate()
{
  $decoded = verifyJWT();
  if (!$decoded) {
    sendJSON(['error' => 'Unauthorized'], 401);
  }
  return $decoded;
}

function requireRole($allowedRoles)
{
  $decoded = authenticate();
  if (!in_array($decoded->role, $allowedRoles)) {
    sendJSON(['error' => 'Forbidden'], 403);
  }
  return $decoded;
}
?>