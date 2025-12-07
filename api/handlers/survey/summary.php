<?php
error_log("Survey: SUMMARY FOR GROUP $groupID");

require_once __DIR__ . '/../../../queries/surveys.php';

$rows = db_feedback_summary($groupID);
http_response_code(200);
echo json_encode($rows);
