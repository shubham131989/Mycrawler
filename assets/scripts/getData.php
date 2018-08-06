include 'dbConfig.php';
$sel = mysqli_query($conn,"select * from items_table");
$data = array();

while ($row = mysqli_fetch_array($sel)) {
$data[] = array("Name"=>$row['Name'],"Contact_No"=>$row['Contact_No'],"WhatsApp_No"=>$row[WhatsApp_No],"Address"=>$row=[Address],"Latitude"=>$row[Latitude],"Longitude"=>$row[longitude],"Area"=>$row[Area],"Category"=>$row[Category],"Total_reviews"=>$row["Total_reviews"],"Rating"=>$row[Rating],"Timings"=>$row[Timings]);
}

echo json_encode($data);