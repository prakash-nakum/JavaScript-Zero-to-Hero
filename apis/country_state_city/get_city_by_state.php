<?php

require_once "../config/db.php";
require_once "../config/response.php";

header('Content-Type: application/json');

try {
    $con = getDB();
    $state_id = $_GET['state_id'];

    $query = "SELECT id,name FROM cities WHERE  state_id = $state_id ORDER BY name";
    $result = mysqli_query($con, $query);
    $states = mysqli_fetch_all($result, MYSQLI_ASSOC);

    jsonSuccess(["data" => $states], "City data retrive successfully");
} catch (Exception $e) {
    jsonError("Server error", ["error" => $e->getMessage()], 500);
}
