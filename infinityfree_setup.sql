-- Simplified Database Setup for InfinityFree
-- Use this script in your cPanel MySQL area

-- Create mechanics table (simplified for InfinityFree)
CREATE TABLE IF NOT EXISTS mechanics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create appointments table (simplified for InfinityFree)
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    car_license VARCHAR(20) NOT NULL,
    car_engine VARCHAR(50) NOT NULL,
    appointment_date DATE NOT NULL,
    mechanic_id INT NOT NULL,
    car_issue TEXT,
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert mechanics data
INSERT INTO mechanics (name, specialization, phone, email) VALUES
('John Smith', 'Engine Specialist', '+1-234-567-8901', 'john.smith@workshop.com'),
('Sarah Johnson', 'Transmission Expert', '+1-234-567-8902', 'sarah.johnson@workshop.com'),
('Mike Wilson', 'Electrical Systems', '+1-234-567-8903', 'mike.wilson@workshop.com'),
('Lisa Brown', 'Brake Specialist', '+1-234-567-8904', 'lisa.brown@workshop.com'),
('David Lee', 'General Mechanic', '+1-234-567-8905', 'david.lee@workshop.com');

-- Insert sample appointments (optional - you can skip this)
INSERT INTO appointments (client_name, address, phone, car_license, car_engine, appointment_date, mechanic_id, car_issue, status) VALUES
('Test Client', '123 Test Street', '+1-555-0001', 'TEST123', 'ENG001', '2025-12-10', 1, 'Test appointment', 'scheduled');

-- Verify tables were created
SELECT 'Mechanics table:' as info;
SELECT * FROM mechanics;

SELECT 'Appointments table:' as info;
SELECT * FROM appointments;