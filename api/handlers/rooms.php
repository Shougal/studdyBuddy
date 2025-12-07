<?php
require_once __DIR__ . '/../../config/connect-db.php';
require_once __DIR__ . '/../../queries/locations.php';

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

error_log("ROOMS API HIT | Method=$method | URI=$uri");



// 1️) POST /api/rooms  — Create room  (admin only in real env)

if ($method === "POST" && preg_match("#/rooms$#", $uri)) {
    error_log("➡ CREATE ROOM route matched");

    $body = json_decode(file_get_contents("php://input"), true);

    $building = $body["building"] ?? null;
    $room = $body["room"] ?? null;
    $capacity = $body["capacity"] ?? null;

    if (!$building || !$room || !$capacity) {
        error_log("Missing fields in room creation");
        http_response_code(400);
        echo json_encode(["error" => "building, room, capacity required"]);
        exit;
    }

    try {
        db_create_location($building, $room, (int)$capacity);
        error_log("Room created: $building $room ($capacity)");
        http_response_code(201);
        echo json_encode(["ok" => true, "msg" => "Location created"]);
    } catch (PDOException $e) {
        error_log(" !CREATE ROOM DB ERROR: " . $e->getMessage());
        http_response_code(409);
        echo json_encode(["error" => "Room already exists"]);
    }
    exit;
}



// 2️) GET /api/rooms/free  — Find available rooms for scheduling

if ($method === "GET" && preg_match("#/rooms/free$#", $uri)) {
    error_log("FIND FREE ROOMS route matched");

    $date = $_GET["date"] ?? null;
    $start = $_GET["start"] ?? null;
    $end = $_GET["end"] ?? null;

    if (!$date || !$start || !$end) {
        error_log("Missing date/start/end in free rooms request");
        http_response_code(400);
        echo json_encode(["error" => "date, start, end required"]);
        exit;
    }

    $rows = db_find_free_rooms($date, $start, $end);
    error_log("Rooms found: " . count($rows));

    http_response_code(200);
    echo json_encode($rows);
    exit;
}



// Fallback

error_log("Invalid Room Management route");
http_response_code(404);
echo json_encode(["error" => "Invalid room route"]);
