<?php
include 'dbConfig.php';

$companyId = $_GET['companyId'];
$response = array();

$sql = "SELECT `venue`.*, `zipcode`.`zipcode`, `zipcode`.`cityId`, `city`.`city`, `city`.`stateId`, `state`.`state`, `state`.`countryId`, `country`.`country`
    FROM `venue` LEFT OUTER JOIN `zipcode` ON `venue`.`zipcodeId` = `zipcode`.`zipcodeId`
    LEFT OUTER JOIN `city` ON `zipcode`.`cityId` = `city`.`cityId`
    LEFT OUTER JOIN `state` ON `city`.`stateId` = `state`.`stateId`
    LEFT OUTER JOIN `country` ON `state`.`countryId` = `country`.`countryId`
    WHERE `venue`.`companyId` = '$companyId' AND `venue`.`deleteFlag` = '0'";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_num_rows($result);
if($rowCount > 0){
    while($row = mysqli_fetch_assoc($result)){
        array_push($response, $row);
    }
}else{
    $response['message'] = "Venue fetching failed.";
    
}

echo json_encode($response);

$conn->close();
?>