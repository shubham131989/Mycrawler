<?php
include 'dbConfig.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$companyId = $_POST['companyId'];
$notificationId = $_POST['notificationId'];
$response = array();
$flag = 1;

$sql = "UPDATE `notification` SET `deleteFlag` = 1 WHERE `notificationId` = '$notificationId' AND `companyId` = '$companyId' ";
$result = mysqli_query($conn, $sql);
if(mysqli_error($conn)){
    //Error in deleting Notification
    $flag = 0;
    $response['message'] = "Error in deleting Notification";
} else {
    $response['message'] = "Notification deleted successfully";
}

$response['flag'] = $flag;

echo json_encode($response);
mysqli_close($conn);
?>