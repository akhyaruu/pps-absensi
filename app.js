"use strict";
const express = require('express');
const app = express();
const path = require('path');

// middleware parsing
app.use(express.json());
app.use(express.urlencoded({
   extended: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const absensiRoute = require('./routes/absensi.route');
app.use('/api/absensi', absensiRoute);

const PORT = 3000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});