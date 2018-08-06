<?php
include 'dbConfig.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$emailId = $_POST['emailId'];
$password = md5($_POST['password']);
$response = array();
$flag = 1;

$loginQuery = $conn->query("SELECT `user`.*
    FROM `user` INNER JOIN `userCredentials` ON `user`.`userId` = `userCredentials`.`userId`
    WHERE `user`.`emailId` = '$emailId' AND `userCredentials`.`password` = '$password' AND `user`.`deleteFlag` = '0'");
if($loginQuery->num_rows == 1){
    //Credentials are valid
    $loginRow = $loginQuery->fetch_assoc();
    $response['flag'] = $flag;
    $userId = $loginRow['userId'];
    $response['userId'] = $loginRow['userId'];
    $response['emailId'] = $loginRow['emailId'];
    $response['contactNo'] = $loginRow['contactNo'];
    $response['userName'] = $loginRow['userName'];
    $response['message'] = "User logged in successfully";
    $response['isActive'] = $loginRow['isActive'];
    
    $query = $conn->query("SELECT * FROM `company` WHERE `userId` = '$userId'");
    if($query->num_rows == 1){
        $row = $query->fetch_assoc();
        $response['companyId'] = $row['companyId'];
        $response['companyName'] = $row['companyName'];
    }
} else {
    //Check if username exists
    $query = $conn->query("SELECT * FROM `user` WHERE `emailId` = '$emailId' AND `deleteFlag` = '0'");
    if($query->num_rows > 0){
        $row = $query->fetch_assoc();
        if($row['userId'] == '1'){
            //Demo user
            $response['flag'] = $flag;
            $response['userId'] = $row['userId'];
            $response['emailId'] = $row['emailId'];
            $response['contactNo'] = $row['contactNo'];
            $response['userName'] = $row['userName'];
            $response['message'] = "User logged in successfully";
            $response['isActive'] = $row['isActive'];
        } else {
            $flag = 0;
            $response['message'] = "Incorrect password entered";
            $response['flag'] = $flag;
        }
    } else {
        $flag = 0;
        $response['message'] = "Email ID is not registered";
        $response['flag'] = $flag;
    }
}

echo json_encode($response);

$conn->close();
?>