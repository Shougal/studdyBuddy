<?php
require_once __DIR__ . '/../../../config/connect-db.php';
require_once __DIR__ . '/../../../queries/get_users.php';

header('Content-Type: application/json');

// Step 1: Log request start
error_log("PROFILE API HIT");

// Get computingID from query string
$computingID = $_GET['computingID'] ?? null;
error_log("Received computingID: " . ($computingID ?? 'NULL'));

if (!$computingID) {
    error_log("ERROR: Missing computingID");
    http_response_code(400);
    echo json_encode(["error" => "computingID is required"]);
    exit;
}

// Step 2: Attempt DB lookup
error_log("Looking up user for ID: $computingID");
$user = db_get_user($computingID);

if (!$user) {
    error_log("User not found for ID: $computingID");
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
    exit;
}

// Step 3: Remove sensitive fields
if (isset($user['password_hash'])) {
    error_log("Removing password hash from result for security.");
}
unset($user['password_hash']);

// Step 4: Success
error_log("Profile lookup successful for $computingID");
http_response_code(200);
echo json_encode($user);
