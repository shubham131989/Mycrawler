<?php  
include 'dbConfig.php';

$companyId = $_GET['companyId'];
$subscriberId = $_GET['subscriberId'];
$response = array();

$sql = "SELECT `subscriberId` FROM `subscriber` WHERE `companyId` = '$companyId' AND `parentId` = (SELECT `parentId` FROM `subscriber` WHERE `subscriberId` = '$subscriberId') AND `deleteFlag` = 0";

$result = mysqli_query($conn, $sql);
$rowCount = mysqli_num_rows($result);

if($rowCount > 0){
    while ($row = mysqli_fetch_assoc($result)){

        array_push($response, $row);
    }
}

echo json_encode($response);
mysqli_close($conn);
?>