const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Create tables if they don't exist
const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS appointments (
                id SERIAL PRIMARY KEY,
                pet_name VARCHAR(255) NOT NULL,
                owner_name VARCHAR(255) NOT NULL,
                phone_number VARCHAR(20) NOT NULL,
                email VARCHAR(255) NOT NULL,
                service_type VARCHAR(255) NOT NULL,
                appointment_date TIMESTAMP NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Database tables created successfully');
    } catch (err) {
        console.error('Error creating tables:', err);
    }
};

// User operations
const createUser = async (userData) => {
    try {
        const { name, email, password, role } = userData;
        const result = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, password, role]
        );
        return result.rows[0];
    } catch (err) {
        throw err;
    }
};

const getUserByEmail = async (email) => {
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    } catch (err) {
        throw err;
    }
};

// Appointment operations
const createAppointment = async (appointmentData) => {
    try {
        const { petName, ownerName, phoneNumber, email, serviceType, appointmentDate, notes } = appointmentData;
        const result = await pool.query(
            'INSERT INTO appointments (pet_name, owner_name, phone_number, email, service_type, appointment_date, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [petName, ownerName, phoneNumber, email, serviceType, appointmentDate, notes]
        );
        return result.rows[0];
    } catch (err) {
        throw err;
    }
};

const getAppointments = async () => {
    try {
        const result = await pool.query(
            'SELECT * FROM appointments ORDER BY appointment_date DESC'
        );
        return result.rows;
    } catch (err) {
        throw err;
    }
};

const updateAppointmentStatus = async (id, status) => {
    try {
        const result = await pool.query(
            'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        return result.rows[0];
    } catch (err) {
        throw err;
    }
};

// Initialize database
createTables();

module.exports = {
    createUser,
    getUserByEmail,
    createAppointment,
    getAppointments,
    updateAppointmentStatus
};
