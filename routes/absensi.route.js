const express = require('express');
const router = express.Router();
const absensiController = require('../controllers/absensi.controller');

router.get('/', absensiController.getAll);
router.get('/:id', absensiController.getById);
router.post('/checkin', absensiController.checkIn);

module.exports = router;