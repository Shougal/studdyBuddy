<?php
// queries/users.php
require_once __DIR__ . '/../config/connect-db.php';


/**
 * Create a new user accoutn 
 * 
 * Usage: 
 * db_create_user('abcd2', 'Anna Will', 3, 'secret123')
 */
function db_create_user(string $computingID, string $name, ?int $year, string $plain_pw): void {
  global $db;
  $hash = password_hash($plain_pw, PASSWORD_DEFAULT);
  $sql = "INSERT INTO `User`(computingID, name, year, password_hash) VALUES (?, ?, ?, ?)";
  $db->prepare($sql)->execute([$computingID, $name, $year, $hash]);
}

/**
 * Get the password hash for login verification 
 * 
 * @returun ?string null if user not found; otherwise hash 
 * 
 * Usage: 
 * $hash = db_get_password_hash($id)
 * if ($hash && password_verify($pw, $hash)) {...}
 */
function db_get_password_hash(string $computingID): ?string {
  global $db;
  $sql = "SELECT password_hash FROM `User` WHERE computingID = ?";
  $st  = $db->prepare($sql);
  $st->execute([$computingID]);
  $row = $st->fetch();
  return $row['password_hash'] ?? null;
}

/**
* Fetch a public profile snapshot 
* @returun ?array['computingID =>,..., 'name'=>..., 'year'=>...] or null
*/
function db_get_user(string $computingID): ?array {
  global $db;
  $st = $db->prepare("SELECT computingID, name, year FROM `User` WHERE computingID = ?");
  $st->execute([$computingID]);
  $row = $st->fetch();
  return $row ?: null;
}