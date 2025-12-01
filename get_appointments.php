<?php
header('Content-Type: application/json');
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $date_filter = isset($_GET['date']) ? sanitize_input($_GET['date']) : '';
    $mechanic_filter = isset($_GET['mechanic_id']) ? intval($_GET['mechanic_id']) : '';
    
    // Base query
    $sql = "SELECT a.*, m.name as mechanic_name 
            FROM appointments a 
            JOIN mechanics m ON a.mechanic_id = m.id 
            WHERE 1=1";
    
    $params = [];
    $types = "";
    
    // Add filters
    if (!empty($date_filter)) {
        $sql .= " AND a.appointment_date = ?";
        $params[] = $date_filter;
        $types .= "s";
    }
    
    if (!empty($mechanic_filter)) {
        $sql .= " AND a.mechanic_id = ?";
        $params[] = $mechanic_filter;
        $types .= "i";
    }
    
    $sql .= " ORDER BY a.appointment_date DESC, a.created_at DESC";
    
    $stmt = $conn->prepare($sql);
    
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $appointments = [];
    while ($row = $result->fetch_assoc()) {
        $appointments[] = $row;
    }
    
    // Get statistics
    $stats_sql = "SELECT 
                    COUNT(*) as total_appointments,
                    COUNT(CASE WHEN DATE(appointment_date) = CURDATE() THEN 1 END) as today_appointments,
                    COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as scheduled_appointments
                  FROM appointments";
    
    $stats_result = $conn->query($stats_sql);
    $stats = $stats_result->fetch_assoc();
    
    // Calculate available slots for today
    $today_booked_sql = "SELECT COUNT(*) as booked FROM appointments WHERE DATE(appointment_date) = CURDATE() AND status != 'cancelled'";
    $today_booked_result = $conn->query($today_booked_sql);
    $today_booked = $today_booked_result->fetch_assoc()['booked'];
    
    $total_slots = 20; // 5 mechanics × 4 slots
    $available_slots = max(0, $total_slots - $today_booked);
    
    echo json_encode([
        'success' => true,
        'appointments' => $appointments,
        'stats' => [
            'total_appointments' => $stats['total_appointments'],
            'today_appointments' => $stats['today_appointments'],
            'scheduled_appointments' => $stats['scheduled_appointments'],
            'available_slots' => $available_slots
        ]
    ]);
    
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Invalid request method'
    ]);
}

$conn->close();
?>