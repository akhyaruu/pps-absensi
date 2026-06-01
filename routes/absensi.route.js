const express = require('express');
const router = express.Router();
const absensiController = require('../controllers/absensi.controller');
const upload = require('../middlewares/upload.middleware');
const handleMulterError = require('../middlewares/errorhandler.middleware');

router.get('/', absensiController.getAll);
router.get('/filter', absensiController.getByFilter);
router.get('/:id', absensiController.getById);
router.put('/approve/:id', absensiController.approve);
router.put('/reject/:id', absensiController.reject);
router.get('/photo/:attendance_id', absensiController.getPhoto);

router.post('/checkin',  upload.single('photo_url'), handleMulterError, absensiController.checkIn);

module.exports = router;