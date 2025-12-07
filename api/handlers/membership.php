<?php
require_once __DIR__ . '/../../config/connect-db.php';
require_once __DIR__ . '/../../queries/joins.php';

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

// Normalize the path (no query params)
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Log hit
error_log("MEMBERSHIP API HIT | Method=$method | URI=$uri");

// Extract dynamic groupID from router (if provided)
$groupID = $_GET['groupID'] ?? null;



// 1️) POST /api/groups/:groupID/join

if ($method === "POST" && preg_match("#/groups/(\d+)/join$#", $uri, $matches)) {
    $groupID = intval($matches[1]);
    error_log("JOIN GROUP route matched | groupID=$groupID");

    $body = json_decode(file_get_contents("php://input"), true);
    $userID = $body["computingID"] ?? null;

    if (!$userID) {
        error_log("Missing computingID in JOIN");
        http_response_code(400);
        echo json_encode(["error" => "computingID required"]);
        exit;
    }

    $result = db_join_group($userID, $groupID);
    error_log("JOIN status: " . json_encode($result));

    http_response_code($result["ok"] ? 200 : 409);
    echo json_encode($result);
    exit;
}



// 2️) POST /api/groups/:groupID/leave

if ($method === "POST" && preg_match("#/groups/(\d+)/leave$#", $uri, $matches)) {
    $groupID = intval($matches[1]);
    error_log("LEAVE GROUP route matched | groupID=$groupID");

    $body = json_decode(file_get_contents("php://input"), true);
    $userID = $body["computingID"] ?? null;

    if (!$userID) {
        error_log("Missing computingID in LEAVE");
        http_response_code(400);
        echo json_encode(["error" => "computingID required"]);
        exit;
    }

    $removed = db_leave_group($userID, $groupID);
    error_log("LEAVE removed count: $removed");

    echo json_encode(["removed" => $removed]);
    exit;
}



// 3️) GET /api/groups/:groupID/isMember

// 3️⃣ GET /api/groups/:groupID/isMember
if ($method === "GET" && preg_match("#/groups/(\d+)/isMember$#", $uri, $matches)) {
    $groupID = intval($matches[1]);
    error_log("IS MEMBER route | groupID=$groupID");

    // Allow either query param or body
    $body = json_decode(file_get_contents("php://input"), true) ?? [];
    $userID = $_GET["computingID"] 
           ?? ($body["computingID"] ?? null);

    if (!$userID) {
        error_log(" Missing computingID in ISMEMBER");
        http_response_code(400);
        echo json_encode(["error" => "computingID required"]);
        exit;
    }

    $isMember = db_is_member($userID, $groupID);
    error_log("isMember = $isMember");

    echo json_encode(["isMember" => $isMember]);
    exit;
}




// 4️) GET /api/users/:computingID/groups

if ($method === "GET" && preg_match("#/users/([^/]+)/groups$#", $uri, $matches)) {
    $userID = $matches[1];
    error_log("LIST MY GROUPS route | userID=$userID");

    $rows = db_my_groups($userID);
    error_log("myGroups count=" . count($rows));

    echo json_encode($rows);
    exit;
}



// Fallback: Route not recognized

error_log("Membership route not matched");
http_response_code(404);
echo json_encode(["error" => "Invalid membership route"]);
