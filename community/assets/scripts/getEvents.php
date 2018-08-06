<?php
include 'dbConfig.php';

$companyId = $_GET['companyId'];
$subscriberId = $_GET['subscriberId'];
$response = array();

$sql = "SELECT `a`.`eventId`, `a`.`companyId`, `a`.`venueId`, `a`.`eventName`, `a`.`description`, `a`.`eventGalleryId`,  DATE_FORMAT(`a`.`startDate`,'%d/%m/%Y') AS `startDate`, TIME_FORMAT(`a`.`startTime`, '%h:%i %p') AS `startTime`, DATE_FORMAT(`a`.`endDate`,'%d/%m/%Y') AS `endDate`, TIME_FORMAT(`a`.`endTime`, '%h:%i %p') AS `endTime`, DATE_FORMAT(`a`.`rsvpStartDate`,'%d/%m/%Y') AS `rsvpStartDate`, TIME_FORMAT(`a`.`rsvpStartTime`, '%h:%i %p') AS `rsvpStartTime`, DATE_FORMAT(`a`.`rsvpEndDate`,'%d/%m/%Y') AS `rsvpEndDate`, TIME_FORMAT(`a`.`rsvpEndTime`, '%h:%i %p') AS `rsvpEndTime`, `a`.`isActive`, `a`.`timestamp`, (SELECT COUNT(`eventLikeId`) FROM `eventLike` WHERE `eventId` = `a`.`eventId` AND `isLiked` = '1') AS `likes`, `c`.`isLiked`, `d`.`imageUrl`, `e`.`venueName` 
    FROM `event` AS `a` 
    LEFT OUTER JOIN `eventLike` AS `c` ON `a`.`eventId` = `c`.`eventId` AND `c`.`subscriberId` = '$subscriberId' 
    LEFT OUTER JOIN `eventGallery` AS `d` ON `a`.`eventGalleryId` = `d`.`eventGalleryId`
    LEFT OUTER JOIN `venue` AS `e` ON `a`.`venueId` = `e`.`venueId`
    WHERE `a`.`companyId` = '$companyId' AND `a`.`deleteFlag` = 0 
    GROUP BY `a`.`eventId` ";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_num_rows($result);    
if($rowCount > 0){
    //Events exist
    while($row = mysqli_fetch_assoc($result)){
        //Populate output array
        array_push($response, $row);
    }
}

echo json_encode($response);

mysqli_close($conn);
?>
