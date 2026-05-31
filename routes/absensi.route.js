const express = require('express');
const router = express.Router();
const absensiController = require('../controllers/absensi.controller');

router.get('/', absensiController.getAll);
router.get('/filter', absensiController.getByFilter);
router.get('/:id', absensiController.getById);
router.post('/checkin', absensiController.checkIn);
router.put('/approve/:id', absensiController.approve);

module.exports = router;