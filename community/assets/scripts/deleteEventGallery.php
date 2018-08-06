<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$eventId = $_POST['eventId'];
$eventGalleryId = $_POST['eventGalleryId'];
$fileName = $_POST['fileName'];

$response = array();
$flag = 0;

array_push($response, $_POST);

$path = "../img/events/$eventId/$fileName";

if (file_exists($path)){
    chmod($path, 0777);
    if (unlink($path)) {
        $sql = "DELETE FROM `eventGallery` WHERE `eventGalleryId` = '$eventGalleryId' ";
        $result = mysqli_query($conn, $sql);  
        if(!mysqli_error($conn)){
            $flag = 1;
    	    $message = "Deletion successful";
    	} else{
    	    $message = "Deletion from table failed";
    	}
    } else {
        $message = "Unlinking failed.";
    }   
} else {
    $message = "File does not exist";
}

$response['flag'] = $flag;
$response['message'] = $message;

echo json_encode($response);
mysqli_close($conn);
?>