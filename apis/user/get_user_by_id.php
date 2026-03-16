
<?php

require_once "../config/db.php";
require_once "../config/response.php";

header('Content-Type: application/json');
try {

  $con = getDB();

  $id = $_GET['id'];
  $query = "SELECT * FROM Example10 WHERE user_id = '$id'";
  $rs = mysqli_query($con, $query);

  if ($rs) {
    $row = $rs->fetch_assoc();
    jsonSuccess(["data" => $row], "User data retrive successfully");
  } else {
    jsonError("Something wrong", mysqli_error($con));
  }
} catch (Exception $e) {
  echo mysqli_error($con);
  throw $con;
}


?>