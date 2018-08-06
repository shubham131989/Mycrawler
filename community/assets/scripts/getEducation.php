<?php

include 'dbConfig.php';

$response = array();

$sql = "SELECT * FROM `education` WHERE 1";
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