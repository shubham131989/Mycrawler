<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$companyId = $_POST['companyId'];
$_POST['business'] = json_decode($_POST['business'], true);
$_POST['businessAddress'] = json_decode($_POST['businessAddress'], true);
$businessId = $_POST['business']['businessId'];
$subscriberId = $_POST['business']['subscriberId'];
$businessName = mysqli_real_escape_string($conn,$_POST['business']['businessName']);
$contactNo = $_POST['business']['contactNo'];
$alternateNo = $_POST['business']['alternateNo'];
$whatsapp = $_POST['business']['whatsapp'];
$emailId = $_POST['business']['emailId'];
$website = $_POST['business']['website'];
$businessAddressId = $_POST['businessAddress']['businessAddressId'];
$line1 = $_POST['businessAddress']['line1'];
$line2 = $_POST['businessAddress']['line2'];
$placeId = $_POST['businessAddress']['placeId'];
$latitude = $_POST['businessAddress']['latitude'];
$longitude = $_POST['businessAddress']['longitude'];
$zipcodeId = $_POST['businessAddress']['zipcodeId'];

$response = array();
$flag = 1;

$sql = "UPDATE `business` SET `subscriberId`='$subscriberId', `businessName`='$businessName',`contactNo`='$contactNo',`alternateNo`='$alternateNo',`whatsapp`='$whatsapp',`emailId`='$emailId',`website`='$website' WHERE `businessId`='$businessId' AND `companyId` = '$companyId'";
$result = mysqli_query($conn, $sql);
if(!mysqli_error($conn)){
    $sql = "UPDATE `businessAddress` SET `line1`='$line1',`line2`='$line2',`placeId`='$placeId',`latitude`='$latitude',`longitude`='$longitude',`zipcodeId`='$zipcodeId' WHERE `businessAddressId` = '$businessAddressId' AND `businessId` = '$businessId' ";
    $result = mysqli_query($conn, $sql);
    $rowCount = mysqli_affected_rows($conn);
    if(mysqli_error($conn)){
        $flag = 0;
    }
} else {
    $flag = 0;
}

//Check if file is present. If yes, upload it and update the image URL
if($_FILES['file']){
    $dir = "../img/businesses/".basename($_FILES['file']['name']);
    $extn = strtolower(pathinfo($dir,PATHINFO_EXTENSION));
    $dir = "../img/businesses/".$businessId.".".$extn;
    if(move_uploaded_file($_FILES['file']['tmp_name'], $dir)){
        //Update the directory name
        $logoUrl = "assets/img/businesses/".$businessId.".".$extn;
        
        $conn->query("UPDATE `business` SET `logoUrl` = '$logoUrl' WHERE `businessId` = '$businessId'");
    }
}

$response['flag'] = $flag;
$response['logoUrl'] = $logoUrl;

echo json_encode($response);
mysqli_close($conn);
?>