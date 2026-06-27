-- Cakes and Crunches Customer Allergy & Dietary Preference Profile System
-- Database Schema for MySQL

CREATE DATABASE IF NOT EXISTS cakes_and_crunches;
USE cakes_and_crunches;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'staff',
    full_name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    gender VARCHAR(15),
    dob VARCHAR(10), -- YYYY-MM-DD
    address TEXT,
    emergency_contact VARCHAR(100),
    preferred_contact VARCHAR(20) DEFAULT 'Phone',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Customer Allergies Table
CREATE TABLE IF NOT EXISTS customer_allergies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    allergy_name VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- Severe, Moderate, Safe
    notes VARCHAR(255),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 4. Diet Preferences Table
CREATE TABLE IF NOT EXISTS diet_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    preference_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 5. Ingredients Table
CREATE TABLE IF NOT EXISTS ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50),
    contains_allergens VARCHAR(255), -- Comma-separated list of allergens (e.g. Milk, Peanut)
    description TEXT,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL, -- Cake, Brownie, Cookie, Pastry, Cupcake, Bread, Dessert Box
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Product Ingredients Mapping
CREATE TABLE IF NOT EXISTS product_ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    notes VARCHAR(255),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

-- 8. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    delivery_date VARCHAR(10) NOT NULL, -- YYYY-MM-DD
    special_instructions TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending', -- Pending, Preparing, Completed, Delivered, Cancelled
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- 9. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'info', -- info, warning, success, danger
    `read` BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert Default Admin & Staff Accounts
-- Password for admin is 'admin@123'
-- Password for staff is 'staff123'
INSERT INTO users (username, password_hash, role, full_name, email) VALUES
('admin', 'scrypt:32768:8:1$I9g2vmoO9q3D4fXT$ba2e8571e470eed14430852ca4d68cdfd04b8fcee56fa850b70415c4d79fbcbe830de1b4b3a9f045fb0e807be0aa721b548fc88361b9a36ed483d9a5b85157f1', 'admin', 'System Administrator', 'admin@cakesandcrunches.com'),
('staff', 'pbkdf2:sha256:600000$rS7yUe3Z9RmT$79ab6c04f981ff3a8db2095f9c4c7c88bdf20a169b1836c0a0c4f828a2a890e1', 'staff', 'Bakery Counter Staff', 'staff@cakesandcrunches.com');
