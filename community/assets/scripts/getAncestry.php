<?php  
include 'dbConfig.php';

$companyId = $_GET['companyId'];
$subscriberId = $_GET['subscriberId'];
$ancestry = array();
$parents = array();
$response = array();

//Initializing variables
$i = $level = $nullCount = 0;
array_push($ancestry, $subscriberId);

function getParents($sId){
    global $parents, $conn;
    $sql = "SELECT `subscriberId` AS `fId`, `spouseId` AS `mId` FROM `subscriber` WHERE `subscriberId` = ( SELECT `parentId` FROM `subscriber` WHERE `subscriberId` = '$sId' AND `deleteFlag` = 0)";
    $result = mysqli_query($conn, $sql);
    $rowCount = mysqli_num_rows($result);
    if($rowCount == 1){
        $row = mysqli_fetch_array($result);
        array_push($parents, $row);
        return true;
    } else{
        return false;
    }
}

function getAncestry($response){
    global $i, $level, $nullCount, $parents, $ancestry, $response, $subscriberId;
    while($nullCount != 2**($level+1)){
        if($i == (2**($level+1) - 1)){
            $level++;
            $nullCount=0;
        }
        if(getParents($ancestry[$i])){
            array_push($ancestry, $parents[0]['fId']);
            array_push($ancestry, $parents[0]['mId']);
        } else{
            array_push($ancestry, -1);
            array_push($ancestry, -1);
            $nullCount += 2;
        }
        $i++;
        $parents = array();
    }
    $response['ancestry'] = $ancestry;
    return $response;
}

$response = getAncestry($response);

echo json_encode($response);
mysqli_close($conn);
?>