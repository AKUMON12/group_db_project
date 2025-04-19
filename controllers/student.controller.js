const Student = require('../models/student.model');
const bcrypt = require('bcryptjs');

exports.getAll = (req, res) => Student.getAll((err, data) => {
  if (err) return res.status(500).send(err);
  res.json(data);
});

exports.getOne = (req, res) => Student.getById(req.params.id, (err, data) => {
  if (err) return res.status(500).send(err);
  res.json(data[0]);
});

exports.create = (req, res) => {
  const data = req.body;
  data.password = bcrypt.hashSync(data.password, 10);
  Student.create(data, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("Student created successfully");
  });
};

exports.update = (req, res) => {
  const data = req.body;
  Student.update(req.params.id, data, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("Student updated successfully");
  });
};

exports.delete = (req, res) => {
  Student.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("Student deleted successfully");
  });
};
