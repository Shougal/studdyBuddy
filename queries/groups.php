<?php
/*
 *Study group creation, lookup, search, and owner edits 
 */
require_once __DIR__ . '/../config/connect-db.php';

/*
 *Create a study group row (session is created separately)
 * @return int new groupID 
 */
function db_create_group(string $ownerID, string $term, string $mnemonic, ?string $desc): int {
  global $conn;
  $sql = "INSERT INTO StudyGroup(owner_computingID, term, mnemonic_num, description)
          VALUES (?, ?, ?, ?)";
  $conn->prepare($sql)->execute([$ownerID, $term, $mnemonic, $desc]);
  return (int)$conn->lastInsertId();
}

/*
 * Get  greoup details + owner name + session info + member count
 * @return ?array associative row or null if not found  
 */

function db_get_group(int $groupID): ?array {
  global $conn;
  $sql = "SELECT g.groupID, g.description, g.term, g.mnemonic_num,
                 u.name AS owner_name,
                 s.date, s.start_time, s.end_time, s.building, s.room_number,
                 (SELECT COUNT(*) FROM Joins jj WHERE jj.groupID = g.groupID) AS members
          FROM StudyGroup g
          JOIN `User` u  ON u.computingID = g.owner_computingID
          LEFT JOIN `Session` s ON s.groupID = g.groupID
          WHERE g.groupID = ?";
  $st = $conn->prepare($sql);
  $st->execute([$groupID]);
  $row = $st->fetch();
  return $row ?: null;
}
/*
 * Search/browse groups with owner, session, and member count
 * 
 * @param string $q - free text(matches course mnemonic or description )
 * @praam string $termLike filter by term
 * @param int    $limit page dize 
 * @param int    $offset page offset 
 * @return arrays rows per group 
 */
function db_search_groups(string $q =  '', string $termLike = '%', int $limit = 25, int $offset = 0): array {
  global $conn;
  $like = "%{$q}%";
  $sql = "SELECT g.groupID, c.mnemonic_num, c.name AS course_name,
                 g.description,
                 s.date, s.start_time, s.end_time, s.building, s.room_number,
                 u.name AS owner_name,
                 COUNT(j.computingID) AS members
          FROM StudyGroup g
          JOIN Course c ON c.mnemonic_num = g.mnemonic_num
          JOIN `User` u ON u.computingID = g.owner_computingID
          LEFT JOIN `Session` s ON s.groupID = g.groupID
          LEFT JOIN Joins j   ON j.groupID = g.groupID
          WHERE g.term LIKE ?
            AND (c.mnemonic_num LIKE ? OR g.description LIKE ?)
          GROUP BY g.groupID
          ORDER BY s.date IS NULL, s.date, s.start_time
          LIMIT ? OFFSET ?";
  $st = $conn->prepare($sql);
  $st->execute([$termLike, $like, $like, $limit, $offset]);
  return $st->fetchAll();
}
/*
 * Owner-only edit of group description  
 * 
 * @return int affected rows (0 means not owner or change)
 */

function db_update_group_description(int $groupID, string $ownerID, ?string $desc): int {
  global $conn;
  $sql = "UPDATE StudyGroup SET description = ? WHERE groupID = ? AND owner_computingID = ?";
  $st  = $conn->prepare($sql);
  $st->execute([$desc, $groupID, $ownerID]);
  return $st->rowCount();
}

/*
 * Delete a group you own.
 * 
 * @return int affect rows (0 means not owner or not found)
 */
function db_delete_group(int $groupID, string $ownerID): int {
  global $conn;
  $sql = "DELETE FROM StudyGroup WHERE groupID = ? AND owner_computingID = ?";
  $st  = $conn->prepare($sql);
  $st->execute([$groupID, $ownerID]);
  return $st->rowCount();
}