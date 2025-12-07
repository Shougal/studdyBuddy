<?php
error_log("Survey: SUBMIT FEEDBACK");

require_once __DIR__ . '/../../../queries/surveys.php';

$body = json_decode(file_get_contents("php://input"), true);

if (!$body ||
    !isset($body["questionID"]) ||
    !isset($body["computingID"]) ||
    !isset($body["groupID"]) ||
    !isset($body["response"])) {

    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

db_submit_feedback(
    (int)$body["questionID"],
    $body["computingID"],
    (int)$body["groupID"],
    $body["response"]
);

http_response_code(200);
echo json_encode(["ok" => true, "msg" => "Feedback saved"]);
