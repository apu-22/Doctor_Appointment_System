// dotenv load 
require('dotenv').config();

// express import 
const express = require('express');

// cors import
const cors = require('cors');

// express app 
const app = express();

app.use(cors());

app.use(express.json());

// ─── Routes import 
const authRoutes = require('./routes/authRoutes');

const doctorRoutes = require('./routes/doctorRoutes');

const appointmentRoutes = require('./routes/appointmentRoutes');

const notificationRoutes = require('./routes/notificationRoutes');

// ─── API Routes register
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);

//testing
app.get('/', (req, res) => {
  res.json({ message: 'MediCare server is running!' });
});

// app export 
module.exports = app;