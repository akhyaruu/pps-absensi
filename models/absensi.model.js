const db = require('../config/database');

exports.create = (data) => {
   return new Promise((resolve, reject) => {
      const query = `
            INSERT INTO absensi 
            (employee_id, check_in_time, photo_url, latitude, longitude, status) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

      const values = [
         data.employee_id,
         data.check_in_time,
         data.photo_url,
         data.latitude,
         data.longitude,
         data.status
      ];

      db.query(query, values, (err, result) => {
         if (err) return reject(err);
         resolve(result);
      });
   });
};