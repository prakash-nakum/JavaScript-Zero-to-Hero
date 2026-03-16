
<?php

require_once "../config/db.php";
require_once "../config/response.php";

header('Content-Type: application/json');

try {
  $con = getDB();
  if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
  }

  $query = "SELECT * FROM Example10";

  $result = mysqli_query($con, $query);

  $all_rows =   $result->fetch_all(MYSQLI_ASSOC);

  if (mysqli_num_rows($checkResult) == 0) {
    jsonSuccess(["data" => null], "Users not found ");
  }

  jsonSuccess(["data" => $all_rows], "Users data retrive successfully");
} catch (Exception $e) {
  jsonError("Server error", ["error" => $e->getMessage()], 500);
}


?>