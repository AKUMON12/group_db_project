const express = require('express');
const studentCtrl = require('../controllers/student.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', verifyToken, studentCtrl.getAll);
router.get('/:id', verifyToken, studentCtrl.getOne);
router.post('/', studentCtrl.create); // No token: initial reg
router.put('/:id', verifyToken, studentCtrl.update);
router.delete('/:id', verifyToken, studentCtrl.delete);

module.exports = router;