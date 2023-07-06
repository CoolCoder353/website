<?php
require_once 'csrf_token.php';  // <--- CSRF token class
require_once 'settings.php';    // <--- Settings
require_once 'validate_input.php'; // <--- Input validation
//require_once 'conn.php';    // <--- Database connection

if (!isset($_SESSION)) {
    session_start();
}
function send($conn, $file_path, $id = -1)
{


    // generate the csrf token
    $token = new csrf_token();

    // insert the token into the cookie
    $token->insert();

    $keywords = array(); // A list of kewords to replace

    $line = "";

    //add the data to the keywords
    $keywords = array(
        "%OTHER_PAGE_NAVBAR%" => file_get_contents("public/other_page_navbar.html"),
        "%HOME_PAGE_NAVBAR%" =>  file_get_contents("public/home_page_navbar.html"),
        "%DEPENDANCIES%" => file_get_contents("public/dependancies.html")
    );


    //open the file
    $file = fopen($file_path, "r");




    //Output lines until EOF is reached
    while (!feof($file)) {
        $line = fgets($file);

        $line = str_replace(array_keys($keywords), $keywords, $line);
        echo ($line);
    }
}


function recieve_post(): ?array
{

    if (!isset($_POST)) {
        return null;
    } //check if the user sent something

    $token = new csrf_token();
    if (!$token->verify()) {
        return null;
    } //check if the csrf token is valid

    //clean the input
    $clean_response = array();
    foreach ($_POST as $key => $value) {
        $clean_response[$key] = _cleaninjections($value);
    }
    return $clean_response;
}

function recieve_get(): ?array
{

    if (!isset($_GET)) {
        return null;
    } //check if the user sent something

    $token = new csrf_token();
    if (!$token->verify()) {
        return null;
    } //check if the csrf token is valid

    //clean the input
    $clean_response = array();
    foreach ($_GET as $key => $value) {
        $clean_response[$key] = _cleaninjections($value);
    }
    return $clean_response;
}
