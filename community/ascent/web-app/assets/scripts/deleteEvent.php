<?php
include 'dbConfig.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$catererId = $_POST['catererId'];
$eventId = $_POST['eventId'];
$response = array();
$flag = 1;

$conn->query("UPDATE `event` SET `deleteFlag` = '1' WHERE `eventId` = '$eventId' AND `catererId` = '$catererId'");
if(mysqli_error($conn)){
    //Error in deleting event
    $flag = 0;
    $response['message'] = "Error in deleting event";
} else {
    $response['message'] = "Event deleted successfully";
}

$response['flag'] = $flag;

echo json_encode($response);

$conn->close();
?>