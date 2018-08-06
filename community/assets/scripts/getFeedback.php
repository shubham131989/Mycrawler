<?php
include 'dbConfig.php';

$companyId = $_GET['companyId'];
$response = array();

$sql = "SELECT `feedback`.*, `event`.`eventName`, `subscriber`.`subscriberName`
    FROM `feedback` 
    LEFT OUTER JOIN `event` ON `feedback`.`eventId` = `event`.`eventId`
    LEFT OUTER JOIN `subscriber` ON `feedback`.`subscriberId` = `subscriber`.`subscriberId`
    WHERE `event`.`companyId` = '$companyId' AND `subscriber`.`companyId` = '$companyId' ";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_num_rows($result);
if($rowCount > 0){
    //Feedbacks fetched
    while($row = mysqli_fetch_assoc($result)){
        //Populate output array
        $row['isApproved'] = (int)$row['isApproved'];
        array_push($response, $row);
    }
}

echo json_encode($response);

mysqli_close($conn);
?>