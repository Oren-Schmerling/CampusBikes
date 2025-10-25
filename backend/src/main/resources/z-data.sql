-- Insert a default user to own the bikes/scooters
INSERT INTO users (username, email, password_hash, phone)
VALUES 
('JohnDoe123', 'john@example.com', 'hashedpassword', '5551234567');

-- Insert bikes/scooters
INSERT INTO bikes (owner_id, title, description, location, price_per_hour, status)
VALUES
(1, 'Bike', 'Red mountain bike in good condition', 'UMass Campus', 15.00, 'available'),
(1, 'Scooter', 'Fast electric scooter', 'Downtown', 1.00, 'available'),
(1, 'Bike', 'Lightweight road bike', 'UMass Campus', 8.00, 'available'),
(1, 'Scooter', 'Scooter for quick trips', 'Downtown', 12.00, 'available'),
(1, 'Bike', 'Old but functional bike', 'UMass Campus', 5.00, 'available'),
(1, 'Scooter', 'Scooter suitable for deliveries', 'Downtown', 20.00, 'available'),
(1, 'Bike', 'Green bike, like new', 'UMass Campus', 7.00, 'available'),
(1, 'Scooter', 'Compact scooter for city use', 'Downtown', 3.00, 'available');