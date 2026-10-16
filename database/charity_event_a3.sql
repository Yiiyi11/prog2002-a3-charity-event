-- A2原有表不变，修改events表增加经纬度
ALTER TABLE events
ADD COLUMN latitude DECIMAL(10,6) NULL COMMENT 'latitude for open-meteo weather api',
ADD COLUMN longitude DECIMAL(10,6) NULL COMMENT 'longitude for open-meteo weather api';

-- 新增 registrations 注册表
CREATE TABLE registrations (
    registration_id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'PK registration id',
    event_id INT NOT NULL COMMENT 'FK link events',
    contact_fullname VARCHAR(150) NOT NULL COMMENT 'registrant full name',
    contact_email VARCHAR(120) NOT NULL COMMENT 'registrant email',
    contact_phone VARCHAR(30) COMMENT 'registrant phone',
    ticket_quantity INT NOT NULL COMMENT 'number of tickets',
    registration_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'register submit time',
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    UNIQUE KEY uk_event_email (event_id, contact_email)
) ENGINE=InnoDB;

-- 插入至少10条注册测试数据
INSERT INTO registrations (event_id,contact_fullname,contact_email,contact_phone,ticket_quantity) VALUES
(1,'Alice Smith','alice@test.com','0400111222',2),
(1,'Bob Lee','bob@test.com','0400111333',1),
(2,'Charlie Wang','charlie@test.com','0400111444',3),
(2,'Diana Clark','diana@test.com','0400111555',2),
(2,'Ethan Moore','ethan@test.com','0400111666',1),
(3,'Fiona Hall','fiona@test.com','0400111777',2),
(3,'George King','george@test.com','0400111888',1),
(1,'Hannah Scott','hannah@test.com','0400111999',4),
(3,'Ivan Brown','ivan@test.com','0400222111',2),
(2,'Julia White','julia@test.com','0400222222',1);
