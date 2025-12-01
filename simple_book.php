<?php
// Simple appointment booking for InfinityFree
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Simple database connection for InfinityFree
$servername = "sql100.infinityfree.com";
$username = "if0_40567257";
$password = "pNDYHILdSiTJ";
$dbname = "if0_40567257_car_workshop";

// Simple connection with minimal overhead
$conn = @new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'errors' => ['Database connection failed: ' . $conn->connect_error]
    ]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $client_name = trim($_POST['client_name'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $car_license = trim($_POST['car_license'] ?? '');
    $car_engine = trim($_POST['car_engine'] ?? '');
    $appointment_date = trim($_POST['appointment_date'] ?? '');
    $mechanic_id = intval($_POST['mechanic_id'] ?? 0);
    $car_issue = trim($_POST['car_issue'] ?? '');
    
    $errors = [];
    
    // Basic validation
    if (empty($client_name)) $errors[] = "Name is required";
    if (empty($address)) $errors[] = "Address is required";
    if (empty($phone)) $errors[] = "Phone is required";
    if (empty($car_license)) $errors[] = "Car license is required";
    if (empty($car_engine)) $errors[] = "Car engine number is required";
    if (empty($appointment_date)) $errors[] = "Appointment date is required";
    if (empty($mechanic_id)) $errors[] = "Please select a mechanic";
    
    // Check if date is not in the past
    if (!empty($appointment_date)) {
        $selected_date = new DateTime($appointment_date);
        $today = new DateTime();
        if ($selected_date < $today) {
            $errors[] = "Cannot book appointments for past dates";
        }
        
        // Check if Sunday
        if ($selected_date->format('w') == 0) {
            $errors[] = "Workshop is closed on Sundays";
        }
    }
    
    if (!empty($errors)) {
        echo json_encode([
            'success' => false,
            'errors' => $errors
        ]);
        exit;
    }
    
    // Simple INSERT without complex checks (for InfinityFree compatibility)
    $sql = "INSERT INTO appointments (client_name, address, phone, car_license, car_engine, appointment_date, mechanic_id, car_issue, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'scheduled')";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode([
            'success' => false,
            'errors' => ['Database prepare error: ' . $conn->error]
        ]);
        exit;
    }
    
    $stmt->bind_param("sssssis", $client_name, $address, $phone, $car_license, $car_engine, $appointment_date, $mechanic_id, $car_issue);
    
    if ($stmt->execute()) {
        $appointment_id = $conn->insert_id;
        echo json_encode([
            'success' => true,
            'message' => 'Appointment booked successfully!',
            'appointment_id' => $appointment_id
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'errors' => ['Failed to book appointment: ' . $stmt->error]
        ]);
    }
    
    $stmt->close();
    
} else {
    echo json_encode([
        'success' => false,
        'errors' => ['Invalid request method']
    ]);
}

$conn->close();
?>