<?php
include 'dbConfig.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

header("Access-Control-Allow-Origin: *");


$companyId = $_POST['companyId'];
$eventId = $_POST['eventId'];
$response = array();
$flag = 1;

$query = $conn->query("SELECT `isActive` FROM `event` WHERE `eventId` = '$eventId' AND `companyId` = '$companyId'");
if($query->num_rows == 1){
    $row = $query->fetch_assoc();
    if($row['isActive'] == 1){
        $active = 0;
    } else {
        $active = 1;
    }
}

$conn->query("UPDATE `event` SET `isActive` = '$active' WHERE `eventId` = '$eventId' AND `companyId` = '$companyId'");
if(mysqli_error($conn)){
    //Error in updating event
    $flag = 0;
    $response['message'] = "Error in updating event";
} else {
    $response['message'] = "Event updated successfully";
}

$response['flag'] = $flag;

echo json_encode($response);

$conn->close();
?>
