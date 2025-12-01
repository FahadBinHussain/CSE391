<?php
// Database Test Script for InfinityFree
header('Content-Type: text/html; charset=UTF-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Database Test - Car Workshop</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .success { color: green; background: #e8f5e8; padding: 10px; margin: 5px 0; border-radius: 5px; }
        .error { color: red; background: #ffe8e8; padding: 10px; margin: 5px 0; border-radius: 5px; }
        .info { color: blue; background: #e8f0ff; padding: 10px; margin: 5px 0; border-radius: 5px; }
        table { border-collapse: collapse; width: 100%; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>

<h2>InfinityFree Database Connection Test</h2>

<?php
// Include configuration
include 'config.php';

echo "<div class='success'>✓ Config.php loaded successfully</div>";

// Test 1: Basic Connection
echo "<h3>Test 1: Database Connection</h3>";
try {
    if ($conn->ping()) {
        echo "<div class='success'>✓ Database connection is active</div>";
        echo "<div class='info'>Connected to: {$dbname} on {$servername}</div>";
    } else {
        echo "<div class='error'>✗ Database connection failed</div>";
    }
} catch (Exception $e) {
    echo "<div class='error'>✗ Connection error: " . $e->getMessage() . "</div>";
}

// Test 2: Check if database exists and is accessible
echo "<h3>Test 2: Database Access</h3>";
try {
    $result = $conn->query("SELECT DATABASE() as current_db");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "<div class='success'>✓ Current database: " . $row['current_db'] . "</div>";
    }
} catch (Exception $e) {
    echo "<div class='error'>✗ Database access error: " . $e->getMessage() . "</div>";
}

// Test 3: Check if tables exist
echo "<h3>Test 3: Table Structure</h3>";
$tables = ['mechanics', 'appointments'];

foreach ($tables as $table) {
    try {
        $result = $conn->query("SHOW TABLES LIKE '$table'");
        if ($result && $result->num_rows > 0) {
            echo "<div class='success'>✓ Table '$table' exists</div>";
            
            // Show table structure
            $structure = $conn->query("DESCRIBE $table");
            if ($structure) {
                echo "<h4>Structure of $table:</h4>";
                echo "<table>";
                echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
                while ($field = $structure->fetch_assoc()) {
                    echo "<tr>";
                    echo "<td>{$field['Field']}</td>";
                    echo "<td>{$field['Type']}</td>";
                    echo "<td>{$field['Null']}</td>";
                    echo "<td>{$field['Key']}</td>";
                    echo "<td>{$field['Default']}</td>";
                    echo "<td>{$field['Extra']}</td>";
                    echo "</tr>";
                }
                echo "</table>";
            }
        } else {
            echo "<div class='error'>✗ Table '$table' does not exist</div>";
            
            // Show available tables
            $all_tables = $conn->query("SHOW TABLES");
            if ($all_tables && $all_tables->num_rows > 0) {
                echo "<div class='info'>Available tables: ";
                $tables_list = [];
                while ($row = $all_tables->fetch_array()) {
                    $tables_list[] = $row[0];
                }
                echo implode(", ", $tables_list) . "</div>";
            } else {
                echo "<div class='error'>No tables found in database</div>";
            }
        }
    } catch (Exception $e) {
        echo "<div class='error'>✗ Error checking table '$table': " . $e->getMessage() . "</div>";
    }
}

// Test 4: Check mechanics data
echo "<h3>Test 4: Sample Data</h3>";
try {
    $result = $conn->query("SELECT COUNT(*) as count FROM mechanics");
    if ($result) {
        $row = $result->fetch_assoc();
        if ($row['count'] > 0) {
            echo "<div class='success'>✓ Mechanics table has {$row['count']} records</div>";
            
            // Show mechanics
            $mechanics = $conn->query("SELECT * FROM mechanics LIMIT 5");
            if ($mechanics) {
                echo "<h4>Mechanics:</h4>";
                echo "<table>";
                echo "<tr><th>ID</th><th>Name</th><th>Specialization</th><th>Phone</th></tr>";
                while ($mechanic = $mechanics->fetch_assoc()) {
                    echo "<tr>";
                    echo "<td>{$mechanic['id']}</td>";
                    echo "<td>{$mechanic['name']}</td>";
                    echo "<td>{$mechanic['specialization']}</td>";
                    echo "<td>{$mechanic['phone']}</td>";
                    echo "</tr>";
                }
                echo "</table>";
            }
        } else {
            echo "<div class='error'>✗ No mechanics found in database</div>";
        }
    }
} catch (Exception $e) {
    echo "<div class='error'>✗ Error checking mechanics: " . $e->getMessage() . "</div>";
}

// Test 5: Check appointments data
try {
    $result = $conn->query("SELECT COUNT(*) as count FROM appointments");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "<div class='info'>Appointments table has {$row['count']} records</div>";
        
        if ($row['count'] > 0) {
            // Show recent appointments
            $appointments = $conn->query("SELECT * FROM appointments ORDER BY created_at DESC LIMIT 5");
            if ($appointments) {
                echo "<h4>Recent Appointments:</h4>";
                echo "<table>";
                echo "<tr><th>ID</th><th>Client Name</th><th>Phone</th><th>Car License</th><th>Date</th><th>Mechanic ID</th><th>Status</th></tr>";
                while ($apt = $appointments->fetch_assoc()) {
                    echo "<tr>";
                    echo "<td>{$apt['id']}</td>";
                    echo "<td>{$apt['client_name']}</td>";
                    echo "<td>{$apt['phone']}</td>";
                    echo "<td>{$apt['car_license']}</td>";
                    echo "<td>{$apt['appointment_date']}</td>";
                    echo "<td>{$apt['mechanic_id']}</td>";
                    echo "<td>{$apt['status']}</td>";
                    echo "</tr>";
                }
                echo "</table>";
            }
        }
    }
} catch (Exception $e) {
    echo "<div class='error'>✗ Error checking appointments: " . $e->getMessage() . "</div>";
}

// Test 6: Test INSERT operation
echo "<h3>Test 6: INSERT Test</h3>";
try {
    // Try to insert a test record
    $test_stmt = $conn->prepare("INSERT INTO appointments (client_name, address, phone, car_license, car_engine, appointment_date, mechanic_id, car_issue, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    if ($test_stmt) {
        $test_name = "Test Client " . date('Y-m-d H:i:s');
        $test_address = "123 Test Street";
        $test_phone = "555-0000";
        $test_license = "TEST123";
        $test_engine = "ENG000";
        $test_date = date('Y-m-d', strtotime('+1 day'));
        $test_mechanic = 1;
        $test_issue = "Test appointment";
        $test_status = "scheduled";
        
        $test_stmt->bind_param("ssssssiss", $test_name, $test_address, $test_phone, $test_license, $test_engine, $test_date, $test_mechanic, $test_issue, $test_status);
        
        if ($test_stmt->execute()) {
            $test_id = $conn->insert_id;
            echo "<div class='success'>✓ Test appointment created successfully (ID: $test_id)</div>";
            
            // Clean up test record
            $conn->query("DELETE FROM appointments WHERE id = $test_id");
            echo "<div class='info'>Test record cleaned up</div>";
        } else {
            echo "<div class='error'>✗ INSERT failed: " . $test_stmt->error . "</div>";
        }
        
        $test_stmt->close();
    } else {
        echo "<div class='error'>✗ Could not prepare INSERT statement: " . $conn->error . "</div>";
    }
} catch (Exception $e) {
    echo "<div class='error'>✗ INSERT test error: " . $e->getMessage() . "</div>";
}

// Test 7: PHP Configuration
echo "<h3>Test 7: PHP Configuration</h3>";
echo "<div class='info'>PHP Version: " . phpversion() . "</div>";
echo "<div class='info'>MySQL Extension: " . (extension_loaded('mysqli') ? 'Loaded' : 'Not Loaded') . "</div>";
echo "<div class='info'>Error Reporting: " . (ini_get('display_errors') ? 'Enabled' : 'Disabled') . "</div>";

$conn->close();
?>

<hr>
<p><strong>Troubleshooting Tips for InfinityFree:</strong></p>
<ul>
    <li>Make sure you've created the database tables using the SQL script in your cPanel</li>
    <li>Check that your database credentials are correct in config.php</li>
    <li>Ensure your domain is properly configured to point to your InfinityFree account</li>
    <li>InfinityFree may have restrictions on certain MySQL functions</li>
    <li>Check the error logs in your cPanel for more details</li>
</ul>

</body>
</html>