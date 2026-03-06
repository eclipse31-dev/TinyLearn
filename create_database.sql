-- Create TinyLearn Database for XAMPP/phpMyAdmin
-- Run this in phpMyAdmin SQL tab

CREATE DATABASE IF NOT EXISTS `tinylearn` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Select the database
USE `tinylearn`;

-- Grant privileges (if needed)
-- GRANT ALL PRIVILEGES ON tinylearn.* TO 'root'@'localhost';
-- FLUSH PRIVILEGES;
