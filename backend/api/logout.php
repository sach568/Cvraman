<?php
require_once __DIR__ . '/../config/db.php';
session_destroy();
sendJSON(['success' => true]);
?>