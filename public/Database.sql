create database group6;

use group6;

create table student(
    'SID' int primary key not null,
    'FirstName' varchar(20) not null,
    'LastName' varchar(20) not null,
    'email' varchar(25) not null,
    'City' varchar(50) not null,
    'Course' varchar(25) not null,
    'Guardian' varchar(25) not null,
    'Subject' varchar(25) not null
);

create table service(
    'Id' int primary key auto_ingrement,
    'name' varchar(25) not null,
    'Description' varchar(30) not null,
    'price' Decimal not null
);