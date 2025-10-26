<?php
//Because of require_once, $conn becomes defined in the current file’s scope
require_once __DIR__ . '/../config/connect-db.php';  // connect to the db

//creating tables once
$sqlFile = __DIR__ . '/create_tables.sql';

$sqlCommands = file_get_contents($sqlFile);

// initial insertions
$insertFile = __DIR__ . '/insert_data.sql';

//try to execute commands
try{
    $conn->exec($sqlCommands); // not using prepare since file is static and trusted
    echo "SQL file to insert tables executed successfully!";
}catch(PDOException $e){
    echo "error accepting sql file to create tables: ".$e->getMessage();
}

// try executing initial insertions queries
try {
    $insertSQL = file_get_contents($insertFile);
    $conn->exec($insertSQL);
    echo "Data inserted successfully!<br>";
} catch (PDOException $e) {
    echo "Error inserting data: " . $e->getMessage() . "<br>";
}





?>