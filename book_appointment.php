<?php
header('Content-Type: application/json');
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get and sanitize input data
    $client_name = sanitize_input($_POST['client_name']);
    $address = sanitize_input($_POST['address']);
    $phone = sanitize_input($_POST['phone']);
    $car_license = sanitize_input($_POST['car_license']);
    $car_engine = sanitize_input($_POST['car_engine']);
    $appointment_date = sanitize_input($_POST['appointment_date']);
    $mechanic_id = intval($_POST['mechanic_id']);
    $car_issue = sanitize_input($_POST['car_issue'] ?? '');
    
    $errors = [];
    
    // Validation
    if (empty($client_name) || strlen($client_name) < 2) {
        $errors[] = "Name is required and must be at least 2 characters";
    }
    
    if (empty($address) || strlen($address) < 10) {
        $errors[] = "Please provide a complete address";
    }
    
    if (empty($phone) || !validate_phone($phone)) {
        $errors[] = "Please enter a valid phone number";
    }
    
    if (empty($car_license)) {
        $errors[] = "Car license number is required";
    }
    
    if (empty($car_engine) || !preg_match('/^[a-zA-Z0-9]+$/', $car_engine)) {
        $errors[] = "Car engine number is required and should only contain letters and numbers";
    }
    
    if (empty($appointment_date) || !validate_date($appointment_date)) {
        $errors[] = "Please select a valid future date";
    }
    
    if (is_sunday($appointment_date)) {
        $errors[] = "Workshop is closed on Sundays";
    }
    
    if (empty($mechanic_id)) {
        $errors[] = "Please select a mechanic";
    }
    
    // Check if mechanic exists
    $mechanic_check = $conn->prepare("SELECT id, name FROM mechanics WHERE id = ?");
    $mechanic_check->bind_param("i", $mechanic_id);
    $mechanic_check->execute();
    $mechanic_result = $mechanic_check->get_result();
    
    if ($mechanic_result->num_rows == 0) {
        $errors[] = "Selected mechanic does not exist";
    } else {
        $mechanic_data = $mechanic_result->fetch_assoc();
        $mechanic_name = $mechanic_data['name'];
    }
    
    // Check if client already has appointment on this date
    if (!empty($appointment_date)) {
        $duplicate_check = $conn->prepare("SELECT id FROM appointments WHERE phone = ? AND appointment_date = ? AND status != 'cancelled'");
        $duplicate_check->bind_param("ss", $phone, $appointment_date);
        $duplicate_check->execute();
        $duplicate_result = $duplicate_check->get_result();
        
        if ($duplicate_result->num_rows > 0) {
            $errors[] = "You already have an appointment booked for this date";
        }
    }
    
    // Check mechanic availability (max 4 appointments per day)
    if (!empty($appointment_date) && !empty($mechanic_id)) {
        $availability_check = $conn->prepare("SELECT COUNT(*) as count FROM appointments WHERE mechanic_id = ? AND appointment_date = ? AND status != 'cancelled'");
        $availability_check->bind_param("is", $mechanic_id, $appointment_date);
        $availability_check->execute();
        $availability_result = $availability_check->get_result();
        $availability_data = $availability_result->fetch_assoc();
        
        if ($availability_data['count'] >= 4) {
            $errors[] = "Selected mechanic is fully booked for this date. Please choose another mechanic or date";
        }
    }
    
    // If there are errors, return them
    if (!empty($errors)) {
        echo json_encode([
            'success' => false,
            'errors' => $errors
        ]);
        exit;
    }
    
    // Insert appointment
    $insert_stmt = $conn->prepare("INSERT INTO appointments (client_name, address, phone, car_license, car_engine, appointment_date, mechanic_id, car_issue, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', NOW())");
    $insert_stmt->bind_param("ssssssiss", $client_name, $address, $phone, $car_license, $car_engine, $appointment_date, $mechanic_id, $car_issue);
    
    if ($insert_stmt->execute()) {
        $appointment_id = $conn->insert_id;
        
        echo json_encode([
            'success' => true,
            'message' => 'Appointment booked successfully!',
            'appointment_id' => $appointment_id,
            'appointment_date' => $appointment_date,
            'mechanic_name' => $mechanic_name
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'errors' => ['Failed to book appointment. Please try again.']
        ]);
    }
    
    $insert_stmt->close();
    
} else {
    echo json_encode([
        'success' => false,
        'errors' => ['Invalid request method']
    ]);
}

$conn->close();
?>