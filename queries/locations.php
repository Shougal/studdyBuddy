<?php
/*
 * Room managment and availability for scheduling 
 * Tables: Location, Session (for overlap checks)
 */
require_once __DIR__ . '/../config/connect-db.php';

/*
 * Create a location (building+room with capacity)
 */
function db_create_location(string $building, string $room, int $capacity): void {
  global $db;
  $sql = "INSERT INTO Location(building, room_number, capacity) VALUES (?, ?, ?)";
  $db->prepare($sql)->execute([$building, $room, $capacity]);
}

/*
 * Find rooms free for a given date/time window
 * 
 * @return array list of available rooms with capacity
 */
function db_find_free_rooms(string $date, string $start, string $end): array {
  global $db;
  $sql = "SELECT l.building, l.room_number, l.capacity
          FROM Location l
          WHERE NOT EXISTS (
            SELECT 1
            FROM Session s
            WHERE s.building = l.building
              AND s.room_number = l.room_number
              AND s.date = ?
              AND ? < s.end_time
              AND ? > s.start_time
          )
          ORDER BY l.capacity DESC, l.building, l.room_number";
  $st = $db->prepare($sql);
  $st->execute([$date, $start, $end]);
  return $st->fetchAll();
}