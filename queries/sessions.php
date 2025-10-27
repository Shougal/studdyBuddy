<?php
/*
* One-and-only session per group 
* Triggers enfoce no room overlap and time Check ensures end>start 
*/

require_once __DIR__ . '/../config/connect-db.php';


/**
 * Create the session for a group 
 * 
 * @ return array status 
 * ['ok' if true] or ['ok' -> false, 'error' -> message] if triggers/Fks fail  
 * 
 */
function db_create_session(int $groupID, string $date, string $start, string $end, string $building, string $room): array {
  global $db;
  try {
    $sql = "INSERT INTO Session(date, start_time, end_time, building, room_number, groupID)
            VALUES (?, ?, ?, ?, ?, ?)";
    $db->prepare($sql)->execute([$date, $start, $end, $building, $room, $groupID]);
    return ['ok' => true];
  } catch (PDOException $e) {
    return ['ok' => false, 'error' => $e->getMessage()]; // trigger/FK message
  }
}

/*
 * Resechule the session for a group 
 * 
 * Note: overlap trigger still applies on update
 */
function db_reschedule_session(int $groupID, string $date, string $start, string $end, string $building, string $room): array {
  global $db;
  try {
    $sql = "UPDATE Session
            SET date = ?, start_time = ?, end_time = ?, building = ?, room_number = ?
            WHERE groupID = ?";
    $db->prepare($sql)->execute([$date, $start, $end, $building, $room, $groupID]);
    return ['ok' => true];
  } catch (PDOException $e) {
    return ['ok' => false, 'error' => $e->getMessage()];
  }
}

/*
 * Fetch a group's session details 
 * 
 * @return ?array or null if no session yet
 */
function db_get_session_by_group(int $groupID): ?array {
  global $db;
  $st = $db->prepare("SELECT date, start_time, end_time, building, room_number FROM Session WHERE groupID = ?");
  $st->execute([$groupID]);
  $row = $st->fetch();
  return $row ?: null;
}