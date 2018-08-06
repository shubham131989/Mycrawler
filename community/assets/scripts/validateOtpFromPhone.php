<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$companyId = $_POST['companyId'];
$contactNo = $_POST['userOtp']['contactNo'];
$otp = $_POST['userOtp']['otp'];

$response = array();

$sql = "SELECT `userOtpId`, MINUTE(TIMEDIFF(NOW(),`timestamp`)) AS `timeDiff` FROM `userOtp` WHERE `userOtpId` = (SELECT MAX(`userOtpId`) FROM `userOtp` WHERE `contactNo` = '$contactNo') AND `otp` = '$otp' AND `isVerified` = 0" ;
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_num_rows($result);
if($rowCount == 1){		//If entered OTP and Contact No. COMPOSITE KEY is present in the table and Not Verified Already
	$row = mysqli_fetch_assoc($result);
	$userOtpId = $row['userOtpId'];
	$timeDiff = $row['timeDiff'];
	if($timeDiff < 10){		//Check whether 10 minutes have elapsed

		$sql = "UPDATE `userOtp` SET `isVerified` = '1' WHERE `userOtpId` = '$userOtpId'";
		$result = mysqli_query($conn, $sql);
		$message = "OTP verified successfully";
		$flag = 1;
		$sql = "SELECT `subscriberId` FROM `subscriber` WHERE `contactNo` = '$contactNo'";
		$result = mysqli_query($conn, $sql);
		$row = mysqli_fetch_assoc($result);
		$subscriberId = $row['subscriberId'];
	}
	else {	
		$message = "OTP has expired";
		$flag = 0;
	}
}
else {
	$message = "The OTP you have entered is incorrect. Please try again";
	$flag = 0;
}

$response['flag'] = $flag;
$response['message'] = $message;
$response['subscriberId'] = $subscriberId;

echo json_encode($response);
mysqli_close($conn);
?>