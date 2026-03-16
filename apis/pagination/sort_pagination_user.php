<?php


require_once "../config/db.php";
require_once "../config/response.php";

header('Content-Type: application/json');

try {

    $con = getDB();
    if (!$con) {
        die("DB connection failed: " . mysqli_connect_error());
    }

    // Get request parameters
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $searchQuery = isset($_GET['name']) ??  $_GET['name'] ?  $_GET['name'] : '';
    $perPage = isset($_GET['entries']) ?? $_GET['entries'] ? (int)$_GET['entries'] : 10;


    // sorting params (NEW)
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'name';
    $order = isset($_GET['order']) ? strtolower($_GET['order']) : 'asc';

    // whitelist columns (security)
    $allowedSort = ['name', 'email', 'funnel', 'url'];

    if (!in_array($sort, $allowedSort)) {
        $sort = 'name';
    }

    $order = $order === 'desc' ? 'DESC' : 'ASC';

    // Calculate starting limit
    $startFrom = ($page - 1) * $perPage;
    $searchQueryEsc = mysqli_real_escape_string($con, $searchQuery);

    // $sql = "SELECT * FROM Example10 WHERE name LIKE '%$searchQuery%' ORDER BY $sort $order";
    $sql = "SELECT * FROM Example10 WHERE deleted_at IS NULL AND name LIKE '%$searchQuery%' ORDER BY $sort $order";

    //total number of results 
    $totalResult = mysqli_query($con, $sql);
    $rowCount = $totalResult->num_rows;

    $pagesCount = ceil($rowCount / $perPage);

    // Add the LIMIT for pagination
    $sqlQueryWithLimit = $sql . " LIMIT $startFrom, $perPage";

    $results = mysqli_query($con, $sqlQueryWithLimit);
    $data = [];
    if ($results->num_rows > 0) {
        while ($row = mysqli_fetch_assoc($results)) {
            $data[] = $row;
        }
    }

    $response = [
        "pagination_data" => [
            "total_results" => $rowCount,
            "per_page" => $perPage,
            "current_page" => $page,
            "total_pages" => $pagesCount
        ],
        "data" => $data
    ];
    jsonSuccess($response, "pagination-data retrive successfully");
    mysqli_close($con);
} catch (Exception $e) {
    echo mysqli_error($con);
    throw $con;
}
