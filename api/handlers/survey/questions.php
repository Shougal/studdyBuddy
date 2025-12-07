<?php
error_log("Survey: LIST QUESTIONS");

require_once __DIR__ . '/../../../queries/surveys.php';

$rows = db_list_active_questions();
http_response_code(200);
echo json_encode($rows);
