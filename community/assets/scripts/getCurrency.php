<?php
include 'dbConfig.php';

$response = array();

$query = $conn->query("SELECT * FROM `currency` WHERE 1");
if($query->num_rows > 0){
    while($row = $query->fetch_assoc()){
        array_push($response, array('currencyId'=>$row['currencyId'], 'currency'=>utf8_encode($row['currency']), 'abbreviation'=>$row['abbreviation'], 'symbol'=>utf8_encode($row['symbol'])));
    }
}

echo json_encode($response);

$conn->close();
?>