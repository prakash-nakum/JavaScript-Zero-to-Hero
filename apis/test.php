<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "./config/db.php";
require_once "./config/response.php";

$conn = getDB();

try {


  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }

  $json = file_get_contents("php://input");
  $data = json_decode($json, true);

  if ($data) {

    $stmt = $conn->prepare("INSERT INTO movies 
        (adult, backdrop_path, genre_ids,movie_id, original_language, original_title, overview,  popularity, poster_path, release_date, title, vote_average, vote_count) 
        VALUES (?, ?,?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?)");

    foreach ($data as $row) {

      $genre_ids = json_encode($row['genre_ids']);
      $adult = ($row['adult'] === "false") ? FALSE : TRUE;
      echo $row['adult'];
      $res = $stmt->execute([
        $adult,
        $row['backdrop_path'],
        $genre_ids,
        $row['id'],
        $row['original_language'],
        $row['original_title'],
        $row['overview'],
        $row['popularity'],
        $row['poster_path'],
        $row['release_date'],
        $row['title'],
        $row['vote_average'],
        $row['vote_count']
      ]);

      // $stmt->execute();
    }

    echo json_encode([
      "status" => "success",
      "message" => "Data inserted successfully"
    ]);
  }
} catch (Exception $e) {
  jsonError("Server error", $e->getMessage(), 500);
}
