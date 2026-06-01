const multer = require('multer');

const handleMulterError = (err, req, res, next) => {
   if (err instanceof multer.MulterError) {
      // error dari multer
      if (err.code === 'LIMIT_FILE_SIZE') {
         return res.status(400).json({
            status: 'error',
            message: 'Ukuran file terlalu besar. Maksimal 5MB'
         });
      }
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
         return res.status(400).json({
            status: 'error',
            message: 'Hanya boleh upload 1 file'
         });
      }
      return res.status(400).json({
         status: 'error',
         message: err.message
      });
   }

   // error dari fileFilter
   if (err.message === 'Hanya file gambar yang diperbolehkan (jpeg, jpg, png, gif)') {
      return res.status(400).json({
         status: 'error',
         message: err.message
      });
   }

   next(err);
};

module.exports = handleMulterError;