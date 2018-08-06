<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$eventId = $_POST['eventId'];
$subscriberDetails = $_POST['subscriberDetails'];

$response = array();
$flag = 1;

foreach ($subscriberDetails as $value) {
    if($value[rsvp] != null){
    	$sql = "INSERT INTO `eventRsvp`(`eventId`, `subscriberId`, `rsvp`) VALUES ('$eventId', $value[subscriberId], $value[rsvp]) ON DUPLICATE KEY UPDATE `rsvp` = $value[rsvp]";
    	$result = mysqli_query($conn,$sql);
    	if(mysqli_error($conn)){
    	    //Error occured
    	    $flag = 0;
    	    $response['message'] = mysqli_error($conn);
    	}
    }
}
unset($value);

$response['flag'] = $flag;
echo json_encode($response);

mysqli_close($conn);
?>