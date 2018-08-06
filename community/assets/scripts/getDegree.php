<?php

include 'dbConfig.php';

$response = array();

$sql = "SELECT `degreeId`, `degree` FROM `degree` WHERE 1";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_num_rows($result);
if($rowCount > 0){	
	while ($row = mysqli_fetch_array($result)){
		
		array_push($response, array('degreeId'=>$row['degreeId'],'degree'=>$row['degree']));
	}
}

echo json_encode($response);
mysqli_close($conn);
?>