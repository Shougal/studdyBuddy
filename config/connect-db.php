<?php

// This is the information for our local DB, uncomment if testing locally through XAMPP
$host = 'localhost';
$port = '3307'; // local host XAMPP port. P.S: you might need to change to default 3306, since I changed mine to 3307
$dbname = 'studdyBuddy';
$username = 'root';
$password = '';

// Connecting to UVA DB server
// $host = "mysql01.cs.virginia.edu";
// $dbname = "xdq9qa";  
// $username = "xdq9qa";
// $password = "Fall2025";

try {
    $conn = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "Connected successfully to the database!";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>


