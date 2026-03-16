<?php
require_once "../config/db.php";
require_once "../config/response.php";


try {
    $con = getDB();

    $listA = $_POST['listA'];
    $listB = $_POST['listB'];

    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'POST') {
        $sql = $con->prepare("INSERT INTO dragdrop 
    (listA, listB)
    VALUES (?, ?)");

        $res = $sql->execute([$listA, $listB]);
        if (!$res) {
            jsonError("Insert failed", mysqli_error($con));
        }

        $last_id = $con->insert_id;

        jsonSuccess(["id" => $last_id], "Entry added successfully");
        mysqli_close($con);
    }
    if ($method === 'GET') {
        $id = $_GET['id'];
        $checkQuery = "SELECT * FROM dragdrop WHERE id = '$id'";
        $checkResult = mysqli_query($con, $checkQuery);

        if (mysqli_num_rows($checkResult) == 0) {
            jsonError("Data not found", mysqli_error($con));
        }
        if ($checkResult) {
            $row = $checkResult->fetch_assoc();
            jsonSuccess(["data" => $row], "Data retrive successfully");
        } else {
            jsonError("Something wrong", mysqli_error($con));
        }
    }
} catch (Exception $e) {
    jsonError("Server error", $e->getMessage(), 500);
}
