<?php
include 'dbConfig.php';
$counter = 0;
$result= mysqli_query($conn, "SELECT * FROM items");

if(mysqli_num_rows($result) > 0)  
{  
     while($row = mysqli_fetch_array($result))  
     {  
          $output[] = $row;  
     }  
     echo json_encode($output);  
}  

?>