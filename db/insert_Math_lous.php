<?php
require_once __DIR__ . '/../config/connect-db.php';

// open csv file
$csvFile = fopen(__DIR__ . '/../db/Mathematics1258Data.csv', 'r');

if (!$csvFile) {
    die("Error: Could not open CSV file at " . __DIR__ . '/../db/Mathematics1258Data.csv');
}


// Skip header row
fgetcsv($csvFile);


// insert into Course table
$insertCourse = $conn->prepare("
    INSERT IGNORE INTO Course (mnemonic_num, name) VALUES (?,?)
"
);

// insert into Course_Offerings table
$insertCourseOffering = $conn->prepare("
INSERT IGNORE INTO Course_Offerings (term, mnemonic_num) VALUES (?,?)
"
);

$term = "Fall2025"; //fixed term

while(($row=fgetcsv($csvFile))!== false){
    // trim the columns needed from csv file
    $mnemonic = trim($row[1]);
    $number = trim($row[2]);
    $title = trim($row[9]);

    if (!$mnemonic || !$number || !$title) continue; // skip invalid rows

    $mnemonic_num = $mnemonic . $number; //concatenating here to fit our schema structure

    // insert into courses
    $insertCourse -> execute([$mnemonic_num, $title]);

    //insert into Fall2025 course offerings
    $insertCourseOffering->execute([$term, $mnemonic_num]);



}

fclose($csvFile);
echo "Math data imported!"
?>