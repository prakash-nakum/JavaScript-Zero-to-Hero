<?php

function jsonSuccess($data = [], $message = "Success", $code = 200)
{
    if (!headers_sent()) {
        http_response_code($code);
        header('Content-Type: application/json');
    }
    echo json_encode(
        [
            "success" => true,
            "message" => $message,
            ...$data
        ]
    );

    exit;
}


function jsonError($message = "Error", $payload = [], $code = 400)
{
    if (!headers_sent()) {
        http_response_code($code);
        header('Content-Type: application/json');
    }

    // make sure payload is array
    if (!is_array($payload)) {
        $payload = ["error" => $payload];
    }

    echo json_encode(array_merge([
        "success" => false,
        "message" => $message
    ], $payload));

    exit;
}
