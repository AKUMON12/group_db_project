const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const Student = require('../models/student.model');

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

module.exports = { login };
