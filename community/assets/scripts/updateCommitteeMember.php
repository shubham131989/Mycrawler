<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$companyId = $_POST['companyId'];
$_POST['committeeMember'] = json_decode($_POST['committeeMember'], true);
$committeeMemberId = $_POST['committeeMember']['committeeMemberId'];
$memberName = mysqli_real_escape_string($conn,$_POST['committeeMember']['memberName']);
$contactNo = $_POST['committeeMember']['contactNo'];
$whatsapp = $_POST['committeeMember']['whatsapp'];
$emailId = $_POST['committeeMember']['emailId'];
$position = $_POST['committeeMember']['position'];
$description = mysqli_real_escape_string($conn,$_POST['committeeMember']['description']);

$response = array();
$flag = 1;

$sql = "UPDATE `committeeMember` SET `companyId`='$companyId',`memberName`='$memberName',`contactNo`='$contactNo',`whatsapp`='$whatsapp',`emailId`='$emailId',`position`='$position',`description`='$description' WHERE `committeeMemberId` = '$committeeMemberId'";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_affected_rows($conn);
if(mysqli_error($conn)){
    $flag = 0;
}

//Check if file is present. If yes, upload it and update the image URL
if($_FILES['file']){
    $dir = "../img/committeeMembers/".basename($_FILES['file']['name']);
    $extn = strtolower(pathinfo($dir,PATHINFO_EXTENSION));
    $dir = "../img/committeeMembers/".$committeeMemberId.".".$extn;
    if(move_uploaded_file($_FILES['file']['tmp_name'], $dir)){
        //Update the directory name
        $imageUrl = "assets/img/committeeMembers/".$committeeMemberId.".".$extn;
        
        $conn->query("UPDATE `committeeMember` SET `imageUrl` = '$imageUrl' WHERE `committeeMemberId` = '$committeeMemberId'");
    }
}

$response['flag'] = $flag;
$response['imageUrl'] = $imageUrl;

echo json_encode($response);
mysqli_close($conn);
?>