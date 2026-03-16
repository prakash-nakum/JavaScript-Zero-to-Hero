<?php


require_once "../config/response.php";

error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');

$target_dir = "../uploads/";
$public_dir = "uploads/";
$filename = basename($_FILES["file"]["name"]);

$target_file = $target_dir . $filename;
$absolute_target_dir = $public_dir . $filename;

$uploadOk = 1;

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method == 'POST') {
        if (is_uploaded_file($_FILES["file"]["tmp_name"])) {
            $filename = $_FILES["file"]["tmp_name"];
            $mime_type = finfo_file(finfo_open(FILEINFO_MIME_TYPE), $filename);
        }

        if (file_exists($target_file)) {
            jsonError("Sorry, file already exists.", '', 409);
            $uploadOk = 0;
        }

        if ($uploadOk == 0) {
            jsonError("Sorry, your file was not uploaded.", '', 500);
        } else {
            if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {

                $data = [
                    "mimetype" =>  $mime_type,
                    "filePath" => $absolute_target_dir
                ];

                jsonSuccess($data, "The file has been uploaded.", 200);
            } else {
                jsonError("Sorry, there was an error uploading your file.", '', 500);
            }
        }
    }
} catch (Exception $e) {
    jsonError("Server error", $e->getMessage(), 500);
}
