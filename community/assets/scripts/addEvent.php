<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$companyId = $_POST['companyId'];
$venueId = $_POST['venueId'];
$eventName = mysqli_real_escape_string($conn,$_POST['event']['eventName']);
$description = mysqli_real_escape_string($conn,$_POST['event']['description']);
$startDate = strtr('Y123-Mm-Dd', 'Dd.Mm.Y123', $_POST['event']['startDate']); //We haven't used date function here because date values separated by / are considered as mm/dd/yyyy
$startTime = date("H:i:s",strtotime($_POST['event']['startTime']));
$endDate = strtr('Y123-Mm-Dd', 'Dd.Mm.Y123', $_POST['event']['endDate']); //We haven't used date function here because date values separated by / are considered as mm/dd/yyyy
$endTime = date("H:i:s",strtotime($_POST['event']['endTime']));
$rsvpStartDate = strtr('Y123-Mm-Dd', 'Dd.Mm.Y123', $_POST['event']['rsvpStartDate']); //We haven't used date function here because date values separated by / are considered as mm/dd/yyyy
$rsvpStartTime = date("H:i:s",strtotime($_POST['event']['rsvpStartTime']));
$rsvpEndDate = strtr('Y123-Mm-Dd', 'Dd.Mm.Y123', $_POST['event']['rsvpEndDate']); //We haven't used date function here because date values separated by / are considered as mm/dd/yyyy
$rsvpEndTime = date("H:i:s",strtotime($_POST['event']['rsvpEndTime']));

$response = array();
$flag = 1;

$sql = "INSERT INTO `event`(`companyId`, `venueId`, `eventName`, `description`, `startDate`, `startTime`, `endDate`, `endTime`, `rsvpStartDate`, `rsvpStartTime`, `rsvpEndDate`, `rsvpEndTime`) 
    VALUES ('$companyId', '$venueId', '$eventName', '$description', '$startDate', '$startTime', '$endDate', '$endTime', '$rsvpStartDate', '$rsvpStartTime', '$rsvpEndDate', '$rsvpEndTime')";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_affected_rows($conn);
if($rowCount == 1){
    $response['eventId'] = $eventId = mysqli_insert_id($conn);
        mkdir("../img/events/$eventId");
} else {
    $flag = 0;
    $response['message'] = mysqli_error($conn);
}

$response['flag'] = $flag;

echo json_encode($response);

$conn->close();
?>