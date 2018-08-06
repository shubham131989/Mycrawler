<?php
include 'dbConfig.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$companyId = $_POST['companyId'];
$subscriberId = $_POST['subscriberId'];
$response = array();
$flag = 1;

$sql = "UPDATE `subscriber` SET `deleteFlag` = 1 WHERE `subscriberId` = '$subscriberId' AND `companyId` = '$companyId'";
$result = mysqli_query($conn, $sql);
if(mysqli_error($conn)){
    //Error in deleting subscriber
    $flag = 0;
    $response['message'] = "Error in deleting subscriber";
} else {
    $response['message'] = "Subscriber deleted successfully";
}

$response['flag'] = $flag;

echo json_encode($response);
mysqli_close($conn);
?>