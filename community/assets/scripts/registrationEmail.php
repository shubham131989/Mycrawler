<?php
include 'dbConfig.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$name = $_POST['name'];
$contactNo = $_POST['contactNo'];
$membershipId = $_POST['membershipId'];
$response = array();

$sql = "SELECT * FROM subscriber WHERE `contactNo` = '$contactNo' ";
$result = mysqli_query($conn, $sql);
$rowCount = mysqli_num_rows($result);
if($rowCount > 0){
	$response["flag"] = 0;
	$response["message"] = "User with this contact number already exists";
} else {

    //Send OTP to the user via Email
    $to = "kevindoshi.aft@gmail.com";
    $subject = "New Registration from Commu Pro";
    
    $message = '
    <html>
    <head>
    <title>Welcome to Commu Pro | Your Customer Relationship Management [CRM] solution</title>
    </head>
    <body>
<div>
		<center>
            <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%">
                <tr>
                    <td align="left" valign="top">
                        
						
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%">
    <tbody>
        <tr>
            <td valign="top" style="padding-top:9px">
              	
			    
				
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%" width="100%">
                    <tbody><tr>
                        
                        <td valign="top" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px">
                        
                            <span style="color:#009999"><span style="font-size:28px"><span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif">Welcome to Commu Pro family!</span></span></span>
                        </td>
                    </tr>
                </tbody></table>
            </td>
        </tr>
    </tbody>
</table></td>
                            </tr>
                            <tr>
                                <td valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%">
    <tbody>
        <tr>
            <td valign="top" style="padding-top:9px">
              	
			    
				
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%" width="100%">
                    <tbody>
                        <tr>
                        
                            <td valign="top" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px">
                            
                                <br>
    <span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif">Name: <span style="color:#990099"><span style="font-size:24px">'.$name.'</span></span></span><br><span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif"> Contact Number: <span style="color:#990099"><span style="font-size:24px">'.$contactNo.'</span></span></span><br><span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif">Membership ID: <span style="color:#990099"><span style="font-size:24px">'.$membershipId.'</span></span></span>
                            </td>
                        </tr>
                </tbody></table>
				
                
				
            </td>
        </tr>
    </tbody>
</table></td>
                            </tr>
                            <tr>
                                <td valign="top"></td>
                            </tr>
                        </table>
					</td>
                </tr>
            </table>
        </center>
    </div>
    </body>
    </html>
    ';
    
    // Always set content-type when sending HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

    // More headers
    $headers .= 'From: <no-reply@commupro.com>' . "\r\n";
    mail($to,$subject,$message,$headers);
    
    $response['message'] = "Email has been sent";
    $response['flag'] = 1;
}
echo json_encode($response);

$conn->close();
?>