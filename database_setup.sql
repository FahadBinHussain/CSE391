-- InfinityFree-compatible Car Workshop Appointment System SQL
-- CSE 391 Assignment 3: PHP and MySQL Project

-- Create mechanics table
CREATE TABLE IF NOT EXISTS mechanics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create appointments table
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
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mechanic_id) REFERENCES mechanics(id)
);

-- Insert sample mechanics data
INSERT INTO mechanics (name, specialization, phone, email) VALUES
('John Smith', 'Engine Specialist', '+1-234-567-8901', 'john.smith@workshop.com'),
('Sarah Johnson', 'Transmission Expert', '+1-234-567-8902', 'sarah.johnson@workshop.com'),
('Mike Wilson', 'Electrical Systems', '+1-234-567-8903', 'mike.wilson@workshop.com'),
('Lisa Brown', 'Brake Specialist', '+1-234-567-8904', 'lisa.brown@workshop.com'),
('David Lee', 'General Mechanic', '+1-234-567-8905', 'david.lee@workshop.com');

-- Insert sample appointment data
INSERT INTO appointments (client_name, address, phone, car_license, car_engine, appointment_date, mechanic_id, car_issue, status) VALUES
('Alice Johnson', '123 Main Street, Springfield', '+1-555-0101', 'ABC123', 'ENG456789', '2025-12-05', 1, 'Engine making strange noises when starting', 'scheduled'),
('Bob Wilson', '456 Oak Avenue, Springfield', '+1-555-0102', 'XYZ789', 'ENG123456', '2025-12-06', 2, 'Transmission slipping in third gear', 'in_progress'),
('Carol Smith', '789 Pine Road, Springfield', '+1-555-0103', 'LMN456', 'ENG789123', '2025-12-04', 1, 'Regular maintenance check', 'completed'),
('David Brown', '321 Elm Street, Springfield', '+1-555-0104', 'DEF654', 'ENG321987', '2025-12-07', 3, 'Electrical issues with headlights', 'scheduled'),
('Emma Davis', '654 Maple Drive, Springfield', '+1-555-0105', 'GHI987', 'ENG654321', '2025-12-08', 4, 'Brake pads need replacement', 'scheduled');

-- Drop indexes if they exist, then create them
DROP INDEX IF EXISTS idx_appointments_date ON appointments;
CREATE INDEX idx_appointments_date ON appointments(appointment_date);

DROP INDEX IF EXISTS idx_appointments_mechanic ON appointments;
CREATE INDEX idx_appointments_mechanic ON appointments(mechanic_id);

DROP INDEX IF EXISTS idx_appointments_status ON appointments;
CREATE INDEX idx_appointments_status ON appointments(status);

DROP INDEX IF EXISTS idx_appointments_phone ON appointments;
CREATE INDEX idx_appointments_phone ON appointments(phone);

-- Done. Views, triggers, and stored procedures removed for InfinityFree compatibility.
