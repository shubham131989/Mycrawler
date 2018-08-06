<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$companyId = $_POST['companyId'];
$_POST['committeeMember'] = json_decode($_POST['committeeMember'], true);
$memberName = mysqli_real_escape_string($conn,$_POST['committeeMember']['memberName']);
$contactNo = $_POST['committeeMember']['contactNo'];
$whatsapp = $_POST['committeeMember']['whatsapp'];
$emailId = $_POST['committeeMember']['emailId'];
$position = $_POST['committeeMember']['position'];
$description = $_POST['committeeMember']['description'];

$response = array();
$flag = 1;

$sql = "INSERT INTO `committeeMember`( `companyId`, `memberName`, `contactNo`, `whatsapp`, `emailId`, `position`, `description`) VALUES ('$companyId', '$memberName', '$contactNo', '$whatsapp', '$emailId', '$position', '$description')";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_affected_rows($conn);
if($rowCount == 1){
    $committeeMemberId = mysqli_insert_id($conn);
} else {
	mysqli_error($conn);
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
$response['committeeMemberId'] = $committeeMemberId;

echo json_encode($response);
mysqli_close($conn);
?>