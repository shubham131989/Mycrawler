<?php
include 'dbConfig.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$committeeMemberId = $_POST['committeeMemberId'];
$response = array();
$flag = 1;

$sql = "UPDATE `committeeMember` SET `deleteFlag` = 1 WHERE `committeeMemberId` = '$committeeMemberId'";
$result = mysqli_query($conn, $sql);
if(mysqli_error($conn)){
    //Error in deleting committeeMember
    $flag = 0;
    $response['message'] = "Error in deleting committeeMember";
} else {
    $response['message'] = "Committee Member deleted successfully";
}

$response['flag'] = $flag;

echo json_encode($response);
mysqli_close($conn);
?>