<?php
include 'dbConfig.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$catererId = $_POST['catererId'];
$venueId = $_POST['venueId'];
$response = array();
$flag = 1;

$conn->query("UPDATE `venue` SET `deleteFlag` = '1' WHERE `venueId` = '$venueId' AND `catererId` = '$catererId'");
if(mysqli_error($conn)){
    //Error in deleting venue
    $flag = 0;
    $response['message'] = "Error in deleting venue";
} else {
    $response['message'] = "Venue deleted successfully";
}

$response['flag'] = $flag;

echo json_encode($response);

$conn->close();
?>