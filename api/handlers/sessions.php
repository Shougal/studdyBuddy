<?php
require_once __DIR__ . '/../../config/connect-db.php';
require_once __DIR__ . '/../../queries/sessions.php';
require_once __DIR__ . '/../../queries/joins.php';

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

    try {
        error_log("Begin transaction for session + owner auto-join");
        $conn->beginTransaction();

        // 1) Create the session
        $result = db_create_session($groupID, $date, $start, $end, $building, $room);

        if (!$result["ok"]) {
            throw new Exception("Session create failed: " . ($result["error"] ?? "Unknown DB error"));
        }
        error_log("Session created successfully");

        // 2) Fetch the owner from StudyGroup
        $ownerQ = $conn->prepare("SELECT owner_computingID FROM StudyGroup WHERE groupID = ?");
        $ownerQ->execute([$groupID]);
        $ownerID = $ownerQ->fetchColumn();

        if (!$ownerID) {
            throw new Exception("Group owner not found");
        }
        error_log("Owner identified | $ownerID");

        // 3) Auto-join the owner
        $joinResult = db_join_group($ownerID, $groupID);

        if (!$joinResult["ok"]) {
            throw new Exception("Owner auto-join failed: " . $joinResult["msg"]);
        }
        error_log("Owner auto-joined into group successfully");

        // Everything succeeded
        $conn->commit();
        error_log("Transaction COMMITTED successfully");

        http_response_code(201);
        echo json_encode(["ok" => true]);

    } catch (Exception $e) {
        $conn->rollBack();
        error_log("Transaction ROLLBACK | Reason: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
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
