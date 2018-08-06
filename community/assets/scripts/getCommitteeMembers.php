<?php  

include 'dbConfig.php';

$companyId = $_GET['companyId'];
$response = array();

$sql = "SELECT * FROM `committeeMember` WHERE `companyId` = '$companyId' AND `deleteFlag` = 0 ORDER BY `sortSeq`";

$result = mysqli_query($conn, $sql);
$rowCount = mysqli_num_rows($result);

if($rowCount > 0){
    while ($row = mysqli_fetch_assoc($result)){

        array_push($response, $row);
    }
}

echo json_encode($response);
mysqli_close($conn);
?>