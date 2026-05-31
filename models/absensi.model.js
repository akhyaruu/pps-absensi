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

exports.findAll = () => {
   return new Promise((resolve, reject) => {
      const query = `
         SELECT 
            id, 
            employee_id, 
            check_in_time, 
            photo_url, 
            latitude, 
            longitude, 
            status,
            rejection_reason,
            approved_by,
            approved_at,
            created_at,
            updated_at
         FROM absensi 
         ORDER BY check_in_time DESC
        `;

      db.query(query, (err, results) => {
         if (err) return reject(err);
         resolve(results);
      });
   });
};

exports.findById = (id) => {
   return new Promise((resolve, reject) => {
      const query = `
         SELECT 
            id, 
            employee_id, 
            check_in_time, 
            photo_url, 
            latitude, 
            longitude, 
            status,
            rejection_reason,
            approved_by,
            approved_at,
            created_at,
            updated_at
         FROM absensi 
         WHERE id = ?
        `;

      db.query(query, [id], (err, results) => {
         if (err) return reject(err);

         if (results.length === 0) {
            resolve(null);
         } else {
            resolve(results[0]);
         }
      });
   });
};

exports.findByFilter = ({
   status,
   startDate,
   endDate
}) => {
   return new Promise((resolve, reject) => {
      let query = `
         SELECT 
            id, 
            employee_id, 
            check_in_time, 
            photo_url, 
            latitude, 
            longitude, 
            status,
            rejection_reason,
            approved_by,
            approved_at,
            created_at,
            updated_at
         FROM absensi 
         WHERE 1=1
        `;
      const values = [];

      // filter by status
      if (status) {
         query += ` AND status = ?`;
         values.push(status);
      }

      // filter by startDate
      if (startDate) {
         query += ` AND DATE(check_in_time) >= ?`;
         values.push(startDate);
      }

      // filter by endDate
      if (endDate) {
         query += ` AND DATE(check_in_time) <= ?`;
         values.push(endDate);
      }

      query += ` ORDER BY check_in_time DESC`;

      db.query(query, values, (err, results) => {
         if (err) return reject(err);
         resolve(results);
      });
   });
};