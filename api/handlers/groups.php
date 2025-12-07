<?php
require_once __DIR__ . '/../../config/connect-db.php';
require_once __DIR__ . '/../../queries/groups.php'; // db_search_groups, db_create_group, db_get_group, etc.

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents("php://input"), true);

error_log("GROUP API HIT | Method: $method | Path: " . $_SERVER['REQUEST_URI']);

// Extract dynamic ID if exists
$pathParts = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
$maybeID = end($pathParts);
$groupID = is_numeric($maybeID) ? intval($maybeID) : null;

switch ($method) {


    // GET /api/groups (Search/Browse)
    // GET /api/groups/:groupID (Details)

    case "GET":
        if ($groupID !== null) {
            error_log("Request Group details | groupID=$groupID");
            $row = db_get_group($groupID);

            if (!$row) {
                error_log("Group not found");
                http_response_code(404);
                echo json_encode(["error" => "Group not found"]);
                exit;
            }

            http_response_code(200);
            echo json_encode($row);
            exit;
        }

        // Search view
        $q = $_GET['q'] ?? '';
        $termLike = $_GET['termLike'] ?? '%';
        $limit = intval($_GET['limit'] ?? 25);
        $offset = intval($_GET['offset'] ?? 0);

        error_log("Search Groups | q=$q | termLike=$termLike | limit=$limit | offset=$offset");
        $rows = db_search_groups($q, $termLike, $limit, $offset);
        http_response_code(200);
        echo json_encode($rows);
        exit;



    // POST /api/groups  (Create)
    case "POST":
        error_log("Create group | Payload=" . json_encode($body));

        $ownerID = $body['ownerID'] ?? null;
        $term = $body['term'] ?? null;
        $mnemonic = $body['mnemonic'] ?? null;
        $desc = $body['description'] ?? null;

        if (!$ownerID || !$term || !$mnemonic) {
            http_response_code(400);
            echo json_encode(["error" => "Missing required field"]);
            exit;
        }

        try {
            $newGroupID = db_create_group($ownerID, $term, $mnemonic, $desc);
            error_log("Group created | groupID=$newGroupID");
            http_response_code(201);
            echo json_encode(["ok" => true, "groupID" => $newGroupID]);
        } catch (PDOException $e) {
            error_log("Group create failed: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(["error" => "Database error"]);
        }
        exit;



    // PATCH /api/groups/:groupID (Update description)
    case "PATCH":
        if (!$groupID) break;

        $ownerID = $body['ownerID'] ?? null;
        $desc = $body['description'] ?? null;
        if (!$ownerID) {
            http_response_code(400);
            echo json_encode(["error" => "ownerID required"]);
            exit;
        }

        $rows = db_update_group_description($groupID, $ownerID, $desc);

        if ($rows === 0) {
            http_response_code(403);
            echo json_encode(["error" => "Not owner or no update"]);
            exit;
        }

        http_response_code(200);
        echo json_encode(["ok" => true, "msg" => "Description updated"]);
        exit;



    // DELETE /api/groups/:groupID (Owner-only delete)
    case "DELETE":
        if (!$groupID) break;

        $ownerID = $body['ownerID'] ?? null;
        if (!$ownerID) {
            http_response_code(400);
            echo json_encode(["error" => "ownerID required"]);
            exit;
        }

        $rows = db_delete_group($groupID, $ownerID);

        if ($rows === 0) {
            http_response_code(403);
            echo json_encode(["error" => "Not owner or not found"]);
            exit;
        }

        http_response_code(200);
        echo json_encode(["ok" => true, "msg" => "Group deleted"]);
        exit;
}


// Anything else
error_log("Unsupported Method or bad path");
http_response_code(405);
echo json_encode(["error" => "Method Not Allowed"]);
