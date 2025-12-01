<?php
// Database configuration
$servername = "YOUR_DB_HOST";
$username = "YOUR_DB_USERNAME";
$password = "YOUR_DB_PASSWORD";
$dbname = "YOUR_DB_NAME";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset
$conn->set_charset("utf8");

// Function to sanitize input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate phone number
function validate_phone($phone) {
    return preg_match('/^\+?[\d\s\-\(\)]{10,}$/', $phone);
}

// Function to validate date
function validate_date($date) {
    $d = DateTime::createFromFormat('Y-m-d', $date);
    return $d && $d->format('Y-m-d') === $date && $d >= new DateTime('today');
}

// Function to check if date is Sunday (workshop closed)
function is_sunday($date) {
    $d = new DateTime($date);
    return $d->format('w') == 0; // 0 = Sunday
}
?>