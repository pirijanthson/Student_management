const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'group6',  // Ensure this matches your database name
    port: 3307,
});

// Connect to the database with error handling
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Serve the home.html (student management) file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the services.html file
app.get('/server.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'server.html'));
});

// Route to add a service
app.post('/service', (req, res) => {
    const { serviceName, serviceDescription, servicePrice } = req.body;
    const query = 'INSERT INTO service (name, Description, price) VALUES (?, ?, ?)';
    db.query(query, [serviceName, serviceDescription, servicePrice], (err, result) => {
        if (err) {
            console.error('Failed to add service:', err.message);
            res.status(500).json({ status: 'error', message: 'Failed to add service' });
        } else {
            res.status(200).json({ status: 'success', message: 'Service added successfully' });
        }
    });
});

// Route to fetch all services
app.get('/services', (req, res) => {
    const query = 'SELECT * FROM service';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Failed to fetch services:', err.message);
            res.status(500).json({ status: 'error', message: 'Failed to fetch services' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Route to delete a service
app.delete('/service/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM service WHERE id=?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Failed to delete service:', err.message);
            res.status(500).json({ status: 'error', message: 'Failed to delete service' });
        } else {
            res.status(200).json({ status: 'success', message: 'Service deleted successfully' });
        }
    });
});

// Route to add a student
app.post('/student', (req, res) => {
    const { SID, FirstName, LastName, Email, City, Course, Guardian, Subject } = req.body;
    const subjectString = Subject.join(','); // Convert subjects array to a comma-separated string
    const query = 'INSERT INTO student (SID, FirstName, LastName, email, City, Course, Guardian, Subject) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [SID, FirstName, LastName, Email, City, Course, Guardian, subjectString], (err, result) => {
        if (err) {
            console.error('Failed to add student:', err.message);
            res.status(500).json({ status: 'error', message: 'Failed to add student' });
        } else {
            res.status(200).json({ status: 'success', message: 'Student added successfully' });
        }
    });
});

// Route to edit a student
app.put('/student/:id', (req, res) => {
    const { id } = req.params;
    const { FirstName, LastName, Email, City, Course, Guardian, Subject } = req.body;
    const subjectString = Subject.join(','); // Convert subjects array to a comma-separated string
    const query = 'UPDATE student SET FirstName=?, LastName=?, email=?, City=?, Course=?, Guardian=?, Subject=? WHERE SID=?';
    db.query(query, [FirstName, LastName, Email, City, Course, Guardian, subjectString, id], (err, result) => {
        if (err) {
            console.error('Failed to update student:', err.message);
            res.status(500).json({ status: 'error', message: 'Failed to update student' });
        } else {
            res.status(200).json({ status: 'success', message: 'Student updated successfully' });
        }
    });
});

// Route to delete a student
app.delete('/student/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM student WHERE SID=?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Failed to delete student:', err.message);
            res.status(500).json({ status: 'error', message: 'Failed to delete student' });
        } else {
            res.status(200).json({ status: 'success', message: 'Student deleted successfully' });
        }
    });
});

// Route to fetch all students or filter students based on a category and value
app.get('/student', (req, res) => {
    const { category, value } = req.query;
    let query = 'SELECT * FROM student';
    const queryParams = [];

    if (category && value) {
        query += ` WHERE ${category} LIKE ?`;
        queryParams.push(`%${value}%`);
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Failed to fetch students:', err.message);
            res.status(500).json({ status: 'error', message: 'Failed to fetch students' });
        } else {
            // Convert the Subject field back to an array for the frontend
            results.forEach(student => {
                student.Subject = student.Subject ? student.Subject.split(',') : [];
            });
            res.status(200).json(results);
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on port ${PORT}');
});
