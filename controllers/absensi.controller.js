const absensiModel = require('../models/absensi.model');

// melakukan check-in atau absensi
exports.checkIn = async (req, res) => {
   try {
      const {
         employee_id,
         photo_url,
         latitude,
         longitude
      } = req.body;

      // validasi
      if (!employee_id || !photo_url) {
         return res.status(400).json({
            status: 'error',
            message: 'employee_id dan photo_url wajib diisi'
         });
      }

      // data yang akan disimpan
      const checkInTime = new Date(); // waktu server sekarang
      const status = 'pending';

      const data = {
         employee_id,
         photo_url,
         latitude: latitude || null,
         longitude: longitude || null,
         check_in_time: checkInTime,
         status
      };

      const result = await absensiModel.create(data);

      res.status(201).json({
         status: 'success',
         message: 'Check-in berhasil',
         data: {
            id: result.insertId,
            ...data
         }
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         status: 'error',
         message: 'Terjadi kesalahan pada server'
      });
   }
};