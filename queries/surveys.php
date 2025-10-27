<?php
/*
 * Lightweight survey: active questions, submit response (upsert), aggregates
 * 
 * Tables: Survey_questions, survey_feedback
 */
require_once __DIR__ . '/../config/connect-db.php';

/*
 * List active survey questions
 * 
 * @return array rows of {questionID, question, type_is}
 */
function db_list_active_questions(): array {
  global $db;
  $sql = "SELECT questionID, question, type_is
          FROM Survey_Questions
          WHERE is_active = TRUE
          ORDER BY questionID";
  return $db->query($sql)->fetchAll();
}

/*
 * Create/update a user's response 
 * 
 * @return void 
 */
function db_submit_feedback(int $questionID, string $computingID, int $groupID, string $response): void {
  global $db;
  $sql = "INSERT INTO Survey_Feedback(questionID, computingID, groupID, response)
          VALUES (?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE response = VALUES(response)";
  $db->prepare($sql)->execute([$questionID, $computingID, $groupID, $response]);
}

/*
 * Aggregate responses per question for a specific group 
 * 
 * @return array rows {questionID, question, responses}
 */
function db_feedback_summary(int $groupID): array {
  global $db;
  $sql = "SELECT q.questionID, q.question, COUNT(f.response) AS responses
          FROM Survey_Questions q
          LEFT JOIN Survey_Feedback f
            ON f.questionID = q.questionID AND f.groupID = ?
          GROUP BY q.questionID
          ORDER BY q.questionID";
  $st = $db->prepare($sql);
  $st->execute([$groupID]);
  return $st->fetchAll();
}