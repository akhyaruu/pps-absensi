const express = require('express');
const router = express.Router();
const absensiController = require('../controllers/absensi.controller');

router.post('/checkin', absensiController.checkIn);

module.exports = router;