<?php
// Ultra-simple appointment booking for InfinityFree
// Minimal code to avoid 500 errors

// Basic error handling
ini_set('display_errors', 0);
error_reporting(0);

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo '{"success": false, "errors": ["Invalid request"]}';
    exit;
}

// Database connection - basic version
$conn = new mysqli("sql100.infinityfree.com", "if0_40567257", "pNDYHILdSiTJ", "if0_40567257_car_workshop");

if ($conn->connect_error) {
    echo '{"success": false, "errors": ["Connection failed"]}';
    exit;
}

// Get data
$name = $conn->real_escape_string($_POST['client_name']);
$address = $conn->real_escape_string($_POST['address']);  
$phone = $conn->real_escape_string($_POST['phone']);
$license = $conn->real_escape_string($_POST['car_license']);
$engine = $conn->real_escape_string($_POST['car_engine']);
$date = $conn->real_escape_string($_POST['appointment_date']);
$mechanic = intval($_POST['mechanic_id']);
$issue = $conn->real_escape_string($_POST['car_issue']);

// Simple validation
if (empty($name) || empty($phone) || empty($date) || $mechanic == 0) {
    echo '{"success": false, "errors": ["Required fields missing"]}';
    exit;
}

// Simple insert
$sql = "INSERT INTO appointments (client_name, address, phone, car_license, car_engine, appointment_date, mechanic_id, car_issue, status) VALUES ('$name', '$address', '$phone', '$license', '$engine', '$date', $mechanic, '$issue', 'scheduled')";

if ($conn->query($sql) === TRUE) {
    $id = $conn->insert_id;
    echo '{"success": true, "message": "Appointment booked!", "appointment_id": ' . $id . '}';
} else {
    echo '{"success": false, "errors": ["Database error"]}';
}

$conn->close();
?>