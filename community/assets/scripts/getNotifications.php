<?php  

include 'dbConfig.php';

$companyId = $_GET['companyId'];
$response = array();

$sql = "SELECT `notificationId`, `companyId`, `notification`, `description`, `imageUrl`, DATE_FORMAT(`pushDate`, '%d/%m/%Y') as `pushDate`, TIME_FORMAT(`pushTime`, '%h:%i %p') AS `pushTime`, `deleteFlag`, `timestamp` FROM `notification` WHERE `companyId` = '$companyId' ";

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