<?php
include 'dbConfig.php';

$userId = $_GET['userId'];
$user = array();
$company = array();
$companyAddress = array();
$response = array();

$sql = "SELECT * FROM `user` WHERE `userId` = '$userId' AND `deleteFlag` = 0 ";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_num_rows($result);
if($rowCount == 1){ 

    $user = mysqli_fetch_assoc($result);

    $sql = "SELECT * FROM `company` WHERE `userId` = '$userId'";
    $result = mysqli_query($conn, $sql);
    $rowCount = mysqli_num_rows($result);
    if($rowCount == 1){
        $company = mysqli_fetch_assoc($result);
        $companyId = $company['companyId'];
    }

    $sql = "SELECT `companyAddress`.*, `zipcode`.`zipcode`, `zipcode`.`cityId`, `city`.`city`, `city`.`stateId`, `state`.`state`, `state`.`countryId`, `country`.`country`
        FROM `companyAddress`
        LEFT OUTER JOIN `zipcode` ON `companyAddress`.`zipcodeId` = `zipcode`.`zipcodeId`
        LEFT OUTER JOIN `city` ON `zipcode`.`cityId` = `city`.`cityId`
        LEFT OUTER JOIN `state` ON `city`.`stateId` = `state`.`stateId`
        LEFT OUTER JOIN `country` ON `state`.`countryId` = `country`.`countryId`
        WHERE `companyAddress`.`companyId` = '$companyId'";
    $result = mysqli_query($conn, $sql);
    $rowCount = mysqli_num_rows($result);
    if($rowCount == 1){
        $companyAddress = mysqli_fetch_assoc($result);
    }

    array_push($response,$user);
    array_push($response,$company);
    array_push($response,$companyAddress);
}

echo json_encode($response);

mysqli_close($conn);
?>