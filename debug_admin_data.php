<?php
// Debug version of admin data fetcher
header('Content-Type: application/json');

$debug = array();
$debug[] = "Starting admin data fetch...";

// Database connection
$conn = new mysqli("sql100.infinityfree.com", "if0_40567257", "pNDYHILdSiTJ", "if0_40567257_car_workshop");

if ($conn->connect_error) {
    echo json_encode(array(
        'success' => false, 
        'error' => 'Connection failed: ' . $conn->connect_error,
        'debug' => $debug
    ));
    exit;
}

$debug[] = "Database connected successfully";

// Get appointments with mechanic names
$sql = "SELECT a.*, m.name as mechanic_name 
        FROM appointments a 
        LEFT JOIN mechanics m ON a.mechanic_id = m.id 
        ORDER BY a.created_at DESC";

$debug[] = "Executing query: " . $sql;

$result = $conn->query($sql);

if ($result) {
    $debug[] = "Query executed successfully. Row count: " . $result->num_rows;
    
    $appointments = array();
    
    while ($row = $result->fetch_assoc()) {
        $appointments[] = array(
            'id' => $row['id'],
            'client_name' => $row['client_name'],
            'address' => $row['address'],
            'phone' => $row['phone'],
            'car_license' => $row['car_license'],
            'car_engine' => $row['car_engine'],
            'appointment_date' => $row['appointment_date'],
            'mechanic_id' => $row['mechanic_id'],
            'mechanic_name' => $row['mechanic_name'] ?? 'Unknown',
            'car_issue' => $row['car_issue'],
            'status' => $row['status'],
            'created_at' => $row['created_at']
        );
    }
    
    $debug[] = "Processed " . count($appointments) . " appointments";
    
    // Get stats
    $stats = array(
        'total_appointments' => count($appointments),
        'today_appointments' => 0,
        'available_slots' => 20
    );
    
    // Count today's appointments
    $today = date('Y-m-d');
    foreach ($appointments as $apt) {
        if ($apt['appointment_date'] == $today) {
            $stats['today_appointments']++;
        }
    }
    
    $stats['available_slots'] = 20 - $stats['today_appointments'];
    
    $debug[] = "Stats calculated: " . json_encode($stats);
    
    echo json_encode(array(
        'success' => true,
        'appointments' => $appointments,
        'stats' => $stats,
        'debug' => $debug
    ));
    
} else {
    $debug[] = "Query failed: " . $conn->error;
    echo json_encode(array(
        'success' => false, 
        'error' => 'Query failed: ' . $conn->error,
        'debug' => $debug
    ));
}

$conn->close();
?>