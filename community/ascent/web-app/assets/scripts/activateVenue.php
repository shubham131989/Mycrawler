<?php
include 'dbConfig.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$catererId = $_POST['catererId'];
$venueId = $_POST['venueId'];
$response = array();
$flag = 1;

$query = $conn->query("SELECT `isActive` FROM `venue` WHERE `venueId` = '$venueId' AND `catererId` = '$catererId'");
if($query->num_rows == 1){
    $row = $query->fetch_assoc();
    if($row['isActive'] == 1){
        $active = 0;
    } else {
        $active = 1;
    }
}

$conn->query("UPDATE `venue` SET `isActive` = '$active' WHERE `venueId` = '$venueId' AND `catererId` = '$catererId'");
if(mysqli_error($conn)){
    //Error in updating item
    $flag = 0;
    $response['message'] = "Error in updating venue";
} else {
    $response['message'] = "Venue updated successfully";
}

$response['flag'] = $flag;

echo json_encode($response);

$conn->close();
?>