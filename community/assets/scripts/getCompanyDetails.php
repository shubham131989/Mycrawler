<?php
include 'dbConfig.php';

$companyId = $_GET['companyId'];
$company = array();
$companySocial = array();
$response = array();

$sql = "SELECT `company`.*, `companyAddress`.*, `zipcode`.`zipcode`, `zipcode`.`cityId`, `city`.`city`, `city`.`stateId`, `state`.`state`, `state`.`countryId`, `country`.`country`
    FROM `company` INNER JOIN `companyAddress` ON `company`.`companyId` = `companyAddress`.`companyId`
    LEFT OUTER JOIN `zipcode` ON `companyAddress`.`zipcodeId` = `zipcode`.`zipcodeId`
    LEFT OUTER JOIN `city` ON `zipcode`.`cityId` = `city`.`cityId`
    LEFT OUTER JOIN `state` ON `city`.`stateId` = `state`.`stateId`
    LEFT OUTER JOIN `country` ON `state`.`countryId` = `country`.`countryId`
    WHERE `company`.`companyId` = '$companyId'";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_num_rows($result);
if($rowCount > 0){ //company exists

    $response = mysqli_fetch_assoc($result);
    
    $sql = "SELECT * FROM `companySocial` WHERE `companyId` = '$companyId' AND `deleteFlag` = 0 ";
    $result = mysqli_query($conn, $sql);  
    $rowCount = mysqli_num_rows($result);
    if($rowCount > 0){
    //companyAddress exist
        while($row = mysqli_fetch_assoc($result)){
            //Populate output array
            array_push($companySocial, $row);
        }
    }
}

$response['companySocial'] = $companySocial;

echo json_encode($response);

mysqli_close($conn);
?>