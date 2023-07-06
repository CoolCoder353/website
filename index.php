<?php
require_once "includes/main.php"; //<-- Main Functions

$data = recieve_get();
$conn = null;
//If we have been told to go somewhere specific
if (isset($data["location"]) && !empty($data["location"])) {
    if ($data["location"] == "troll") {
        send($conn, "public/troll.html");
    } else if ($data["location"] == "war") {
        send($conn, "public/war.html");
    } else if ($data["location"] == "other") {
        send($conn, "public/other.html");
    } else if ($data["location"] == "blob") {
        send($conn, "public/blob.html");
    } else {
        send($conn, "public/home.html");
    }
} else {
    send($conn, "public/home.html");
}
