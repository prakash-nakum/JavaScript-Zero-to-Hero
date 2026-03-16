<?php

$DB_HOST = "localhost";
$DB_USER = "root";
$DB_PASS = "root123";
$DB_NAME = "examples";

function getDB()
{
    global $DB_HOST, $DB_USER, $DB_PASS, $DB_NAME;

    $con = mysqli_connect($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);

    if (!$con) {
        jsonError("Database connection failed", mysqli_connect_error());
    }

    return $con;
}
