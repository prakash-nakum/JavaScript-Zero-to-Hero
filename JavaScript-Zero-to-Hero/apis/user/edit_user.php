
<?php

require_once "../config/db.php";
require_once "../config/response.php";
require_once "../config/validate.php";


$con = getDB();

if (!$con) {
    die("Connection failed!" . mysqli_connect_error());
}

$id = $_GET['id'] ?? "";

if (!$id) {
    jsonError("Missing id", mysqli_error($con));
}

$checkQuery = "SELECT user_id FROM Example10 WHERE user_id = '$id'";
$checkResult = mysqli_query($con, $checkQuery);

if (mysqli_num_rows($checkResult) == 0) {
    jsonError("User not found", mysqli_error($con));
}


$put_data = file_get_contents("php://input");
$data = json_decode($put_data, true);


$name = $data['name'];
$url = $data['url'];
$funnel = $data['funnel'];
$email = $data['email'];
$user_password = $data['password'];
$user_confirpassword = $data['confirmpassword'];
$user = $data['user'];


validate($data, [

    "name" => [
        "required" => false,
        "min" => 3,
        "max" => 50
    ],

    "url" => [
        "required" => false,
        "url" => true
    ],

    "funnel" => [
        "required" => false
    ],

    "email" => [
        "required" => false,
        "email" => true
    ],

    "password" => [
        "required" => false,
        "min" => 6
    ],

    "confirmpassword" => [
        "required" => true,
        "match" => "password"
    ],

    "user" => [
        "required" => false
    ]
]);




if (gettype($data) != "array") {
    jsonError("Invalide data format", mysqli_error($con));
}

try {
    $query = "UPDATE Example10 SET  name='$name' , url='$url' , funnel='$funnel', email='$email' , password ='$user_password' , confirmpassword ='$user_confirpassword' , user='$user' WHERE user_id='$id'";
    $result = mysqli_query($con, $query);

    if ($result) {
        jsonSuccess(["id" => $id], "User updated successfully");
    } else {
        jsonError("Something wrong", mysqli_error($con));
    }
    mysqli_close($con);
} catch (Exception $e) {
    echo mysqli_error($con);
    throw $con;
}
?>
