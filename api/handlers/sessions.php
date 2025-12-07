<?php
require_once __DIR__ . '/../../config/connect-db.php';
require_once __DIR__ . '/../../queries/sessions.php';

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$groupID = $_GET['groupID'] ?? null;

error_log("SESSION API HIT | Method=$method | URI=$uri | groupID=$groupID");



// 1️) POST /groups/:groupID/session  — Create Session

if ($method === "POST" && preg_match("#/groups/(\d+)/session$#", $uri)) {
    $body = json_decode(file_get_contents("php://input"), true) ?? [];
    error_log("CREATE SESSION | body=" . json_encode($body));

    $date = $body["date"] ?? null;
    $start = $body["start"] ?? null;
    $end = $body["end"] ?? null;
    $building = $body["building"] ?? null;
    $room = $body["room"] ?? null;

    if (!$date || !$start || !$end || !$building || !$room) {
        error_log("Missing session fields");
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }

    $result = db_create_session($groupID, $date, $start, $end, $building, $room);
    error_log("!CREATE SESSION RESULT: " . json_encode($result));

    http_response_code($result["ok"] ? 200 : 409);
    echo json_encode($result);
    exit;
}



// 2️) PATCH /groups/:groupID/session  — Reschedule Session

if ($method === "PATCH" && preg_match("#/groups/(\d+)/session$#", $uri)) {
    $body = json_decode(file_get_contents("php://input"), true) ?? [];
    error_log("➡ RESCHEDULE SESSION | body=" . json_encode($body));

    $date = $body["date"] ?? null;
    $start = $body["start"] ?? null;
    $end = $body["end"] ?? null;
    $building = $body["building"] ?? null;
    $room = $body["room"] ?? null;

    if (!$date || !$start || !$end || !$building || !$room) {
        error_log("Missing session fields");
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }

    $result = db_reschedule_session($groupID, $date, $start, $end, $building, $room);
    error_log("RESCHEDULE RESULT: " . json_encode($result));

    http_response_code($result["ok"] ? 200 : 409);
    echo json_encode($result);
    exit;
}


// 3️) GET /groups/:groupID/session  — Get session details

if ($method === "GET" && preg_match("#/groups/(\d+)/session$#", $uri)) {
    error_log("GET SESSION INFO");

    $row = db_get_session_by_group($groupID);

    if (!$row) {
        error_log("No session exists");
        echo json_encode(null); // Group has no session scheduled yet
        exit;
    }

    error_log("SESSION DETAILS FOUND");
    echo json_encode($row);
    exit;
}



// Invalid Route Fallback
error_log("Session route not matched");
http_response_code(404);
echo json_encode(["error" => "Invalid session route"]);
