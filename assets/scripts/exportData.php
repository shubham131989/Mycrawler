<?php
include 'dbConfig.php';

$query = "SELECT * FROM items_table";
if (!$result = mysqli_query($conn, $query)) {
    exit(mysqli_error($conn));
}
 
$users = array();
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $users[] = $row;
    }
}
 
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=Users.csv');
$output = fopen('php://output', 'w');
fputcsv($output, array('No', 'First Name', 'Last Name', 'Email'));
 
if (count($users) > 0) {
    foreach ($users as $row) {
        fputcsv($output, $row);
    }
}

?>