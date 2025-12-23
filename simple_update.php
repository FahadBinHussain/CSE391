<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo '{"success": false, "error": "Invalid request method"}';
    exit;
}

$conn = new mysqli("localhost", "root", "", "car_workshop");

if ($conn->connect_error) {
    echo '{"success": false, "error": "Connection failed"}';
    exit;
}

$id = intval($_POST['appointment_id']);
$date = $conn->real_escape_string($_POST['appointment_date']);
$mechanic_id = intval($_POST['mechanic_id']);
$status = $conn->real_escape_string($_POST['status']);

if (empty($id) || empty($date) || empty($mechanic_id) || empty($status)) {
    echo '{"success": false, "error": "Missing required fields"}';
    exit;
}

$valid_statuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
if (!in_array($status, $valid_statuses)) {
    echo '{"success": false, "error": "Invalid status"}';
    exit;
}

$sql = "UPDATE appointments SET appointment_date = '$date', mechanic_id = $mechanic_id, status = '$status' WHERE id = $id";

if ($conn->query($sql) === TRUE) {
    if ($conn->affected_rows > 0) {
        echo '{"success": true, "message": "Appointment updated successfully"}';
    } else {
        echo '{"success": false, "error": "No appointment found with that ID"}';
    }
} else {
    echo '{"success": false, "error": "Database update failed"}';
}

$conn->close();
?>