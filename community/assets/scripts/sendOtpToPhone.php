<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$companyId = $_POST["companyId"];
$contactNo = $_POST["contactNo"];

$response = array();

$otp = rand(100000,999999);
$sql = "INSERT INTO `userOtp`(`otp`, `contactNo`) VALUES ('$otp', '$contactNo')";
$result = mysqli_query($conn, $sql);
$sql = "SELECT * FROM `subscriber` WHERE `contactNo` = '$contactNo' ";
$result = mysqli_query($conn, $sql);
$rowCount  = mysqli_num_rows($result);
if ($rowCount > 0){ 
    $sql = "SELECT * FROM `smsConfig` WHERE `companyId` = '$companyId' ";
    $result = mysqli_query($conn, $sql);
    $rowCount  = mysqli_affected_rows($conn);
    if ($rowCount > 0){ 
        $row = mysqli_fetch_assoc($result);
    	$request =""; //initialise the request variable
    	$param['method']= "sendMessage";
    	$param['send_to'] = "91".$contactNo;
    	$param['msg'] = "Hey there! Please use the OTP ".$otp." to verify your mobile and activate your Reminders profile";
    	$param['userid'] = $row['userId'];
    	$param['password'] = $row['password'];
    	$param['mask'] = "PYSAHI";
    	$param['v'] = "1.1";
    	$param['msg_type'] = "TEXT"; //Can be "FLASH”/"UNICODE_TEXT"/”BINARY”
    	$param['auth_scheme'] = "PLAIN";
    	//Have to URL encode the values
    	foreach($param as $key=>$val) {
    	    $request.= $key."=".urlencode($val);
    	    //we have to urlencode the values
    	    $request.= "&";
    	    //append the ampersand (&) sign after each parameter/value pair
    	}
    	$request = substr($request, 0, strlen($request)-1);
    	//remove final (&) sign from the request
    	$url = "http://ascent.msg4all.com/GatewayAPI/rest?".$request;
    	$ch = curl_init($url);
    	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    	$curl_scraped_page = curl_exec($ch);
    	curl_close($ch);
    	$response['flag'] = 1;
    } else { 
	    $response['flag'] = 0;
    }
} else { 
    $response['flag'] = 0;
}
echo json_encode($response);
mysqli_close($conn);
?>