<?php
include 'dbConfig.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$emailId = $_POST['emailId'];
$otp = $_POST['otp'];
$response = array();

$otpQuery = $conn->query("SELECT * FROM userOtp WHERE `emailId` = '$emailId' AND `otp` = '$otp' AND `userOtpId` = (SELECT MAX(userOtpId) FROM userOtp WHERE emailId = '$emailId')");
if($otpQuery->num_rows > 0){
    //OTP validation successful
    $response['flag'] = 1;
    $response['message'] = "Verification successful";
    
    $otpRow = $otpQuery->fetch_assoc();
    $userOtpId = $otpRow['userOtpId'];
    
    $conn->query("UPDATE `userOtp` SET verified = '1' WHERE `userOtpId` = '$userOtpId'");
    
    $userQuery = $conn->query("SELECT * FROM user WHERE `emailId` = '$emailId'");
    if($userQuery->num_rows > 0){
        $userRow = $userQuery->fetch_assoc();
        $response['userId'] = $userRow['userId'];
    }
} else {
    $response['flag'] = 0;
    $response['message'] = "Incorrect OTP entered";
}

echo json_encode($response);

$conn->close();
?>