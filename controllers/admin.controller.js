// backend/controllers/admin.controller.js

const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret'; // 🔐 Change this in production

// ✅ Admin Login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin exists
    const [admins] = await db.promise().query('SELECT * FROM admins WHERE email = ?', [email]);

    if (admins.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const admin = admins[0];

    // Compare password
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Create JWT token
    const token = jwt.sign({ id: admin.id, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Register a new admin (OPTIONAL - for initial setup)
exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin already exists
    const [admins] = await db.promise().query('SELECT * FROM admins WHERE email = ?', [email]);

    if (admins.length > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new admin
    await db.promise().query('INSERT INTO admins (email, password) VALUES (?, ?)', [email, hashedPassword]);

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
