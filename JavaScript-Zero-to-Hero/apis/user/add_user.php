<?php

require_once "../config/db.php";
require_once "../config/response.php";
require_once "../config/validate.php";

$id = "id_" . uniqid();

$data = [
    "name" => $_POST['name'] ?? "",
    "url" => $_POST['url'] ?? "",
    "funnel" => $_POST['funnel'] ?? "",
    "email" => $_POST['email'] ?? "",
    "password" => $_POST['password'] ?? "",
    "confirmpassword" => $_POST['confirmpassword'] ?? "",
    "user" => $_POST['user'] ?? ""
];

validate($data, [

    "name" => [
        "required" => true,
        "min" => 3,
        "max" => 20
    ],

    "url" => [
        "required" => true,
        "url" => true
    ],

    "funnel" => [
        "required" => true
    ],

    "email" => [
        "required" => true,
        "email" => true
    ],

    "password" => [
        "required" => true,
        "min" => 6
    ],

    "confirmpassword" => [
        "required" => true,
        "match" => "password"
    ],

    "user" => [
        "required" => true,
        "integer" => true
    ]
]);

try {
    $con = getDB();
    $sql = $con->prepare("INSERT INTO Example10 
    (name, url, funnel, email, password, confirmpassword, user)
    VALUES (?, ?, ?, ?, ?, ?, ?)");
    $res = $sql->execute([$data['name'], $data['url'], $data['funnel'],  $data['email'],  $data['password'], $data['confirmpassword'], $data['user']]);
    if (!$res) {
        jsonError("Insert failed", mysqli_error($con));
    }
    $last_id = $con->insert_id;

    jsonSuccess(["id" => $last_id], "User added successfully");
    mysqli_close($con);
} catch (Exception $e) {
    jsonError("Server error", $e->getMessage(), 500);
}
