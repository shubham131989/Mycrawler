<?php

include 'dbConfig.php';

$response = array();

$sql = "SELECT `bloodGroupId`, `bloodGroup` FROM `bloodGroup` WHERE 1";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_num_rows($result);
if($rowCount > 0){	
	while ($row = mysqli_fetch_array($result)){
		
		array_push($response, array('bloodGroupId'=>$row['bloodGroupId'],'bloodGroup'=>$row['bloodGroup']));
	}
}

echo json_encode($response);
mysqli_close($conn);
?>