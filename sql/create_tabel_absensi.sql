CREATE TABLE absensi (
   id INT AUTO_INCREMENT PRIMARY KEY,
   employee_id VARCHAR(50) NOT NULL,
   check_in_time DATETIME NOT NULL,
   photo_url VARCHAR(255) NOT NULL,
   latitude DECIMAL(10,8),
   longitude DECIMAL(11,8),
   status ENUM('pending','approved','rejected') DEFAULT 'pending',
   rejection_reason VARCHAR(255),
   approved_by VARCHAR(50),
   approved_at DATETIME,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);