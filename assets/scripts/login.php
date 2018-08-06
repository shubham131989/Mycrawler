<?php
include 'dbConfig.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$emailId = $_POST['emailId'];
$password = $_POST['password'];
$response = array();
$flag = 1;

$loginQuery = $conn->query("SELECT *
    FROM `users` 
    WHERE `username` = '$emailId' AND `password` = '$password' ");
if($loginQuery->num_rows > 0){
    //Credentials are valid
    $loginRow = $loginQuery->fetch_assoc();
    $response['flag'] = $flag;
    $response['username'] = $loginRow['username'];
    $response['message'] = "User logged in successfully";
    
} else {
        $flag = 0;
        $response['message'] = "Invalid Username or Password";
        $response['flag'] = $flag;
    
}


echo json_encode($response);

$conn->close();
?>