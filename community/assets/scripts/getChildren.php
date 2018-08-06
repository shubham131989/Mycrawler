<?php  
include 'dbConfig.php';

$companyId = $_GET['companyId'];
$subscriberId = $_GET['subscriberId'];
$response = array();
$children = array();

$sql = "SELECT `subscriberId` FROM `subscriber` WHERE `parentId` IN (SELECT `subscriberId` FROM `subscriber` WHERE `subscriberId` = '$subscriberId' UNION SELECT `spouseId` FROM `subscriber` WHERE `subscriberId` = '$subscriberId') AND `companyId` = '$companyId' AND `deleteFlag` = 0 ";

$result = mysqli_query($conn, $sql);
$rowCount = mysqli_fetch_assoc($result);

if($rowCount > 0){
    while ($row = mysqli_fetch_assoc($result)){

        array_push($children, $row);
    }
}

$response['children'] = $children;
echo json_encode($response);
mysqli_close($conn);
?>