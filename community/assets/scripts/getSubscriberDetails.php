<?php
include 'dbConfig.php';

$companyId = $_GET['companyId'];
$subscriberId = $_GET['subscriberId'];
$subscriber = array();
$degree = array();
$education = array();
$parents = array();
$grandparents = array();
$spouse = array();
$children = array();
$siblings = array();

$query = $conn->query("SELECT `subscriber`.*, `degree`.`degree`, `education`.`education`, `maritalStatus`.`maritalStatus`
    FROM `subscriber` LEFT OUTER JOIN `degree` ON `subscriber`.`degreeId` = `degree`.`degreeId`
    LEFT OUTER JOIN `education` ON `subscriber`.`educationId` = `education`.`educationId`
    LEFT OUTER JOIN `maritalStatus` ON `subscriber`.`maritalStatusId` = `maritalStatus`.`maritalStatusId`
    WHERE `subscriber`.`subscriberId` = '$subscriberId' AND `subscriber`.`companyId` = '$companyId'");
if($query->num_rows == 1){
    $row = $query->fetch_assoc();
    $subscriber = $row;
    $subscriber['isAlive'] = (int)$subscriber['isAlive'];
    $parentId = $row['parentId'];
    $spouseId = $row['spouseId'];
    
    $degree['degreeId'] = $row['degreeId'];
    $degree['degree'] = $row['degree'];
    
    $education['educationId'] = $row['educationId'];
    $education['education'] = $row['education'];
    
    $maritalStatus['maritalStatusId'] = $row['maritalStatusId'];
    $maritalStatus['maritalStatus'] = $row['maritalStatus'];
    
    //Fetch siblings
    $query = $conn->query("SELECT `a`.*, `b`.`subscriberName` AS `spouse`, `b`.`gender` AS `spouseGender`
        FROM `subscriber` AS `a` LEFT OUTER JOIN `subscriber` AS `b` ON `a`.`spouseId` = `b`.`subscriberId`
        WHERE `a`.`parentId` = '$parentId' AND `a`.`parentId` != '0' AND `a`.`subscriberId` != '$subscriberId' AND `a`.`deleteFlag` = '0'");
    if($query->num_rows > 0){
        while($row = $query->fetch_assoc()){
            //Populate array
            array_push($siblings, array('subscriberId'=>$row['subscriberId'], 'subscriberName'=>$row['subscriberName'], 'gender'=>$row['gender'], 'spouseId'=>$row['spouseId'], 'spouse'=>$row['spouse'], 'spouseGender'=>$row['spouseGender']));
        }
    }
    
    //Fetch parent details
    $query = $conn->query("SELECT `a`.*, `b`.`subscriberName` AS `spouse`, `b`.`gender` AS `spouseGender`
        FROM `subscriber` AS `a` LEFT OUTER JOIN `subscriber` AS `b` ON `a`.`spouseId` = `b`.`subscriberId`
        WHERE `a`.`subscriberId` = '$parentId' AND `a`.`deleteFlag` = '0'");
        if($query->num_rows == 1){
            $row = $query->fetch_assoc();
            $parent['subscriberId'] = $row['subscriberId'];
            $parent['subscriberName'] = $row['subscriberName'];
            
            $parents['fatherId'] = $row['subscriberId'];
            $parents['father'] = $row['subscriberName'];
            $parents['motherId'] = $row['spouseId'];
            $parents['mother'] = $row['spouse'];
            
            $parentId = $row['parentId'];
            
            //Fetch grandparent details
             $query = $conn->query("SELECT `a`.*, `b`.`subscriberName` AS `spouse`, `b`.`gender` AS `spouseGender`
                FROM `subscriber` AS `a` LEFT OUTER JOIN `subscriber` AS `b` ON `a`.`spouseId` = `b`.`subscriberId`
                WHERE `a`.`subscriberId` = '$parentId' AND `a`.`deleteFlag` = '0'");
                
                if($query->num_rows == 1){
                    $row = $query->fetch_assoc();
                    
                    $grandparents['grandfatherId'] = $row['subscriberId'];
                    $grandparents['grandfather'] = $row['subscriberName'];
                    $grandparents['grandmotherId'] = $row['spouseId'];
                    $grandparents['grandmother'] = $row['spouse'];
                }
        }
    
    //Fetch spouse details
    $query = $conn->query("SELECT * FROM `subscriber` WHERE `subscriberId` = '$spouseId'");
    if($query->num_rows == 1){
        $row = $query->fetch_assoc();
        $spouse['subscriberId'] = $row['subscriberId'];
        $spouse['subscriberName'] = $row['subscriberName'];
        $spouse['gender'] = $row['gender'];
    }
}

//Fetch details about children
$query = $conn->query("SELECT `a`.*, `b`.`subscriberName` AS `spouse`, `b`.`gender` AS `spouseGender`
    FROM `subscriber` AS `a` LEFT OUTER JOIN `subscriber` AS `b` ON `a`.`spouseId` = `b`.`subscriberId`
    WHERE `a`.`parentId` = '$subscriberId' AND `a`.`deleteFlag` = '0'");
if($query->num_rows > 0){
    while($row = $query->fetch_assoc()){
        //Populate array
        array_push($children, array('subscriberId'=>$row['subscriberId'], 'subscriberName'=>$row['subscriberName'], 'gender'=>$row['gender'], 'spouseId'=>$row['spouseId'], 'spouse'=>$row['spouse'], 'spouseGender'=>$row['spouseGender']));
    }
}

$response['subscriber'] = $subscriber;
$response['parent'] = $parent;
$response['spouse'] = $spouse;
$response['degree'] = $degree;
$response['education'] = $education;
$response['maritalStatus'] = $maritalStatus;
$response['parents'] = $parents;
$response['grandparents'] = $grandparents;
$response['children'] = $children;
$response['siblings'] = $siblings;

echo json_encode($response);

mysqli_close($conn);
?>
