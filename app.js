"use strict";
const express = require('express');
const app = express();

const absensiRoute = require('./routes/absensi.route');

app.use(express.json());
app.use('/api/absensi', absensiRoute);

const PORT = 3000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});