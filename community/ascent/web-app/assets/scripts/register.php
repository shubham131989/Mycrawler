<?php
include 'dbConfig.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$name = $_POST['user']['fname'] . " " . $_POST['user']['lname'];
$emailId = $_POST['user']['emailId'];
$password = md5($_POST['user']['password']);
$contact = $_POST['user']['contactNo'];
$pan = $_POST['caterer']['pan'];
$gstin = $_POST['caterer']['gstin'];
$email = $_POST['caterer']['emailId'];
$contactNo = $_POST['caterer']['contactNo'];
$website = $_POST['caterer']['website'];
$tagLine = $_POST['caterer']['tagLine'];
$description = $_POSTS['caterer']['description'];
$currencyId = $_POST['currencyId'];
$partnerId = $_POST['partnerId'];
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

$query = $conn->query("SELECT * FROM `user` WHERE `emailId` = '$emailId'");
if($query->num_rows > 0){
	$response["flag"] = 0;
	$response["message"] = "Given email ID is already registered";
} else {
    $conn->query("INSERT INTO `user` (`userName`, `contactNo`, `emailId`, `isActive`, `partnerId`) VALUES ('$name', '$contact', '$emailId', 1, '$partnerId')");
	if(mysqli_error($conn)){
	    //Some error occured
	    $response["flag"] = 0;
	    $response["message"] = "Some error occured";
	} else {
	    $userId = mysqli_insert_id($conn);
	    
	    $conn->query("INSERT INTO `userCredentials` (`userId`, `password`) VALUES ('$userId', '$password')");
	    
	    $conn->query("INSERT INTO `caterer`(`userId`, `catererName`, `contactNo`, `emailId`, `website`, `pan`, `gstin`, `tagLine`, `description`, `isActive`)
	    VALUES ('$userId', '$catererName', '$contactNo', '$emailId', '$website', '$pan', '$gstin', '$tagLine', '$description', '1')");
	    $catererId = mysqli_insert_id($conn);
	    
	    $conn->query("INSERT INTO `catererAddress`(`catererId`, `line1`, `line2`, `placeId`, `latitude`, `longitude`, `zipcodeId`)
	    VALUES ('$catererId', '$line1', '$line2', '$placeId', '$latitude', '$longitude', '$zipcodeId')");
	    
	    $response["flag"] = 1;
	    $response["message"] = "Registration Successful";
	}

	$response["userId"] = $userId;
	$response["catererId"] = $catererId;
}

echo json_encode($response);

$conn->close();
?>