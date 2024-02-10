-- create user
CREATE USER super_user;

-- create database and grant privileges
CREATE DATABASE demo;
GRANT ALL PRIVILEGES ON DATABASE demo TO super_user;

-- create schema and grant privileges
CREATE SCHEMA ontology;
GRANT ALL PRIVILEGES ON SCHEMA ontology TO super_user;