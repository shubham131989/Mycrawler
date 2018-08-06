<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$feedbackId = $_POST['feedbackId'];
$response = array();
$flag = 1;

$sql = "UPDATE `feedback` SET `isApproved`= !`isApproved` WHERE `feedbackId` = '$feedbackId'";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_affected_rows($conn);
if(mysqli_error($conn) ){
    $response['message'] = mysqli_error($conn);
    $flag = 0;
}

$response['flag'] = $flag;

echo json_encode($response);
mysqli_close($conn);
?>