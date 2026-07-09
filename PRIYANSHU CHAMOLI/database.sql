-- Create Database (if not exists)
CREATE DATABASE IF NOT EXISTS eduportal;
USE eduportal;

-- Notes Table
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    year VARCHAR(50),
    semester VARCHAR(50),
    subject VARCHAR(100),
    document_type VARCHAR(50) DEFAULT 'Note',
    filename VARCHAR(255),
    originalname VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    year_sem VARCHAR(100),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Active',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200),
    message TEXT,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
