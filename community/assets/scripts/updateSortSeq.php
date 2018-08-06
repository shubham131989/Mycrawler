<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$companyId = $_POST['companyId'];
$sortOrder = json_decode($_POST['sortOrder'],true);

$response = array();
$flag = 1;

foreach ($sortOrder as &$value) {
    $committeeMemberId = $value['committeeMemberId'];
    $sortSeq = $value['sortSeq'];
    $sql = "UPDATE `committeeMember` SET `sortSeq`= '$sortSeq' WHERE `committeeMemberId` = '$committeeMemberId' AND `companyId` = '$companyId' ";
    $result = mysqli_query($conn, $sql);
    $rowCount = mysqli_affected_rows($conn);
    if(!mysqli_error($conn)){
        $response['flag'] = 1;
    } else {
        $response['flag'] = 0;
        $response['message'] = mysqli_error($conn);
        break;
    }
}

echo json_encode($response);
mysqli_close($conn);
?>