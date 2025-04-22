// backend/controllers/admin.controller.js
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret'; // Replace with env var in production

// ✅ Get all admins (for internal use or dashboard)
exports.getAllAdmins = async (req, res) => {
  try {
    const [admins] = await db.promise().query('SELECT id, email FROM admins');
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error getting admins:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Admin Login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [admins] = await db.promise().query('SELECT * FROM admins WHERE email = ?', [email]);

    if (admins.length === 0) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const admin = admins[0];
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: admin.id, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Register Admin
exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [admins] = await db.promise().query('SELECT * FROM admins WHERE email = ?', [email]);

    if (admins.length > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.promise().query('INSERT INTO admins (email, password) VALUES (?, ?)', [email, hashedPassword]);

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
