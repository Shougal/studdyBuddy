<?php
// api/handlers/users/create.php

require_once __DIR__ . '/../../../config/connect-db.php';
require_once __DIR__ . '/../../../queries/get_users.php';

header('Content-Type: application/json');


$raw = file_get_contents("php://input");
$data = json_decode($raw, true);


if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON body"]);
    exit;
}

if (empty($data['computingID']) || empty($data['name']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode(["error" => "computingID, name, and password are required"]);
    exit;
}

$computingID = $data['computingID'];
$name        = $data['name'];
$year        = $data['year'] ?? null;   // can be null
$password    = $data['password'];


error_log("STEP 1: Handler started");

try {
    error_log("STEP 2: Calling db_create_user");
    db_create_user($computingID, $name, $year, $password);
    error_log("STEP 3: Insert success");
    http_response_code(201);
    echo json_encode(["ok" => true, "msg" => "User created successfully"]);

} catch (PDOException $e) {
    error_log("STEP 4: PDO EXCEPTION: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}