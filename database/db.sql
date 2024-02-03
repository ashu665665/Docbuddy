-- Create a new database
CREATE DATABASE IF NOT EXISTS docbuddy;

-- Use the newly created database
USE docbuddy;

-- Creating a new table for users
CREATE TABLE IF NOT EXISTS doc (
  doc_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  doc_name VARCHAR(50) NOT NULL,
  doc_email VARCHAR(100) NOT NULL,
  doc_phone VARCHAR(15),
  doc_password VARCHAR(255) NOT NULL
);


-- Creating a new table for patients
CREATE TABLE IF NOT EXISTS patient (
  patient_id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  patient_name VARCHAR(50) NOT NULL,
  patient_age INT,
  patient_gender VARCHAR(10),
  patient_bloodgroup VARCHAR(10),
  patient_whatsapp_number VARCHAR(15),
  patient_email VARCHAR(50),
  patient_address VARCHAR(100),
  patient_creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  patient_update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  doc_id INT(6) UNSIGNED,
  FOREIGN KEY (doc_id) REFERENCES doc(doc_id)
);
