const db = require('../config/db');

const Admin = {
  findByEmail: (email, callback) =>
    db.query("SELECT * FROM admins WHERE email = ?", [email], callback)
};

module.exports = Admin;
