<?php
function validate($data, $rules)
{
    foreach ($rules as $field => $ruleSet) {

        $value = trim($data[$field] ?? "");
        foreach ($ruleSet as $rule => $ruleValue) {

            if ($rule === "required" && $ruleValue && $value === "") {
                jsonError("$field is required", null, 422);
            }
            if (
                $rule === "email" && $ruleValue &&
                !filter_var($value, FILTER_VALIDATE_EMAIL)
            ) {
                jsonError("Invalid email", null, 422);
            }
            if (
                $rule === "url" && $ruleValue &&
                !filter_var($value, FILTER_VALIDATE_URL)
            ) {
                jsonError("Invalid URL", null, 422);
            }

            if ($rule === "min" && strlen($value) < $ruleValue) {
                jsonError("$field must be at least $ruleValue characters", null, 422);
            }

            if ($rule === "max" && strlen($value) > $ruleValue) {
                jsonError("$field must be lessthen $ruleValue characters", null, 422);
            }

            if ($rule === "match" && $value !== ($data[$ruleValue] ?? "")) {
                jsonError("$field does not match $ruleValue", null, 422);
            }



            if ($rule === "integer") {
                $data = json_decode($value, true);
                if (!is_array($data)) {
                    jsonError("$field must be a valid JSON array", null, 422);
                }
                foreach ($data as $index => $item) {
                    if (!isset($item['members']) || !filter_var($item['members'], FILTER_VALIDATE_INT)) {
                        jsonError("members must be an integer at index $index", null, 422);
                    }
                    if (!isset($item['percentage']) || !filter_var($item['percentage'], FILTER_VALIDATE_INT)) {
                        jsonError("percentage must be an integer at index $index", null, 422);
                    }
                }
            }
        }
    }
}
