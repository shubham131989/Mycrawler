<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$token = $_POST['token'];
$subscriberId = $_POST['subscriberId'];

$response = array();
$flag = 1;

$sql = "INSERT INTO `userDevice`(`token`) VALUES ($token) ";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_affected_rows($conn);
if($rowCount > 0){
    $response['userDeviceId'] = $userDeviceId = mysqli_insert_id($conn);
    $sql = "INSERT INTO `subscriberToken`(`subscriberId`, `userDeviceId`) VALUES ($subscriberId, $userDeviceId) ";
    $result = mysqli_query($conn, $sql);
    $rowCount = mysqli_affected_rows($conn);
    if($rowCount > 0){
        $subscriberTokenId = mysqli_insert_id($conn);
    } else {
        $flag = 0;
        $response['message'] = mysqli_error($conn);
    }
} else {
    $flag = 0;
    $response['message'] = mysqli_error($conn);
}

$response['flag'] = $flag;

echo json_encode($response);

mysqli_close($conn);
?>