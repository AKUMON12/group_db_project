const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const Student = require('../models/student.model');
const db = require('../config/db'); // adjust path as needed

const register = (req, res) => {
  

  const { username, email, password, role } = req.body;

  //✅ Check all required fields
  if (!username || !email || !password || !role) {
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
    const sql = `INSERT INTO ${table} (username, email, password) VALUES (?, ?, ?)`;
    db.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  });
};

const login = (req, res) => {
  const { email, password, role } = req.body;

  const model = role === 'admin' ? Admin : Student;

  model.findByEmail(email, (err, results) => {
    if (err || results.length === 0) return res.status(404).send("User not found");

    const user = results[0];
    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) return res.status(401).send("Invalid credentials");

    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, id: user.id, email: user.email });
  });
};

module.exports = { register, login };
