require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Pool } = require('pg');
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const sendgrid = require('@sendgrid/mail');
const twilio = require('twilio');

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('PostgreSQL connection error:', err));

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection (using Supabase)
console.log('Using Supabase database');

// External service configurations
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', require('./routes/services'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
