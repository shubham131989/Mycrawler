<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$companyId = $_POST['companyId'];
$_POST['subscriber'] = json_decode($_POST['subscriber'], true);
$subscriberId = $_POST['subscriber']['subscriberId'];
$parentId = $_POST['subscriber']['parentId'];
$spouseId = $_POST['subscriber']['spouseId'];
$subscriberName = mysqli_real_escape_string($conn,$_POST['subscriber']['subscriberName']);
$contactNo = $_POST['subscriber']['contactNo'];
$emailId = $_POST['subscriber']['emailId'];
$membershipId = $_POST['subscriber']['membershipId'];
$imageUrl = '';
$gender = $_POST['subscriber']['gender'];
$maritalStatusId = $_POST['subscriber']['maritalStatusId'];
$dob = strtr('Y123-Mm-Dd', 'Dd.Mm.Y123', $_POST['subscriber']['dob']); //We haven't used date function here because date values separated by / are considered as mm/dd/yyyy
$dom = strtr('Y123-Mm-Dd', 'Dd.Mm.Y123', $_POST['subscriber']['dom']); //We haven't used date function here because date values separated by / are considered as mm/dd/yyyy
$dod = strtr('Y123-Mm-Dd', 'Dd.Mm.Y123', $_POST['subscriber']['dod']); //We haven't used date function here because date values separated by / are considered as mm/dd/yyyy
$educationId = $_POST['subscriber']['educationId'];
$degreeId = $_POST['subscriber']['degreeId'];
$isAlive = $_POST['subscriber']['isAlive'];

$response = array();
$flag = 1;

$sql = "UPDATE `subscriber` SET `parentId`='$parentId', `spouseId`='$spouseId', `subscriberName`='$subscriberName', `contactNo`='$contactNo', `emailId`='$emailId', `emailId`='$emailId', `membershipId`='$membershipId', `gender`='$gender', `maritalStatusId`='$maritalStatusId', `dob`='$dob', `dom`='$dom', `dod`='$dod', `educationId`='$educationId', `degreeId`='$degreeId', `isAlive`='$isAlive' WHERE `subscriberId` = '$subscriberId' AND `companyId` = '$companyId'";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_affected_rows($conn);
if(mysqli_error($conn)){
    $response['message'] = mysqli_error($conn);
    $flag = 0;
}

//Check if file is present. If yes, upload it and update the image URL
if($_FILES['file']){
    $dir = "../img/subscribers/".basename($_FILES['file']['name']);
    $extn = strtolower(pathinfo($dir,PATHINFO_EXTENSION));
    $dir = "../img/subscribers/".$subscriberId.".".$extn;
    if(move_uploaded_file($_FILES['file']['tmp_name'], $dir)){
        //Update the directory name
        $imageUrl = "assets/img/subscribers/".$subscriberId.".".$extn;
        
        $conn->query("UPDATE `subscriber` SET `imageUrl` = '$imageUrl' WHERE `subscriberId` = '$subscriberId'");
    }
}

$response['flag'] = $flag;
$response['imageUrl'] = $imageUrl;

echo json_encode($response);
mysqli_close($conn);
?>