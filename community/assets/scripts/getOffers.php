<?php  

include 'dbConfig.php';

$companyId = $_GET['companyId'];
$response = array();

$sql = "SELECT `offerId`, `companyId`, `offer`, `description`, `imageUrl`, DATE_FORMAT(`startDate`,'%d/%m/%Y') AS `startDate`, DATE_FORMAT(`endDate`, '%d/%m/%Y') AS `endDate`, TIME_FORMAT(`startTime`, '%h:%i %p') AS `startTime`, TIME_FORMAT(`endTime`, '%h:%i %p') AS `endTime`, `deleteFlag`, `timestamp` FROM `offer` WHERE `companyId` = '$companyId' AND `deleteFlag` = 0";

$result = mysqli_query($conn, $sql);
$rowCount = mysqli_num_rows($result);

if($rowCount > 0){
	while ($row = mysqli_fetch_assoc($result)) {

		array_push($response, $row);
	}
}

echo json_encode($response);
mysqli_close($conn);
?>