
<?php

require_once "../config/db.php";
require_once "../config/response.php";

header('Content-Type: application/json');

try {
    $con = getDB();
    if (!$con) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "SELECT id,name FROM countries ORDER BY name";
    $result = mysqli_query($con, $query);
    $all_countries = mysqli_fetch_all($result, MYSQLI_ASSOC);

    jsonSuccess(["data" => $all_countries], "Countries data retrive successfully");
} catch (Exception $e) {
    jsonError("Server error", ["error" => $e->getMessage()], 500);
}
?>