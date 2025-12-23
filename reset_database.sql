-- Database Reset Script
-- WARNING: This will delete ALL data in the car_workshop database
-- Use this to start fresh

-- Drop existing tables (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS discount_rules;
DROP TABLE IF EXISTS mechanics;

-- Optionally, drop and recreate the entire database
-- DROP DATABASE IF EXISTS car_workshop;
-- CREATE DATABASE car_workshop;
-- USE car_workshop;

-- Now you can run local_setup.sql to recreate all tables with fresh data
