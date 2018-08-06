<?php
include 'dbConfig.php';

$companyId = $_GET['companyId'];
$eventId = $_GET['eventId'];

$event = array();
$eventRsvp = array();
$eventGallery = array();
$feedback = array();
$response = array();

$sql = "SELECT `a`.*,  DATE_FORMAT(`a`.`startDate`,'%d/%m/%Y') AS `startDate`, TIME_FORMAT(`a`.`startTime`, '%h:%i %p') AS `startTime`, DATE_FORMAT(`a`.`endDate`,'%d/%m/%Y') AS `endDate`, TIME_FORMAT(`a`.`endTime`, '%h:%i %p') AS `endTime`, DATE_FORMAT(`a`.`rsvpStartDate`,'%d/%m/%Y') AS `rsvpStartDate`, TIME_FORMAT(`a`.`rsvpStartTime`, '%h:%i %p') AS `rsvpStartTime`, DATE_FORMAT(`a`.`rsvpEndDate`,'%d/%m/%Y') AS `rsvpEndDate`, TIME_FORMAT(`a`.`rsvpEndTime`, '%h:%i %p') AS `rsvpEndTime`, COUNT(`b`.`eventLikeId`) AS likes, `c`.`venueName`, `c`.`line1`, `c`.`line2` FROM `event` as `a`
	LEFT OUTER JOIN `eventLike` AS `b` ON `a`.`eventId` = `b`.`eventId`
	LEFT OUTER JOIN `venue` AS `c` ON `a`.`venueId` = `c`.`venueId`
	WHERE `a`.`eventId` = '$eventId' AND `a`.`companyId` = '$companyId' AND `a`.`deleteFlag` = 0 ";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_num_rows($result);
if($rowCount == 1){ //Event exists

	$event = mysqli_fetch_assoc($result);
    $venue['venueId'] = $event['venueId'];
    $venue['venueName'] = $event['venueName'];
    $venue['line1'] = $event['line1'];
    $venue['line2'] = $event['line2'];
    	
	$sql = "SELECT * FROM `eventGallery` WHERE `eventId`= '$eventId' AND `deleteFlag` = 0 ";
    $result = mysqli_query($conn, $sql);
    $rowCount = mysqli_num_rows($result);
    if($rowCount > 0){
    //eventGallery exist
	    while($row = mysqli_fetch_assoc($result)){
	        //Populate output array
	        array_push($eventGallery, $row);
	    }
	}
	
	$sql = "SELECT `a`.*, `b`.`eventName`, `c`.`subscriberName`, `c`.`contactNo`
    FROM `feedback` AS `a` 
    LEFT OUTER JOIN `event` AS `b` ON `a`.`eventId` = `b`.`eventId`
    LEFT OUTER JOIN `subscriber` AS `c` ON `a`.`subscriberId` = `c`.`subscriberId`
    WHERE `a`.`eventId` = '$eventId' AND `c`.`companyId` = '$companyId' ";
    
	$result = mysqli_query($conn, $sql);  
	$rowCount = mysqli_num_rows($result);
	if($rowCount > 0){
    //eventFeedback exist
	    while($row = mysqli_fetch_assoc($result)){
	        //Populate output array
	        $row['isApproved'] = (int)$row['isApproved'];
	        array_push($feedback, $row);
	    }
	}

	$sql = "SELECT `a`.*, `b`.`eventName`, `c`.`subscriberName`, `c`.`contactNo`
    FROM `eventRsvp` AS `a` 
    LEFT OUTER JOIN `event` AS `b` ON `a`.`eventId` = `b`.`eventId`
    LEFT OUTER JOIN `subscriber` AS `c` ON `a`.`subscriberId` = `c`.`subscriberId`
    WHERE `a`.`eventId` = '$eventId' AND `c`.`companyId` = '$companyId'";
	$result = mysqli_query($conn, $sql);  
	$rowCount = mysqli_num_rows($result);
	if($rowCount > 0){
    //eventRsvp exist
	    while($row = mysqli_fetch_assoc($result)){
	        //Populate output array
	        array_push($eventRsvp, $row);
	    }
	}
	
}

$response['event'] = $event;
$response['venue'] = $venue;
$response['eventGallery'] = $eventGallery;
$response['eventRsvp'] = $eventRsvp;
$response['feedback'] = $feedback;

echo json_encode($response);

mysqli_close($conn);
?>
