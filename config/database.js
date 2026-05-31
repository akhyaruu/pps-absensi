const mysql = require('mysql2');

const db = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'pps_absensi' // sesuaikan nama database disini
});

db.connect((err) => {
   if (err) {
      console.error('Database connection failed:', err);
      return;
   }
   console.log('Connected to MySQL database');
});

module.exports = db;