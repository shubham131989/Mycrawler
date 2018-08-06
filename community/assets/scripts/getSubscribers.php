<?php  
include 'dbConfig.php';

$companyId = $_GET['companyId'];
$response = array();

$sql = "SELECT `s`.*, `p`.`subscriberName` AS `parentName` FROM `subscriber` AS `s` 
    LEFT OUTER JOIN `subscriber` AS `p` ON `s`.`parentId` = `p`.`subscriberId`
    WHERE `s`.`companyId` = '$companyId' AND `s`.`deleteFlag` = 0 ";

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
