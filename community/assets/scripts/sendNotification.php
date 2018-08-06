 <?php
include 'db_config.php';
// header('Content-Type:application/json');
// define( 'API_ACCESS_KEY', 'AIzaSyBRZvHozy_FVs8GhsfwrWDMS_EmKNtuzoQ' );

date_default_timezone_set("Asia/Kolkata");
$date=date("Y-m-d H:i:s");
//$date = strtotime("+1 day", strtotime($date));
//$date=date("Y-m-d",$date);


$notification = "SELECT * FROM `notification` AS `T` WHERE TIMESTAMPDIFF( MINUTE , `T`.`pushTime`, NOW() ) < 15 AND TIMESTAMPDIFF( MINUTE , `T`.`pushTime`, NOW() ) >= 0";

$sql1 = $conn->query("SELECT DISTINCT(`N`.`companyId`) AS `companyId` FROM '$notification' AS `N` ") or die(mysqli_error($conn));
if($sql1-> num_rows > 0){
	while($row1 = mysqli_fetch_assoc($sql1)){
		//find registered users
		$companyId = $row['companyId'];

		$sql2 = $conn->query("SELECT * FROM `fcmConfig` WHERE `companyId` = '$companyId'");
		$row2 = mysqli_fetch_assoc($sql2);
		$API_ACCESS_KEY = $row2['apiKey'];
		$sql2 = $conn->query("SELECT * FROM `company` WHERE `companyId` = '$companyId' ");
		$row2 = mysqli_fetch_assoc($sql2);
		$companyName = $row2['companyName'];
		$sql2 = $conn->query("SELECT * FROM `userDevice` WHERE `userDeviceId` IN (SELECT `userDeviceId` FROM `subscriberToken` WHERE `subscriberId` IN (SELECT `subscriberId` FROM `subscriber` WHERE `companyId` = '$companyId'))") or die(mysqli_error($conn));
		if($sql2->num_rows > 0){
            $tokens = array();
			while($row2 = mysqli_fetch_assoc($sql2)){
				array_push($tokens, $row2['token']);
			}	
    		$sql2 = $conn->query("SELECT * FROM '$notification' AS `N` WHERE `N`.`companyId` = '$companyId' ") or die(mysqli_error($conn));
    		if ($sql2->num_rows > 0) {
    			# code...
    			while($row2 = mysqli_fetch_assoc($sql2)){
    
    				$description = $row2['description'];
    				$imageUrl="http://community.bestalgorithms.com/".$row2['imageUrl'];
    				$msg = array
    					(
    						'title'	=> $notification,
    						'body' 	=> $description,
    						'icon'	=> $imageUrl
    						
    					);
    					$fields = array
    					(
    						'registration_ids' => $tokens,
    						'data' => $msg
    					);
    					$headers = array
    					(
    						'Authorization: key=' . $API_ACCESS_KEY,
    						'Content-Type: application/json'
    					);		
    					$ch = curl_init();
    					curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
    					curl_setopt( $ch,CURLOPT_POST, true );
    					curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
    					curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
    					curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
    					curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
    					$result = curl_exec($ch );
    					curl_close( $ch );
    					echo $result;
    			}
    		}
        }
    }
}
?>