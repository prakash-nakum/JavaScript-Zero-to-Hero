<?php

require_once "config/db.php";

ini_set('memory_limit', '512M');
set_time_limit(0);


$conn =  getDB();
$conn->set_charset("utf8mb4");

$json = file_get_contents("countries.json");
$data = json_decode($json, true);

$conn->begin_transaction();

try {

    foreach ($data as $country) {

        $stmt = $conn->prepare("
        INSERT INTO countries
        (id,name,iso2,iso3,phonecode,capital,currency,region,latitude,longitude)
        VALUES (?,?,?,?,?,?,?,?,?,?)
    ");

        $stmt->bind_param(
            "issssssdds",
            $country['id'],
            $country['name'],
            $country['iso2'],
            $country['iso3'],
            $country['phonecode'],
            $country['capital'],
            $country['currency'],
            $country['region'],
            $country['latitude'],
            $country['longitude']
        );

        $stmt->execute();

        foreach ($country['states'] as $state) {

            $stmt = $conn->prepare("
            INSERT INTO states
            (id,country_id,name,iso2,type,latitude,longitude)
            VALUES (?,?,?,?,?,?,?)
        ");

            $stmt->bind_param(
                "iisssdd",
                $state['id'],
                $country['id'],
                $state['name'],
                $state['iso2'],
                $state['type'],
                $state['latitude'],
                $state['longitude']
            );

            $stmt->execute();

            foreach ($state['cities'] as $city) {

                $stmt = $conn->prepare("
                INSERT INTO cities
                (id,state_id,name,latitude,longitude)
                VALUES (?,?,?,?,?)
            ");

                $stmt->bind_param(
                    "iisdd",
                    $city['id'],
                    $state['id'],
                    $city['name'],
                    $city['latitude'],
                    $city['longitude']
                );

                $stmt->execute();
            }
        }
    }

    $conn->commit();
    echo "ALL DATA IMPORTED SUCCESSFULLY";
} catch (Exception $e) {
    $conn->rollback();
    echo "ERROR: " . $e->getMessage();
}
