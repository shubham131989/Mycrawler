<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$companyId = $_POST['companyId'];
$_POST['business'] = json_decode($_POST['business'], true);
$_POST['businessAddress'] = json_decode($_POST['businessAddress'], true);
$subscriberId = $_POST['business']['subscriberId'];
$businessName = mysqli_real_escape_string($conn,$_POST['business']['businessName']);
$contactNo = $_POST['business']['contactNo'];
$alternateNo = $_POST['business']['alternateNo'];
$whatsapp = $_POST['business']['whatsapp'];
$emailId = $_POST['business']['emailId'];
$website = $_POST['business']['website'];
$line1 = $_POST['businessAddress']['line1'];
$line2 = $_POST['businessAddress']['line2'];
$placeId = $_POST['businessAddress']['placeId'];
$latitude = $_POST['businessAddress']['latitude'];
$longitude = $_POST['businessAddress']['longitude'];
$zipcodeId = $_POST['businessAddress']['zipcodeId'];

$response = array();
$flag = 1;

$sql = "INSERT INTO `business`( `companyId`, `subscriberId`, `businessName`, `contactNo`, `alternateNo`, `whatsapp`, `emailId`, `website`) VALUES ('$companyId', '$subscriberId', '$businessName', '$contactNo', '$alternateNo', '$whatsapp', '$emailId', '$website')";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_affected_rows($conn);
if($rowCount == 1){
    $businessId = mysqli_insert_id($conn);
    $sql = "INSERT INTO `businessAddress` (`businessId`, `line1`, `line2`, `placeId`, `latitude`, `longitude`, `zipcodeId`) VALUES ('$businessId', '$line1', '$line2', '$placeId', '$latitude', '$longitude', '$zipcodeId')";
    $result = mysqli_query($conn, $sql);
    $rowCount = mysqli_affected_rows($conn);
    if($rowCount == 1){
        $businessAddressId = mysqli_insert_id($conn);
    } else {
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
$response['businessId'] = $businessId;
$response['businessAddressId'] = $businessAddressId;

echo json_encode($response);
mysqli_close($conn);
?>