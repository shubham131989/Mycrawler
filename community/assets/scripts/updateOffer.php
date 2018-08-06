<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$companyId = $_POST['companyId'];
$_POST['offer'] = json_decode($_POST['offer'], true);
$offerId = $_POST['offer']['offerId'];
$offer = mysqli_real_escape_string($conn,$_POST['offer']['offer']);
$description = mysqli_real_escape_string($conn,$_POST['offer']['description']);
$startDate = strtr('Y123-Mm-Dd', 'Dd.Mm.Y123', $_POST['offer']['startDate']); //We haven't used date function here because date values separated by / are considered as mm/dd/yyyy
$startTime = date("H:i:s",strtotime($_POST['offer']['startTime']));
$endDate = strtr('Y123-Mm-Dd', 'Dd.Mm.Y123', $_POST['offer']['endDate']); //We haven't used date function here because date values separated by / are considered as mm/dd/yyyy
$endTime = date("H:i:s",strtotime($_POST['offer']['endTime']));
$response = array();
$flag = 0;

$sql = "UPDATE `offer` SET `offer`='$offer',`description`='$description', `startDate`='$startDate', `startTime`='$startTime', `endDate`='$endDate', `endTime`='$endTime' WHERE `offerId`='$offerId' AND `companyId`='$companyId'";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_affected_rows($conn);
if($rowCount == 1){
    $flag = 1;
}

//Check if file is present. If yes, upload it and update the image URL
if($_FILES['file']){
    $dir = "../img/offers/".basename($_FILES['file']['name']);
    $extn = strtolower(pathinfo($dir,PATHINFO_EXTENSION));
    $dir = "../img/offers/".$offerId.".".$extn;
    if(move_uploaded_file($_FILES['file']['tmp_name'], $dir)){
        //Update the directory name
        $imageUrl = "assets/img/offers/".$offerId.".".$extn;
        
        $conn->query("UPDATE `offer` SET `imageUrl` = '$imageUrl' WHERE `offerId` = '$offerId'");
    }
}


$response['flag'] = $flag;
$response['imageUrl'] = $imageUrl;

echo json_encode($response);
mysqli_close($conn);
?>