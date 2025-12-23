<?php
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "car_workshop");

if ($conn->connect_error) {
    echo '{"success": false, "error": "Connection failed"}';
    exit;
}

$sql = "SELECT a.*, m.name as mechanic_name 
        FROM appointments a 
        LEFT JOIN mechanics m ON a.mechanic_id = m.id 
        ORDER BY a.created_at DESC";

$result = $conn->query($sql);

if ($result) {
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
    
    $stats = array(
        'total_appointments' => count($appointments),
        'today_appointments' => 0,
        'available_slots' => 20
    );
    
    $today = date('Y-m-d');
    foreach ($appointments as $apt) {
        if ($apt['appointment_date'] == $today) {
            $stats['today_appointments']++;
        }
    }
    
    $stats['available_slots'] = 20 - $stats['today_appointments'];
    
    echo json_encode(array(
        'success' => true,
        'appointments' => $appointments,
        'stats' => $stats
    ));
    
} else {
    echo '{"success": false, "error": "Query failed"}';
}

$conn->close();
?>