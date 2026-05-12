<?php
require_once '../config/db.php';
session_destroy();
sendJSON(['success' => true]);
?>