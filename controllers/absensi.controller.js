const absensiModel = require('../models/absensi.model');

// melakukan check-in atau absensi
exports.checkIn = async (req, res) => {
   try {
      const {
         employee_id,
         latitude,
         longitude
      } = req.body;

      const file = req.file;

      if (!employee_id) {
         if (file) { // hapus file yang sudah terupload jika validasi gagal
            const fs = require('fs');
            fs.unlinkSync(file.path);
         }
         return res.status(400).json({
            status: 'error',
            message: 'employee_id wajib diisi'
         });
      }

      if (!file) {
         return res.status(400).json({
            status: 'error',
            message: 'Foto bukti absensi wajib diupload'
         });
      }

      const photoUrl = `/uploads/${file.filename}`; // buat URL foto (bisa diakses via static folder)

      const checkInTime = new Date();
      const status = 'pending';

      const data = {
         employee_id,
         photo_url: photoUrl,
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
            employee_id,
            photo_url: photoUrl,
            latitude: data.latitude,
            longitude: data.longitude,
            check_in_time: checkInTime,
            status: 'pending'
         }
      });
   } catch (error) {
      console.error(error);
      if (req.file) {
         const fs = require('fs');
         fs.unlinkSync(req.file.path);
      }
      res.status(500).json({
         status: 'error',
         message: 'Terjadi kesalahan pada server'
      });
   }
};

// mendapatkan semua data absensi
exports.getAll = async (req, res) => {
   try {
      const data = await absensiModel.findAll();

      res.status(200).json({
         status: 'success',
         message: 'Data absensi berhasil diambil',
         total: data.length,
         data: data
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         status: 'error',
         message: 'Terjadi kesalahan pada server'
      });
   }
};

// mendapatkan detail absensi
exports.getById = async (req, res) => {
   try {
      const {
         id
      } = req.params;

      if (!id) {
         return res.status(400).json({
            status: 'error',
            message: 'ID absensi wajib diisi'
         });
      }

      const data = await absensiModel.findById(id);

      if (!data) {
         return res.status(404).json({
            status: 'error',
            message: 'Data absensi tidak ditemukan'
         });
      }

      res.status(200).json({
         status: 'success',
         message: 'Detail absensi berhasil diambil',
         data: data
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         status: 'error',
         message: 'Terjadi kesalahan pada server'
      });
   }
};

// mendapatkan data absensi sesuai filter
exports.getByFilter = async (req, res) => {
   try {
      const {
         status,
         startDate,
         endDate
      } = req.query;

      const data = await absensiModel.findByFilter({
         status,
         startDate,
         endDate
      });

      res.status(200).json({
         status: 'success',
         message: 'Data absensi berhasil diambil',
         filter: {
            status: status || 'semua',
            startDate: startDate || 'tidak dibatasi',
            endDate: endDate || 'tidak dibatasi'
         },
         total: data.length,
         data: data
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({
         status: 'error',
         message: 'Terjadi kesalahan pada server'
      });
   }
};

// menyetujui absensi
exports.approve = async (req, res) => {
   try {
      const {
         id
      } = req.params;
      const {
         approved_by
      } = req.body; // ID admin yang approve

      if (!approved_by) {
         return res.status(400).json({
            status: 'error',
            message: 'approved_by wajib diisi (ID admin yang melakukan approve)'
         });
      }

      if (!id) {
         return res.status(400).json({
            status: 'error',
            message: 'ID absensi wajib diisi'
         });
      }

      // cek apakah data ada
      const existingData = await absensiModel.findById(id);
      if (!existingData) {
         return res.status(404).json({
            status: 'error',
            message: 'Data absensi tidak ditemukan'
         });
      }

      // cek apakah status masih pending
      if (existingData.status !== 'pending') {
         return res.status(400).json({
            status: 'error',
            message: `Tidak dapat approve. Status saat ini: ${existingData.status}`
         });
      }

      // update status
      const result = await absensiModel.approve(id, approved_by);

      if (result.affectedRows === 0) {
         return res.status(400).json({
            status: 'error',
            message: 'Gagal mengupdate data'
         });
      }

      res.status(200).json({
         status: 'success',
         message: 'Absensi berhasil disetujui',
         data: {
            id: parseInt(id),
            old_status: 'pending',
            new_status: 'approved',
            approved_by: approved_by,
            approved_at: new Date()
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

// menolak absensi
exports.reject = async (req, res) => {
   try {
      const {
         id
      } = req.params;
      const {
         rejection_reason,
         rejected_by
      } = req.body;

      if (!rejected_by) {
         return res.status(400).json({
            status: 'error',
            message: 'rejected_by wajib diisi (ID admin yang melakukan penolakan)'
         });
      }

      if (!rejection_reason) {
         return res.status(400).json({
            status: 'error',
            message: 'rejection_reason wajib diisi (alasan penolakan)'
         });
      }

      if (!id) {
         return res.status(400).json({
            status: 'error',
            message: 'ID absensi wajib diisi'
         });
      }

      // cek apakah data ada
      const existingData = await absensiModel.findById(id);
      if (!existingData) {
         return res.status(404).json({
            status: 'error',
            message: 'Data absensi tidak ditemukan'
         });
      }

      // cek apakah status masih pending
      if (existingData.status !== 'pending') {
         return res.status(400).json({
            status: 'error',
            message: `Tidak dapat reject. Status saat ini: ${existingData.status}`
         });
      }

      // update status
      const result = await absensiModel.reject(id, rejection_reason, rejected_by);

      if (result.affectedRows === 0) {
         return res.status(400).json({
            status: 'error',
            message: 'Gagal mengupdate data'
         });
      }

      res.status(200).json({
         status: 'success',
         message: 'Absensi berhasil ditolak',
         data: {
            id: parseInt(id),
            old_status: 'pending',
            new_status: 'rejected',
            rejection_reason: rejection_reason,
            rejected_by: rejected_by,
            rejected_at: new Date()
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