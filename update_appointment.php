<?php
header('Content-Type: application/json');
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $appointment_id = intval($_POST['appointment_id']);
    $appointment_date = sanitize_input($_POST['appointment_date']);
    $mechanic_id = intval($_POST['mechanic_id']);
    $status = sanitize_input($_POST['status']);
    
    $errors = [];
    
    // Validation
    if (empty($appointment_id)) {
        $errors[] = "Invalid appointment ID";
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
    
    $valid_statuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
    if (empty($status) || !in_array($status, $valid_statuses)) {
        $errors[] = "Invalid status";
    }
    
    // Check if appointment exists
    $appointment_check = $conn->prepare("SELECT id, mechanic_id, appointment_date FROM appointments WHERE id = ?");
    $appointment_check->bind_param("i", $appointment_id);
    $appointment_check->execute();
    $appointment_result = $appointment_check->get_result();
    
    if ($appointment_result->num_rows == 0) {
        $errors[] = "Appointment not found";
    } else {
        $current_appointment = $appointment_result->fetch_assoc();
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
    }
    
    // Check mechanic availability if date or mechanic changed
    if ((!empty($current_appointment)) && 
        ($current_appointment['mechanic_id'] != $mechanic_id || $current_appointment['appointment_date'] != $appointment_date)) {
        
        $availability_check = $conn->prepare("SELECT COUNT(*) as count FROM appointments WHERE mechanic_id = ? AND appointment_date = ? AND status != 'cancelled' AND id != ?");
        $availability_check->bind_param("isi", $mechanic_id, $appointment_date, $appointment_id);
        $availability_check->execute();
        $availability_result = $availability_check->get_result();
        $availability_data = $availability_result->fetch_assoc();
        
        if ($availability_data['count'] >= 4) {
            $errors[] = "Selected mechanic is fully booked for this date";
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
    
    // Update appointment
    $update_stmt = $conn->prepare("UPDATE appointments SET appointment_date = ?, mechanic_id = ?, status = ?, updated_at = NOW() WHERE id = ?");
    $update_stmt->bind_param("sisi", $appointment_date, $mechanic_id, $status, $appointment_id);
    
    if ($update_stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Appointment updated successfully!',
            'appointment_id' => $appointment_id
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'errors' => ['Failed to update appointment. Please try again.']
        ]);
    }
    
    $update_stmt->close();
    
} else {
    echo json_encode([
        'success' => false,
        'errors' => ['Invalid request method']
    ]);
}

$conn->close();
?>