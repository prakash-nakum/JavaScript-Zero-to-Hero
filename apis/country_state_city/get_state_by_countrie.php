<?php

require_once "../config/db.php";
require_once "../config/response.php";

header('Content-Type: application/json');

try {
    $con = getDB();
    $country_id = $_GET['country_id'];

    $query = "SELECT id,name FROM states WHERE  country_id = $country_id ORDER BY name";
    $result = mysqli_query($con, $query);
    $states = mysqli_fetch_all($result, MYSQLI_ASSOC);

    jsonSuccess(["data" => $states], "State data retrive successfully");
} catch (Exception $e) {
    jsonError("Server error", ["error" => $e->getMessage()], 500);
}
