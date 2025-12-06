<?php
require_once __DIR__ . '/../../../config/connect-db.php';
require_once __DIR__ . '/../../../queries/get_users.php';

header('Content-Type: application/json');

// computingID should be provided by the router
if (!isset($computingID) || $computingID === '') {
    http_response_code(400);
    echo json_encode(["error" => "computingID is required"]);
    exit;
}

$user = db_get_user($computingID);

if (!$user) {
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
    exit;
}

// Remove any sensitive fields
unset($user['password_hash']);

http_response_code(200);
echo json_encode($user);