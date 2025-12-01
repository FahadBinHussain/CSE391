<?php
header('Content-Type: application/json');
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Get mechanics with their availability
    $mechanics_sql = "SELECT 
                        m.id, 
                        m.name, 
                        m.specialization,
                        COALESCE(a.appointment_count, 0) as today_appointments,
                        (4 - COALESCE(a.appointment_count, 0)) as available_slots
                      FROM mechanics m
                      LEFT JOIN (
                        SELECT 
                          mechanic_id, 
                          COUNT(*) as appointment_count
                        FROM appointments 
                        WHERE DATE(appointment_date) = CURDATE() 
                        AND status != 'cancelled'
                        GROUP BY mechanic_id
                      ) a ON m.id = a.mechanic_id
                      ORDER BY m.name";
    
    $result = $conn->query($mechanics_sql);
    
    $mechanics = [];
    while ($row = $result->fetch_assoc()) {
        $mechanics[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'mechanics' => $mechanics
    ]);
    
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Invalid request method'
    ]);
}

$conn->close();
?>