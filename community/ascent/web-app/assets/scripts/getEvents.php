<?php
include 'dbConfig.php';

$catererId = $_GET['catererId'];
$response = array();

$query = $conn->query("SELECT `event`.*, `customer`.`customerName`, `customer`.`contactNo`, `customer`.`emailId`, `venue`.`venueName`, `venue`.`zipcodeId`, `zipcode`.`zipcode`, `zipcode`.`cityId`, `city`.`city`, `city`.`stateId`, `state`.`state`, `state`.`countryId`, `country`.`country`
    FROM `event` INNER JOIN `customer` ON `event`.`customerId` = `customer`.`customerId`
    INNER JOIN `venue` ON `event`.`venueId` = `venue`.`venueId`
    LEFT OUTER JOIN `zipcode` ON `venue`.`zipcodeId` = `zipcode`.`zipcodeId`
    LEFT OUTER JOIN `city` ON `zipcode`.`cityId` = `city`.`cityId`
    LEFT OUTER JOIN `state` ON `city`.`stateId` = `state`.`stateId`
    LEFT OUTER JOIN `country` ON `state`.`countryId` = `country`.`countryId`
    WHERE `event`.`catererId` = '$catererId' AND `event`.`deleteFlag` = '0'");
    
if($query->num_rows > 0){
    //Events exist
    while($row = $query->fetch_assoc()){
        //Populate output array
        array_push($response, array('eventId'=>$row['eventId'], 'eventName'=>$row['eventName'], 'startDate'=>$row['startDate'], 'startTime'=>$row['startTime'], 'endDate'=>$row['endDate'], 'endTime'=>$row['endTime'], 'notes'=>$row['notes'], 'isActive'=>$row['isActive'], 'customerId'=>$row['customerId'], 'customerName'=>$row['customerName'], 'contactNo'=>$row['contactNo'], 'emailId'=>$row['emailId'], 'venueId'=>$row['venueId'], 'venueName'=>$row['venueName'], 'zipcodeId'=>$row['zipcodeId'], 'zipcode'=>$row['zipcode'], 'cityId'=>$row['cityId'], 'city'=>$row['city'], 'stateId'=>$row['stateId'], 'state'=>$row['state'], 'countryId'=>$row['countryId'], 'country'=>$row['country']));
    }
}

echo json_encode($response);

$conn->close();
?>