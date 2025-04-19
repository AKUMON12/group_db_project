const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',           // default user in XAMPP
  password: '',           // default is blank in XAMPP
  database: 'student_info_system'
});

// Connect to DB
db.connect((err) => {
  if (err) {
    console.error('DB connection error:', err.message);
  } else {
    console.log('✅ MySQL connected!');
  }
});

module.exports = db;
