<?php

session_start();

$user = $_SESSION['user'];

// SELECT record from userTable where username=santizedUserName

// hardcode
if ($user == 'admin') {
    echo '{
        "message": "this is a secret message only for administrator",
        "success": true  
    }';
}else {
    echo '{
        "message": "who the f ar ya",
        "success": false
    }';
}

?>