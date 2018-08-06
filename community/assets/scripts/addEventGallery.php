<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$eventId = $_POST['eventId'];

$response = array();
$flag = 1;

//Check if file is present. If yes, upload it and update the image URL
if(!empty($_FILES)){
    $dir = "../img/events/$eventId/".basename($_FILES['file']['name']);
    $imageUrl = "assets/img/events/$eventId/".basename($_FILES['file']['name']);
        $sql = "INSERT INTO `eventGallery`(`eventId`, `imageUrl`) VALUES ('$eventId', '$imageUrl') ON DUPLICATE KEY UPDATE `timestamp` = NOW()";
        $result = mysqli_query($conn, $sql);
        if(!mysqli_error($conn)){
            $eventGalleryId = mysqli_insert_id($conn);
            $response['eventGallery'] = array("eventGalleryId"=>$eventGalleryId, "imageUrl"=> $imageUrl);
        } else{
            $response['message'] = mysqli_error($conn);
        }
    if(!move_uploaded_file($_FILES['file']['tmp_name'], $dir)){
        $flag = 0;
    }
} else {   
    $images = array();
    $dir = "../img/events/$eventId";
    $files = scandir($dir);                 
    if ( $files!==false ) {
        foreach ( $files as $file ) {
            if ( '.'!=$file && '..'!=$file) {      
                $obj['name'] = $file;
                $obj['size'] = filesize("$dir/$file");
                array_push($images, $obj);
            }
        }
        $response['images'] = $images;
    } else{
        $flag = 0;
        $response['message'] = "Error in displaying images.";
    }
    header('Content-type: text/json'); 
    header('Content-type: application/json');
}
$response['flag'] = $flag;

echo json_encode($response);
mysqli_close($conn);
?>