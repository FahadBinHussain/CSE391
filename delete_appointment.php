<?php
header('Content-Type: application/json');
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $appointment_id = intval($_POST['appointment_id']);
    
    if (empty($appointment_id)) {
        echo json_encode([
            'success' => false,
            'errors' => ['Invalid appointment ID']
        ]);
        exit;
    }
    
    // Check if appointment exists
    $appointment_check = $conn->prepare("SELECT id FROM appointments WHERE id = ?");
    $appointment_check->bind_param("i", $appointment_id);
    $appointment_check->execute();
    $result = $appointment_check->get_result();
    
    if ($result->num_rows == 0) {
        echo json_encode([
            'success' => false,
            'errors' => ['Appointment not found']
        ]);
        exit;
    }
    
    // Delete appointment
    $delete_stmt = $conn->prepare("DELETE FROM appointments WHERE id = ?");
    $delete_stmt->bind_param("i", $appointment_id);
    
    if ($delete_stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Appointment deleted successfully!'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'errors' => ['Failed to delete appointment. Please try again.']
        ]);
    }
    
    $delete_stmt->close();
    
} else {
    echo json_encode([
        'success' => false,
        'errors' => ['Invalid request method']
    ]);
}

$conn->close();
?>