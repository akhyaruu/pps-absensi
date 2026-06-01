const multer = require('multer');
const path = require('path');
const fs = require('fs');

// memastikan folder uploads ada
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir, {
      recursive: true
   });
}

// konfigurasi penyimpanan
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'uploads/'); // folder tujuan
   },
   filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1E9); // buat nama file unik: timestamp-random.extension
      const ext = path.extname(file.originalname);
      cb(null, unique + ext);
   }
});

// filter file (hanya gambar)
const fileFilter = (req, file, cb) => {
   const allowedTypes = /jpeg|jpg|png|gif/;
   const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
   const mime = allowedTypes.test(file.mimetype);

   if (ext && mime) {
      cb(null, true);
   } else {
      cb(new Error('Hanya file gambar yang diperbolehkan (jpeg, jpg, png, gif)'));
   }
};

const upload = multer({
   storage: storage,
   limits: {
      fileSize: 5 * 1024 * 1024 // max. 5mb
   },
   fileFilter: fileFilter
});

module.exports = upload;