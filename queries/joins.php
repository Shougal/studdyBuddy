<?php
/**
 * Membership acctions. 
 * 
 * Tables: Joins (+joins to studygroup/course/session for reads)
 */
require_once __DIR__ . '/../config/connect-db.php';

/*
 * Join a group (adds one row to Joins)
 *  
 * Returns user-friendly status
 */
function db_join_group(string $computingID, int $groupID): array {
  global $db;
  try {
    $db->prepare("INSERT INTO Joins(computingID, groupID) VALUES (?, ?)")
       ->execute([$computingID, $groupID]);
    return ['ok' => true, 'msg' => 'Joined'];
  } catch (PDOException $e) {
    return ['ok' => false, 'msg' => $e->getMessage()]; // trigger error bubbles up
  }
}

/*
 * Leave a group (remove membership)
 * 
 * @return int number of rows deleted (0 means not a member)
 */
function db_leave_group(string $computingID, int $groupID): int {
  global $db;
  $st = $db->prepare("DELETE FROM Joins WHERE computingID = ? AND groupID = ?");
  $st->execute([$computingID, $groupID]);
  return $st->rowCount();
}

/*
 * Check if user's already a member 
 * 
 * @return bool
 */
function db_is_member(string $computingID, int $groupID): bool {
  global $db;
  $st = $db->prepare("SELECT 1 FROM Joins WHERE computingID = ? AND groupID = ?");
  $st->execute([$computingID, $groupID]);
  return (bool)$st->fetchColumn();
}

/*
 * List all groups a user belongs to, including session info 
 * 
 * @return array rows per membership
 */
function db_my_groups(string $computingID): array {
  global $db;
  $sql = "SELECT g.groupID, c.mnemonic_num, c.name AS course_name,
                 s.date, s.start_time, s.end_time, s.building, s.room_number,
                 g.description
          FROM Joins j
          JOIN StudyGroup g ON g.groupID = j.groupID
          JOIN Course c     ON c.mnemonic_num = g.mnemonic_num
          LEFT JOIN Session s ON s.groupID = g.groupID
          WHERE j.computingID = ?
          ORDER BY s.date, s.start_time";
  $st = $db->prepare($sql);
  $st->execute([$computingID]);
  return $st->fetchAll();
}