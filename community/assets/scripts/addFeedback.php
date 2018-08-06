<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$eventId = $_POST['eventId'];
$subscriberId = $_POST['subscriberId'];
$feedback = $_POST['feedback'];

$response = array();
$flag = 1;

$sql = "INSERT INTO `feedback`(`eventId`, `subscriberId`, `feedback`) VALUES ('$eventId', '$subscriberId', '$feedback') ";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_affected_rows($conn);
if($rowCount > 0){
    $response['feedbackId'] = mysqli_insert_id($conn);
} else {
    $flag = 0;
    $response['message'] = "addFeedback failed.";
}

$response['flag'] = $flag;

echo json_encode($response);

mysqli_close($conn);
?>