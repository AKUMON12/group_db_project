// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ROUTES
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');   // 👈 NEW
const studentRoutes = require('./routes/student.routes'); // 👈 NEW

app.use('/api/auth', authRoutes); // 👈 this is important!
app.use('/api/admins', adminRoutes);       // 👈 Register this
app.use('/api/students', studentRoutes);   // 👈 And this too

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
