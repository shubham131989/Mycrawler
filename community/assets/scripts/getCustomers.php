<?php
include 'dbConfig.php';

$companyId = $_GET['companyId'];
$response = array();

$query = $conn->query("SELECT `customer`.*, `customerAddress`.*, `zipcode`.`zipcode`, `zipcode`.`cityId`, `city`.`city`, `city`.`stateId`, `state`.`state`, `state`.`countryId`, `country`.`country`
    FROM `customer` INNER JOIN `customerAddress` ON `customer`.`customerId` = `customerAddress`.`customerId`
    LEFT OUTER JOIN `zipcode` ON `customerAddress`.`zipcodeId` = `zipcode`.`zipcodeId`
    LEFT OUTER JOIN `city` ON `zipcode`.`cityId` = `city`.`cityId`
    LEFT OUTER JOIN `state` ON `city`.`stateId` = `state`.`stateId`
    LEFT OUTER JOIN `country` ON `state`.`countryId` = `country`.`countryId`
    WHERE `customer`.`companyId` = '$companyId' AND `customer`.`deleteFlag` = '0' AND `customerAddress`.`isActive` = '1'");
if($query->num_rows > 0){
    //Customers fetched
    while($row = $query->fetch_assoc()){
        //Populate output array
        array_push($response, array('customerId'=>$row['customerId'], 'customerName'=>$row['customerName'], 'contactNo'=>$row['contactNo'], 'alternateNo'=>$row['alternateNo'], 'emailId'=>$row['emailId'], 'pan'=>$row['pan'], 'gstin'=>$row['gstin'], 'customerAddressId'=>$row['customerAddressId'], 'line1'=>$row['line1'], 'line2'=>$row['line2'], 'latitude'=>$row['latitude'], 'longitude'=>$row['longitude'], 'placeId'=>$row['placeId'], 'isActive'=>$row['isActive'], 'zipcodeId'=>$row['zipcodeId'], 'zipcode'=>$row['zipcode'], 'cityId'=>$row['cityId'], 'city'=>$row['city'], 'stateId'=>$row['stateId'], 'state'=>$row['state'], 'countryId'=>$row['countryId'], 'country'=>$row['country']));
    }
}

echo json_encode($response);

$conn->close();
?>