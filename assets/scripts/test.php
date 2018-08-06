<?php
$param['project'] = 'n';
$param['spider'] = 'just_dial';
$param['city'] = 'Mumbai';
$param['keyword'] = 'Bike';

file_get_contents("http://localhost:6800/schedule.json".http_build_query_string($param));

?>