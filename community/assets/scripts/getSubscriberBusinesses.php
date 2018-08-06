<?php
include 'dbConfig.php';

$companyId = $_GET['companyId'];
$subscriberId = $_GET['subscriberId'];
$response = array();

$sql = "SELECT `business`.*, `businessAddress`.*, `zipcode`.`zipcode`, `zipcode`.`cityId`, `city`.`city`, `city`.`stateId`, `state`.`state`, `state`.`countryId`, `country`.`country`
    FROM `business` INNER JOIN `businessAddress` ON `business`.`businessId` = `businessAddress`.`businessId`
    LEFT OUTER JOIN `zipcode` ON `businessAddress`.`zipcodeId` = `zipcode`.`zipcodeId`
    LEFT OUTER JOIN `city` ON `zipcode`.`cityId` = `city`.`cityId`
    LEFT OUTER JOIN `state` ON `city`.`stateId` = `state`.`stateId`
    LEFT OUTER JOIN `country` ON `state`.`countryId` = `country`.`countryId`
    WHERE `business`.`companyId` = '$companyId' AND `business`.`subscriberId` = '$subscriberId' AND `business`.`deleteFlag` = '0'";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_num_rows($result);
if($rowCount > 0){
    //Businesses fetched
    while($row = mysqli_fetch_assoc($result)){
        //Populate output array
        array_push($response, $row);
    }
}

echo json_encode($response);

mysqli_close($conn);
?>