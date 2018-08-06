
<?php
 
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
//API Url
$url = 'http://localhost:6800/schedule.json';
 
$City = $request->City;
$Keyword = $request->Keyword;
$Project = $request->Project;
$Spider = $request->Spider;


$data = array('project' => $Project, 'spider' => $Spider, 'city'=> $City, 'keyword'=>$Keyword);

$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data)
    )
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

if ($result === FALSE) { /* Handle error */ }
var_dump($result);
?>