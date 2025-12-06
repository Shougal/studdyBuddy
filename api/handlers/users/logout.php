<?php
require_once __DIR__ . '/../../middleware.php';

header('Content-Type: application/json');


// If there is a session, destroy it
session_unset();
session_destroy();

echo json_encode([
    "ok"  => true,
    "msg" => "Logged out"
]);
