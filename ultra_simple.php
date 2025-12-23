<?php
ini_set('display_errors', 0);
error_reporting(0);

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo '{"success": false, "errors": ["Invalid request"]}';
    exit;
}

$conn = new mysqli("localhost", "root", "", "car_workshop");

if ($conn->connect_error) {
    echo '{"success": false, "errors": ["Connection failed"]}';
    exit;
}

$name = $conn->real_escape_string($_POST['client_name']);
$address = $conn->real_escape_string($_POST['address']);  
$phone = $conn->real_escape_string($_POST['phone']);
$license = $conn->real_escape_string($_POST['car_license']);
$engine = $conn->real_escape_string($_POST['car_engine']);
$date = $conn->real_escape_string($_POST['appointment_date']);
$mechanic = intval($_POST['mechanic_id']);
$issue = $conn->real_escape_string($_POST['car_issue']);

if (empty($name) || empty($phone) || empty($date) || $mechanic == 0) {
    echo '{"success": false, "errors": ["Required fields missing"]}';
    exit;
}

$discount_applied = 0.00;
$discount_message = "";

$discount_sql = "SELECT * FROM discount_rules WHERE valid_date = '$date' LIMIT 1";
$discount_result = $conn->query($discount_sql);

if ($discount_result && $discount_result->num_rows > 0) {
    $discount_rule = $discount_result->fetch_assoc();
    $summation_value = $discount_rule['summation_value'];
    $discount_percentage = $discount_rule['discount_percentage'];
    
    $phone_digits = preg_replace('/[^0-9]/', '', $phone);
    if (strlen($phone_digits) >= 5) {
        $last_5_digits = substr($phone_digits, -5);
        $digit_sum = array_sum(str_split($last_5_digits));
        
        if ($digit_sum == $summation_value) {
            $discount_applied = $discount_percentage;
            $discount_message = "Congratulations! You have received " . $discount_percentage . "% discount";
        }
    }
}

$sql = "INSERT INTO appointments (client_name, address, phone, car_license, car_engine, appointment_date, mechanic_id, car_issue, status, discount_applied) VALUES ('$name', '$address', '$phone', '$license', '$engine', '$date', $mechanic, '$issue', 'scheduled', $discount_applied)";

if ($conn->query($sql) === TRUE) {
    $id = $conn->insert_id;
    
    $response = array(
        'success' => true,
        'message' => 'Appointment booked!',
        'appointment_id' => $id
    );
    
    if ($discount_applied > 0) {
        $response['discount_applied'] = $discount_applied;
        $response['discount_message'] = $discount_message;
    }
    
    echo json_encode($response);
} else {
    echo '{"success": false, "errors": ["Database error"]}';
}

$conn->close();
?>