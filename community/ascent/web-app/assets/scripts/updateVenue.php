<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$catererId = $_POST['catererId'];
$venueId = $_POST['venue']['venueId'];
$venueName = $_POST['venue']['venueName'];
$contactNo = $_POST['venue']['contactNo'];
$emailId = $_POST['venue']['emailId'];
$website = $_POST['venue']['website'];
$line1 = $_POST['address']['line1'];
$line2 = $_POST['address']['line2'];
$latitude = $_POST['address']['latitude'];
$longitude = $_POST['address']['longitude'];
$placeId = $_POST['address']['placeId'];
$country = $_POST['address']['country'];
$countryCode = $_POST['address']['countryCode'];
$state = $_POST['address']['state'];
$stateCode = $_POST['address']['stateCode'];
$city = $_POST['address']['city'];
$zipcode = $_POST['address']['zipcode'];
$response = array();
$flag = 1;

if(!empty($country)){
    //Check existence of country
    $query = $conn->query("SELECT `countryId` FROM `country` WHERE `country` = '$country'");
    if($query->num_rows == 1){
        $row = $query->fetch_assoc();
        $countryId = $row['countryId'];
    } else {
        //New country. Insert a new record in the table
        $conn->query("INSERT INTO `country` (`country`, `code`) VALUES ('$country', '$countryCode')") or die(mysqli_error($conn));
        $countryId = mysqli_insert_id($conn);
    }
} else {
    $countryId = '0';
}

if(!empty($state)){
    //Check existence of state
    $query = $conn->query("SELECT `stateId` FROM `state` WHERE `state` = '$state' AND `countryId` = '$countryId'");
    if($query->num_rows == 1){
        $row = $query->fetch_assoc();
        $stateId = $row['stateId'];
    } else {
        //New state. Insert a new record in the table
        $conn->query("INSERT INTO `state`(`state`, `stateCode`, `countryId`) VALUES ('$state', '$stateCode', '$countryId')") or die(mysqli_error($conn));
        $stateId = mysqli_insert_id($conn);
    }
} else {
    $stateId = '0';
}

if(!empty($city)){
    //Check existence of city
    $query = $conn->query("SELECT `cityId` FROM `city` WHERE `city` = '$city' AND `stateId` = '$stateId'");
    if($query->num_rows == 1){
        $row = $query->fetch_assoc();
        $cityId = $row['cityId'];
    } else {
        //New city. Insert a new record in the table
        $conn->query("INSERT INTO `city`(`city`, `stateId`) VALUES ('$city', '$stateId')") or die(mysqli_error($conn));
        $cityId = mysqli_insert_id($conn);
    }
} else {
    $cityId = '0';
}

if(!empty($zipcode)){
    //Check existence of zipcode
    $query = $conn->query("SELECT `zipcodeId` FROM `zipcode` WHERE `zipcode` = '$zipcode' AND `cityId` = '$cityId'");
    if($query->num_rows == 1){
        $row = $query->fetch_assoc();
        $zipcodeId = $row['zipcodeId'];
    } else {
        //New zipcode. Insert a new record in the table
        $conn->query("INSERT INTO `zipcode`(`zipcode`, `cityId`) VALUES ('$zipcode', '$cityId')") or die(mysqli_error($conn));
        $zipcodeId = mysqli_insert_id($conn);
    }
} else {
    $zipcodeId = '0';
}

$conn->query("UPDATE `venue` SET `venueName` = '$venueName', `contactNo` = '$contactNo', `emailId` = '$emailId', `website` = '$website', `line1` = '$line1', `line2` = '$line2', `latitude` = '$latitude', `longitude` = '$longitude', `placeId` = '$placeId', `zipcodeId` = '$zipcodeId' WHERE `venueId` = '$venueId'");
if(mysqli_error($conn)){
    $flag = 0;
}

$response['flag'] = $flag;

echo json_encode($response);

$conn->close();
?>