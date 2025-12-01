-- Car Workshop Appointment System Database Setup
-- CSE 391 Assignment 3: PHP and MySQL Project

-- Create database
CREATE DATABASE IF NOT EXISTS car_workshop;
USE car_workshop;

-- Create mechanics table
CREATE TABLE mechanics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create appointments table
CREATE TABLE appointments (
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

-- Create indexes for better performance
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_mechanic ON appointments(mechanic_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_phone ON appointments(phone);

-- Create view for appointment summary
CREATE VIEW appointment_summary AS
SELECT 
    a.id,
    a.client_name,
    a.phone,
    a.car_license,
    a.appointment_date,
    m.name as mechanic_name,
    m.specialization,
    a.status,
    a.created_at
FROM appointments a
JOIN mechanics m ON a.mechanic_id = m.id
ORDER BY a.appointment_date DESC, a.created_at DESC;

-- Create view for mechanic availability
CREATE VIEW mechanic_availability AS
SELECT 
    m.id,
    m.name,
    m.specialization,
    COALESCE(daily_appointments.appointment_count, 0) as today_appointments,
    (4 - COALESCE(daily_appointments.appointment_count, 0)) as available_slots
FROM mechanics m
LEFT JOIN (
    SELECT 
        mechanic_id,
        COUNT(*) as appointment_count
    FROM appointments
    WHERE DATE(appointment_date) = CURDATE()
    AND status != 'cancelled'
    GROUP BY mechanic_id
) daily_appointments ON m.id = daily_appointments.mechanic_id;

-- Stored procedure to check appointment conflicts
DELIMITER //
CREATE PROCEDURE CheckAppointmentConflict(
    IN p_phone VARCHAR(20),
    IN p_date DATE,
    OUT p_has_conflict BOOLEAN
)
BEGIN
    DECLARE conflict_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO conflict_count
    FROM appointments
    WHERE phone = p_phone 
    AND appointment_date = p_date 
    AND status != 'cancelled';
    
    SET p_has_conflict = (conflict_count > 0);
END //
DELIMITER ;

-- Stored procedure to check mechanic availability
DELIMITER //
CREATE PROCEDURE CheckMechanicAvailability(
    IN p_mechanic_id INT,
    IN p_date DATE,
    OUT p_available_slots INT
)
BEGIN
    DECLARE booked_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO booked_count
    FROM appointments
    WHERE mechanic_id = p_mechanic_id 
    AND appointment_date = p_date 
    AND status != 'cancelled';
    
    SET p_available_slots = (4 - booked_count);
END //
DELIMITER ;

-- Function to get next available appointment date
DELIMITER //
CREATE FUNCTION GetNextAvailableDate(p_mechanic_id INT) 
RETURNS DATE
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE next_date DATE;
    DECLARE available_slots INT;
    DECLARE day_counter INT DEFAULT 0;
    
    SET next_date = CURDATE();
    
    availability_loop: LOOP
        -- Skip Sundays (workshop closed)
        IF DAYOFWEEK(next_date) != 1 THEN
            SELECT COUNT(*) INTO available_slots
            FROM appointments
            WHERE mechanic_id = p_mechanic_id 
            AND appointment_date = next_date 
            AND status != 'cancelled';
            
            IF available_slots < 4 THEN
                LEAVE availability_loop;
            END IF;
        END IF;
        
        SET next_date = DATE_ADD(next_date, INTERVAL 1 DAY);
        SET day_counter = day_counter + 1;
        
        -- Prevent infinite loop (max 30 days)
        IF day_counter > 30 THEN
            LEAVE availability_loop;
        END IF;
    END LOOP;
    
    RETURN next_date;
END //
DELIMITER ;

-- Create trigger to log appointment changes
CREATE TABLE appointment_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    action_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON,
    new_values JSON,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //
CREATE TRIGGER appointment_update_log
AFTER UPDATE ON appointments
FOR EACH ROW
BEGIN
    INSERT INTO appointment_logs (appointment_id, action_type, old_values, new_values, changed_by)
    VALUES (
        NEW.id,
        'UPDATE',
        JSON_OBJECT(
            'status', OLD.status,
            'appointment_date', OLD.appointment_date,
            'mechanic_id', OLD.mechanic_id
        ),
        JSON_OBJECT(
            'status', NEW.status,
            'appointment_date', NEW.appointment_date,
            'mechanic_id', NEW.mechanic_id
        ),
        USER()
    );
END //
DELIMITER ;

-- Grant permissions (adjust as needed for your setup)
-- CREATE USER 'workshop_user'@'localhost' IDENTIFIED BY 'workshop_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON car_workshop.* TO 'workshop_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Display setup completion message
SELECT 'Database setup completed successfully!' as message;
SELECT 'Total mechanics created:' as info, COUNT(*) as count FROM mechanics;
SELECT 'Sample appointments created:' as info, COUNT(*) as count FROM appointments;