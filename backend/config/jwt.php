<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

define('JWT_SECRET', 'your-secret-key-change-this');
define('JWT_EXPIRY', 3600 * 24); // 24 hours

function generateJWT($user)
{
  $payload = [
    'user_id' => $user['id'],
    'email' => $user['email'],
    'role' => $user['role'],
    'exp' => time() + JWT_EXPIRY
  ];
  return JWT::encode($payload, JWT_SECRET, 'HS256');
}

function verifyJWT()
{
  $headers = apache_request_headers();
  if (!isset($headers['Authorization']))
    return null;
  $token = str_replace('Bearer ', '', $headers['Authorization']);
  try {
    return JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
  } catch (Exception $e) {
    return null;
  }
}
?>