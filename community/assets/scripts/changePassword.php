<?php
include 'dbConfig.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST' && empty($_POST)){
    $_POST = json_decode(file_get_contents('php://input'), true);
}

$emailId = $_POST['emailId'];
$userId = $_POST['userId'];
$password = md5($_POST['password']);
$response = array();



$userQuery = $conn->query("UPDATE `userCredentials` SET `password` = '$password' WHERE `userId` = '$userId'");

if (!mysqli_error($conn)) {

    $to = $emailId;
    $subject = "Password Reset Successful";
    
    $message = '
    <html>
    <head>
    <title>Welcome to Commu Pro | Your community app</title>
    </head>
    <body>
 <div>
		
		<span style="display:none;font-size:0px;line-height:0px;max-height:0px;max-width:0px;overflow:hidden">*|MC_PREVIEW_TEXT|*</span>
		
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
                        
                            <span style="color:#009999"><span style="font-size:28px"><span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif">Password Reset Successful</span></span></span>
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
                    <tbody><tr>
                        
                        <td valign="top" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px">
                        
                            <br>
<span style="font-size:14px"><span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif">Your password has been reset successfully!<br>
<br>
Commu Pro is your very own community app.</span></span><br>
 
                        </td>
                    </tr>
                </tbody></table>
				
                
				
            </td>
        </tr>
    </tbody>
</table><table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%">
    <tbody>
        <tr>
            <td valign="top" style="padding-top:9px">
              	
			    
				
                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%;min-width:100%" width="100%">
                    <tbody><tr>
                        
                        <td valign="top" style="padding-top:0;padding-right:18px;padding-bottom:9px;padding-left:18px">
                        
                            <span style="font-family:open sans,helvetica neue,helvetica,arial,sans-serif">Commu Pro | Crafted with <span style="color:#800080">❤</span> in India</span>
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

</body></html>
    ';
    
    // Always set content-type when sending HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

    // More headers
    $headers .= 'From: <no-reply@commupro.com>' . "\r\n";
    mail($to,$subject,$message,$headers);
	
	$response['message'] = "Password reset successful";
	$response['flag'] = 1;	
} else {
	$response['message'] = "Please try again";
	$response['flag'] = 0;
}

echo json_encode($response);

$conn->close();
?>