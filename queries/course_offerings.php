<?php
/*
 * Read views around Course + Course_Offeerings and enrollment actions 
 */
require_once __DIR__ . '/../config/connect-db.php';

/*
 * List course cofferings for a term (supports LIKE)
 * 
 * @param string $termLike 'Fall2025' '%25%'
 * @return array row of {term, mnemonic_num, name}
 * 
 */

function db_list_offerings(string $termLike = '%'): array {
  global $db;
  $sql = "SELECT co.term, c.mnemonic_num, c.name
          FROM Course_Offerings co
          JOIN Course c ON c.mnemonic_num = co.mnemonic_num
          WHERE co.term LIKE ?
          ORDER BY co.term DESC, c.mnemonic_num";
  $st = $db->prepare($sql);
  $st->execute([$termLike]);
  return $st->fetchAll();
}
/*
 * Enroll a user in a specific course offering
 * 
 * @return void (FKs/PK will raise if invalid or duplicate) 
 */
function db_enroll(string $computingID, string $term, string $mnemonic): void {
  global $db;
  $sql = "INSERT INTO Enrollment(computingID, term, mnemonic_num) VALUES (?, ?, ?)";
  $db->prepare($sql)->execute([$computingID, $term, $mnemonic]);
}