<?php
$host = "bestalgorithms.com";
$user = "bestalgo_webuser";
$password = "Y~2+qn}n)#pj";
$database = "bestalgo_webdb";

$conn = mysqli_connect ($host,$user,$password,$database);

if(!$conn){
	die("Error in connection".mysqli_connect_error());
}
?>