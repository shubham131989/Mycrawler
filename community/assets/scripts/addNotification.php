<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$companyId = $_POST['companyId'];
$_POST['notification'] = json_decode($_POST['notification'], true);
$notification = mysqli_real_escape_string($conn,$_POST['notification']['notification']);
$description = mysqli_real_escape_string($conn,$_POST['notification']['description']);
$pushDate = strtr('Y123-Mm-Dd', 'Dd.Mm.Y123', $_POST['notification']['pushDate']); //We haven't used date function here because date values separated by / are considered as mm/dd/yyyy
$pushTime = date("H:i:s",strtotime($_POST['notification']['pushTime']));

$response = array();
$flag = 1;

$sql = "INSERT INTO `notification`(`companyId`, `notification`, `description`, `pushDate`, `pushTime`) 
    VALUES ('$companyId', '$notification', '$description', '$pushDate', '$pushTime')";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_affected_rows($conn);
if($rowCount > 0){
    $response['notificationId'] = $notificationId = mysqli_insert_id($conn);
} else {
    $flag = 0;
}

//Check if file is present. If yes, upload it and update the image URL
if($_FILES['file']){
    $dir = "../img/notificationImages/".basename($_FILES['file']['name']);
    $extn = strtolower(pathinfo($dir,PATHINFO_EXTENSION));
    $dir = "../img/notificationImages/".$notificationId.".".$extn;
    if(move_uploaded_file($_FILES['file']['tmp_name'], $dir)){
        //Update the directory name
        $imageUrl = "assets/img/notificationImages/".$notificationId.".".$extn;
        
        $conn->query("UPDATE `notification` SET `imageUrl` = '$imageUrl' WHERE `notificationId` = '$notificationId'");
    }
}

$response['flag'] = $flag;
$response['imageUrl'] = $imageUrl;

echo json_encode($response);
mysqli_close($conn);
?>