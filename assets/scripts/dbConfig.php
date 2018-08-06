<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "sample_db";

$conn = mysqli_connect($servername,$username,$password,$database);

if(!$conn){
	die("Error in connection".mysqli_connect_error());
}
?>
