<?php
require_once 'settings.php'; // <--- Settings

class csrf_token
{
    function __construct()
    {
        if (!isset($_SESSION)) {
            session_start();
        }
        if (empty($_SESSION['token'])) {
            $_SESSION['token'] = bin2hex(random_bytes(32));
        }
    }

    function verify()
    {

        if (!empty($_COOKIE) && !empty($_COOKIE['token'])) {

            if (hash_equals($_SESSION['token'], $_COOKIE['token'])) {

                return true;
            } else {

                return false;
            }
        } else {

            return false;
        }
    }

    function insert()
    {
        $cookie_expire_timestamp = time() + TIME_TILL_TOKEN_EXPIRES;
        setcookie("token", $_SESSION['token'], $cookie_expire_timestamp, "/", "", true, true);
    }
}
