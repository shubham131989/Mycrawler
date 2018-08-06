<?php
include 'dbConfig.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$offerId = $_POST['offerId'];
$response = array();
$flag = 1;

$sql = "UPDATE `offer` SET `deleteFlag` = 1 WHERE `offerId` = '$offerId'";
$result = mysqli_query($conn, $sql);
if(mysqli_error($conn)){
    //Error in deleting offer
    $flag = 0;
    $response['message'] = "Error in deleting offer.";
} else {
    $response['message'] = "Offer deleted successfully.";
}

$response['flag'] = $flag;

echo json_encode($response);
mysqli_close($conn);
?>