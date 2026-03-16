<?php

require_once "../config/db.php";
require_once "../config/response.php";


try {

    $con = getDB();
    if (!$con) {
        die("DB connection failed: " . mysqli_connect_error());
    }

    $id = $_GET['id'] ?? "";

    if ($id == "") {
        jsonError("Missing id", mysqli_error($con));
    }


    $checkQuery = "SELECT user_id FROM Example10 WHERE user_id = '$id'";
    $checkResult = mysqli_query($con, $checkQuery);

    if (mysqli_num_rows($checkResult) == 0) {
        jsonError("User not found", mysqli_error($con));
    }

    $deleteQuery = "UPDATE Example10 SET deleted_at = CURRENT_TIMESTAMP  WHERE user_id = '$id' ";

    $deleteResult = mysqli_query($con, $deleteQuery);

    if ($deleteResult) {
        jsonSuccess(["id" => $id], "User Delete successfully");
    } else {
        jsonError("Something wrong", mysqli_error($con));
    }

    mysqli_close($con);
} catch (Exception $e) {
    echo mysqli_error($con);
    throw $con;
}
