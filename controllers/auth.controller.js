const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const fs = require('fs'); // ✅ NEW: For file system operations
const path = require('path'); // ✅ NEW: To safely resolve file paths


const Admin = require('../models/admin.model');
const Student = require('../models/student.model');
const db = require('../config/db'); // adjust path as needed

// ✅ NEW: Append a registered user to users.json
const appendUserToJsonFile = (user) => {
  const filePath = path.join(__dirname, '../data/users.json'); // Adjust path if needed

  let users = [];

  // ✅ Check if file exists and read current users
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    try {
      users = JSON.parse(data);
    } catch (err) {
      users = []; // fallback if JSON is corrupted
    }
  }

  // ✅ Append new user
  users.push(user);

  // ✅ Write updated list back to file
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
};

// ✅ Register function
const register = (req, res) => {
  
  const { username, email, password, role, first_name, last_name } = req.body;

  //✅ Check all required fields
  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Extra validation for students
  if (role === 'student' && (!username || !email || !password || !role || !first_name || !last_name)) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Choose the correct model
  const model = role === 'admin' ? Admin : Student;
  const table = role === 'admin' ? 'admins' : 'students';

  // Check if email already exists
  model.findByEmail(email, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error during email check' });
    }
    
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Save user
    // Create SQL dynamically depending on role
    let sql, params;
    if (role === 'admin') {
      sql = `INSERT INTO admins (username, email, password) VALUES (?, ?, ?)`;
      params = [username, email, hashedPassword];
    } else {
      sql = `INSERT INTO students (username, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)`;
      params = [username, email, hashedPassword, first_name, last_name];
    }
    
    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ message: "Database error" });
      }

      // ✅ Log user data to JSON file (excluding raw password)
      const jsonUser = {
        id: result.insertId,
        username,
        email,
        role,
        ...(role === 'student' ? { first_name, last_name } : {}),
        created_at: new Date().toISOString()
      };

      appendUserToJsonFile(jsonUser);

      res.status(201).json({ message: "User registered successfully" });
    });
  });
};

// ✅ Login function
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // First check in Admins
  Admin.findByEmail(email, (err, adminResults) => {
    if (err) return res.status(500).json({ message: "Database error during admin lookup" });

    if (adminResults.length > 0) {
      const admin = adminResults[0];
      const isValid = bcrypt.compareSync(password, admin.password);

      if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, id: admin.id, role: 'admin', email: admin.email });
    }

    // If not found in Admins, check Students
    Student.findByEmail(email, (err, studentResults) => {
      if (err) return res.status(500).json({ message: "Database error during student lookup" });

      if (studentResults.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const student = studentResults[0];
      const isValid = bcrypt.compareSync(password, student.password);

      if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: student.id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, id: student.id, role: 'student', email: student.email });
    });
  });
};


module.exports = { register, login };
