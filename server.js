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
app.use('/api/auth', authRoutes); // 👈 this is important!

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
