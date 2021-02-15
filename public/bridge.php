<?php

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, base64_decode($_REQUEST['URL']));
if($_REQUEST['method']=="POST"){
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, base64_decode($_REQUEST['post']));
}

curl_setopt($ch, CURLOPT_RETURNTRANSFER,true);

$server_output = curl_exec($ch);
switch($code = curl_getinfo($ch, CURLINFO_HTTP_CODE)){
    case 200:
        break;
    default:
        http_response_code(404);
        die("Bridge;;fail");
        break;
}
curl_close($ch);

die($server_output);

?>
