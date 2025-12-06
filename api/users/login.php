<?php
// api/handlers/users/login.php
require_once __DIR__ . '/../../config/connect-db.php';
require_once __DIR__ . '/../../queries/get_users.php';
require_once __DIR__ . '/../middleware.php';

header('Content-Type: application/json');

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);
error_log("computingID: " . ($data['computingID'] ?? 'MISSING'));
error_log("password: " . ($data['password'] ?? 'MISSING'));


if (!is_array($data)) {
     error_log("Invalid JSON body");
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON body"]);
    exit;
}

if (empty($data['computingID']) || empty($data['password'])) {
     error_log("Missing required fields");
    http_response_code(400);
    echo json_encode(["error" => "computingID and password are required"]);
    exit;
}

$computingID = $data['computingID'];
$password    = $data['password'];
error_log("LOOKUP USER: " . $computingID);

// Get hash from DB
$hash = db_get_password_hash($computingID);

if ($hash === null) {
    error_log("User not found in DB");
    http_response_code(404);
    echo json_encode(["ok" => false, "error" => "User does not exist"]);
    exit;
}
error_log("PASSWORD HASH FROM DB: " . $hash);

// Verify password
if (!password_verify($password, $hash)) {
    error_log("Password mismatch for $computingID");
    http_response_code(401);
    echo json_encode(["ok" => false, "error" => "Invalid computing ID or password"]);
    exit;
}

// At this point: login success
$_SESSION['computingID'] = $computingID;
$_SESSION['LAST_ACTIVE'] = time();

echo json_encode([
    "ok"   => true,
    "msg"  => "Login successful",
    "user" => [
        "computingID" => $computingID
    ]
]);
error_log("LOGIN SUCCESS for $computingID");
