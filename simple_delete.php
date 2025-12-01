<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo '{"success": false, "error": "Invalid request method"}';
    exit;
}

$conn = new mysqli("sql100.infinityfree.com", "if0_40567257", "pNDYHILdSiTJ", "if0_40567257_car_workshop");

if ($conn->connect_error) {
    echo '{"success": false, "error": "Connection failed"}';
    exit;
}

$id = intval($_POST['appointment_id']);

if (empty($id)) {
    echo '{"success": false, "error": "Invalid appointment ID"}';
    exit;
}

$sql = "DELETE FROM appointments WHERE id = $id";

if ($conn->query($sql) === TRUE) {
    if ($conn->affected_rows > 0) {
        echo '{"success": true, "message": "Appointment deleted successfully"}';
    } else {
        echo '{"success": false, "error": "No appointment found with that ID"}';
    }
} else {
    echo '{"success": false, "error": "Database delete failed"}';
}

$conn->close();
?>