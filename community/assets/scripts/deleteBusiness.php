<?php
include 'dbConfig.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$businessId = $_POST['businessId'];
$response = array();
$flag = 1;

$sql = "UPDATE `business` SET `deleteFlag` = 1 WHERE `businessId` = '$businessId'";
$result = mysqli_query($conn, $sql);
if(mysqli_error($conn)){
    //Error in deleting Business
    $flag = 0;
    $response['message'] = "Error in deleting Business";
} else {
    $response['message'] = "Business deleted successfully";
}

$response['flag'] = $flag;

echo json_encode($response);
mysqli_close($conn);
?>