<?php
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "car_workshop");

if ($conn->connect_error) {
    echo '{"success": false, "error": "Connection failed"}';
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($_SERVER["REQUEST_METHOD"] == "POST" && $action == 'set') {

    $summation_value = intval($_POST['summation_value']);
    $discount_percentage = floatval($_POST['discount_percentage']);
    $valid_date = $conn->real_escape_string($_POST['valid_date']);
    
    if (empty($summation_value) || empty($discount_percentage) || empty($valid_date)) {
        echo '{"success": false, "error": "Missing required fields"}';
        exit;
    }
    
    if ($summation_value < 0 || $summation_value > 45) {
        echo '{"success": false, "error": "Summation value must be between 0 and 45"}';
        exit;
    }
    
    if ($discount_percentage < 1 || $discount_percentage > 100) {
        echo '{"success": false, "error": "Discount percentage must be between 1 and 100"}';
        exit;
    }
    
    $sql = "INSERT INTO discount_rules (summation_value, discount_percentage, valid_date) 
            VALUES ($summation_value, $discount_percentage, '$valid_date')
            ON DUPLICATE KEY UPDATE 
            summation_value = $summation_value, 
            discount_percentage = $discount_percentage";
    
    if ($conn->query($sql) === TRUE) {
        echo '{"success": true, "message": "Discount rule set successfully"}';
    } else {
        echo '{"success": false, "error": "Failed to set discount rule"}';
    }
    
} elseif ($_SERVER["REQUEST_METHOD"] == "GET" && $action == 'list') {
    $sql = "SELECT * FROM discount_rules ORDER BY valid_date DESC";
    $result = $conn->query($sql);
    
    if ($result) {
        $discounts = array();
        while ($row = $result->fetch_assoc()) {
            $discounts[] = array(
                'id' => $row['id'],
                'summation_value' => $row['summation_value'],
                'discount_percentage' => $row['discount_percentage'],
                'valid_date' => $row['valid_date'],
                'created_at' => $row['created_at']
            );
        }
        echo json_encode(array('success' => true, 'discounts' => $discounts));
    } else {
        echo '{"success": false, "error": "Failed to fetch discount rules"}';
    }
    
} elseif ($_SERVER["REQUEST_METHOD"] == "GET" && $action == 'check') {
    $date = $conn->real_escape_string($_GET['date']);
    
    $sql = "SELECT * FROM discount_rules WHERE valid_date = '$date' LIMIT 1";
    $result = $conn->query($sql);
    
    if ($result && $result->num_rows > 0) {
        $discount = $result->fetch_assoc();
        echo json_encode(array(
            'success' => true,
            'has_discount' => true,
            'summation_value' => $discount['summation_value'],
            'discount_percentage' => $discount['discount_percentage']
        ));
    } else {
        echo '{"success": true, "has_discount": false}';
    }
    
} elseif ($_SERVER["REQUEST_METHOD"] == "POST" && $action == 'delete') {
    $id = intval($_POST['id']);
    
    $sql = "DELETE FROM discount_rules WHERE id = $id";
    
    if ($conn->query($sql) === TRUE) {
        echo '{"success": true, "message": "Discount rule deleted successfully"}';
    } else {
        echo '{"success": false, "error": "Failed to delete discount rule"}';
    }
    
} else {
    echo '{"success": false, "error": "Invalid action"}';
}

$conn->close();
?>
