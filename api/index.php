<?php

// CORS settings for React dev server
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Preflight requests end here
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);


$basePrefix = '/studdybuddy/api';
// Simple routing:

// 1) Create user (register)
if ($method === 'POST' && $uri === "$basePrefix/users") {
    require __DIR__ . '/handlers/users/create.php';
    exit;
}

// 2) Login
if ($method === 'POST' && $uri === "$basePrefix/login") {
    require __DIR__ . '/handlers/users/login.php';
    exit;
}

// 3) Logout
if ($method === 'POST' && $uri === "$basePrefix/logout") {
    require __DIR__ . '/handlers/users/logout.php';
    exit;
}

// 4) Public profile: GET /api/users/:computingID
if ($method === 'GET' && preg_match("#^{$basePrefix}/users/([^/]+)$#", $uri, $matches)) {
    $computingID = $matches[1];
    require __DIR__ . '/handlers/users/profile.php';
    exit;
}

// TODO: Here we'll add all other routes (offerings, groups, etc.)

http_response_code(404);
header('Content-Type: application/json');
echo json_encode(["error" => "Endpoint not found", "path" => $uri]);
