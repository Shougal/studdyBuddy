<?php
require_once __DIR__ . '/../../config/connect-db.php';
require_once __DIR__ . '/../../queries/course_offerings.php'; 

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents("php://input"), true);
error_log("OFFERINGS API HIT | Method: $method | Path: " . $_SERVER['REQUEST_URI']);

switch ($method) {

    // GET /api/offerings?termLike=Fall2025-
    case "GET":
        $termLike = $_GET['termLike'] ?? '%';
        error_log("➡ Request to LIST offerings | termLike = $termLike");

         try {
            $rows = db_list_offerings($termLike);
            error_log("✔ Offerings returned: " . count($rows));
            http_response_code(200);
            echo json_encode($rows);
        } catch (PDOException $e) {
            error_log("ERROR listing offerings: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(["error" => "Database error"]);
        }
        break;

    // POST /api/enroll
    // Body: { computingID, term, mnemonic }

    case "POST":
        error_log("➡ Request to ENROLL | Body = " . json_encode($body));

        if (!$body) {
            error_log("Invalid or missing JSON");
            http_response_code(400);
            echo json_encode(["error" => "Invalid JSON"]);
            exit;
        }

        $computingID = $body['computingID'] ?? null;
        $term = $body['term'] ?? null;
        $mnemonic = $body['mnemonic'] ?? null;

        if (!$computingID || !$term || !$mnemonic) {
            error_log("Missing field in enroll request");
            http_response_code(400);
            echo json_encode(["error" => "Missing required field"]);
            exit;
        }

        try {
            db_enroll($computingID, $term, $mnemonic);
            error_log("Enrollment success | $computingID => $mnemonic ($term)");
            http_response_code(201);
            echo json_encode(["ok" => true, "msg" => "Enrolled successfully"]);
        } catch (PDOException $e) {
            error_log("Enrollment failed: " . $e->getMessage());
            http_response_code(409);
            echo json_encode(["ok" => false, "error" => "Enrollment error"]);
        }
        break;


    default:
        error_log("Unsupported Method: $method");
        http_response_code(405);
        echo json_encode(["error" => "Method Not Allowed"]);
    }
