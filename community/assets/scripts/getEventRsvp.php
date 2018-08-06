<?php 
include 'dbConfig.php';

$companyId = $_GET['companyId'];
$eventId = $_GET['eventId'];
$subscriberId = $_GET['subscriberId'];

$response = array();
//Get details of subscriber himself
$sql = "SELECT `s`.`subscriberId`, `s`.`subscriberName`, `s`.`parentId`, `e`.`rsvp` FROM `subscriber` AS `s` 
    LEFT OUTER JOIN `eventRsvp` AS `e` ON s.subscriberId = e.subscriberId AND e.eventId = '$eventId'
    WHERE `s`.`subscriberId` = '$subscriberId' AND `s`.`companyId` = '$companyId' ";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_num_rows($result);
if($rowCount == 1){
	$row = mysqli_fetch_assoc($result);
	$parentId = $row['parentId'];
	array_push($response, $row);
	
	//Get details of spouse
	$sql = "SELECT `s`.`subscriberId`, `s`.`subscriberName`, `e`.`rsvp` FROM `subscriber` AS `s` 
    LEFT OUTER JOIN `eventRsvp` AS `e` ON s.subscriberId = e.subscriberId AND e.eventId = '$eventId'
    WHERE `s`.`spouseId` = '$subscriberId' AND `s`.`companyId` = '$companyId' ";
	$result = mysqli_query($conn, $sql);
    $rowCount = mysqli_num_rows($result);
    if($rowCount == 1){
	    $row = mysqli_fetch_assoc($result);
        array_push($response, $row);
    }
	
	//Get details of siblings
	$sql = "SELECT `s`.`subscriberId`, `s`.`subscriberName`, `e`.`rsvp` FROM `subscriber` AS `s` 
    LEFT OUTER JOIN `eventRsvp` AS `e` ON s.subscriberId = e.subscriberId AND e.eventId = '$eventId'
    WHERE `s`.`parentId` = '$parentId' AND `s`.`companyId` = '$companyId' AND `s`.`subscriberId` != '$subscriberId'  ";
	$result = mysqli_query($conn, $sql);
    $rowCount = mysqli_num_rows($result);
    if($rowCount > 0){
	    while($row = mysqli_fetch_assoc($result)){
            array_push($response, $row);
	    }
    }
    
    //Get details of children
	$sql = "SELECT `s`.`subscriberId`, `s`.`subscriberName`, `e`.`rsvp` FROM `subscriber` AS `s` 
    LEFT OUTER JOIN `eventRsvp` AS `e` ON s.subscriberId = e.subscriberId AND e.eventId = '$eventId'
    WHERE `s`.`parentId` = '$subscriberId' AND `s`.`companyId` = '$companyId' ";
	$result = mysqli_query($conn, $sql);
    $rowCount = mysqli_num_rows($result);
    if($rowCount > 0){
	    while($row = mysqli_fetch_assoc($result)){
            array_push($response, $row);
	    }
    }
}

echo json_encode($response);

$conn->close();
?>