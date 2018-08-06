<?php
include 'dbConfig.php';

$catererId = $_GET['catererId'];
$response = array();

$query = $conn->query("SELECT `venue`.*, `zipcode`.`zipcode`, `zipcode`.`cityId`, `city`.`city`, `city`.`stateId`, `state`.`state`, `state`.`countryId`, `country`.`country`
    FROM `venue` LEFT OUTER JOIN `zipcode` ON `venue`.`zipcodeId` = `zipcode`.`zipcodeId`
    LEFT OUTER JOIN `city` ON `zipcode`.`cityId` = `city`.`cityId`
    LEFT OUTER JOIN `state` ON `city`.`stateId` = `state`.`stateId`
    LEFT OUTER JOIN `country` ON `state`.`countryId` = `country`.`countryId`
    WHERE `venue`.`catererId` = '$catererId' AND `venue`.`deleteFlag` = '0'");
if($query->num_rows > 0){
    //Venues present for the caterer
    while($row = $query->fetch_assoc()){
        array_push($response, array('venueId'=>$row['venueId'], 'venueName'=>$row['venueName'], 'contactNo'=>$row['contactNo'], 'emailId'=>$row['emailId'], 'website'=>$row['website'], 'line1'=>$row['line1'], 'line2'=>$row['line2'], 'latitude'=>$row['latitude'], 'longitude'=>$row['longitude'], 'placeId'=>$row['placeId'], 'isActive'=>$row['isActive'], 'zipcodeId'=>$row['zipcodeId'], 'zipcode'=>$row['zipcode'], 'cityId'=>$row['cityId'], 'city'=>$row['city'], 'stateId'=>$row['stateId'], 'state'=>$row['state'], 'countryId'=>$row['countryId'], 'country'=>$row['country']));
    }
}

echo json_encode($response);

$conn->close();
?>