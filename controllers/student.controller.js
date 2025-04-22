const Student = require('../models/student.model');
const bcrypt = require('bcryptjs');

// Get all students
exports.getAll = (req, res) => {
  Student.getAll((err, data) => {
    if (err) return res.status(500).json({ message: 'Failed to retrieve students', error: err });
    res.status(200).json(data);
  });
};

// Get a single student
exports.getOne = (req, res) => {
  Student.getById(req.params.id, (err, data) => {
    if (err) return res.status(500).json({ message: 'Failed to retrieve student', error: err });
    res.status(200).json(data[0]);
  });
};

// Create a student
exports.create = (req, res) => {
  const data = req.body;
  data.password = bcrypt.hashSync(data.password, 10);
  
  Student.create(data, (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to create student', error: err });
    res.status(201).json({ message: 'Student created successfully', result });
  });
};

// Update a student
exports.update = (req, res) => {
  const data = req.body;
  
  Student.update(req.params.id, data, (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to update student', error: err });
    res.status(200).json({ message: 'Student updated successfully', result });
  });
};

// Delete a student
exports.delete = (req, res) => {
  Student.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to delete student', error: err });
    res.status(200).json({ message: 'Student deleted successfully', result });
  });
};
