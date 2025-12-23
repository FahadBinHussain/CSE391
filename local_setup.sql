CREATE DATABASE IF NOT EXISTS car_workshop;
USE car_workshop;

CREATE TABLE IF NOT EXISTS mechanics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    discount_applied DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS discount_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    summation_value INT NOT NULL,
    discount_percentage DECIMAL(5,2) NOT NULL,
    valid_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (valid_date)
);

INSERT INTO mechanics (name, specialization) VALUES
('John Smith', 'Engine Specialist'),
('Sarah Johnson', 'Transmission Expert'),
('Mike Wilson', 'Electrical Systems'),
('Lisa Brown', 'Brake Specialist'),
('David Lee', 'General Mechanic');

INSERT INTO discount_rules (summation_value, discount_percentage, valid_date) VALUES
(30, 10.00, '2025-12-25');

SELECT 'Database setup complete!' as status;
SELECT 'Mechanics table:' as info;
SELECT * FROM mechanics;

SELECT 'Discount rules table:' as info;
SELECT * FROM discount_rules;
