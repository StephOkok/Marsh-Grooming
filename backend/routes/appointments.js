const express = require('express');
const router = express.Router();
const { createAppointment } = require('../services/database');
const notifications = require('../services/notifications');

// Create new appointment
router.post('/', async (req, res) => {
    try {
        const { petName, ownerName, phoneNumber, email, serviceType, appointmentDate, notes } = req.body;
        
        const appointmentData = {
            petName,
            ownerName,
            phoneNumber,
            email,
            serviceType,
            appointmentDate: new Date(appointmentDate),
            notes
        };
        
        // Create appointment in database
        const appointment = await createAppointment(appointmentData);
        
        // Send confirmation notifications
        await notifications.sendAppointmentConfirmation(appointment);
        
        // Send success response
        res.status(201).json({
            message: 'Appointment booked successfully!',
            appointment,
            success: true
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await getAppointments();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get appointment by ID
router.get('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update appointment status
router.patch('/:id/status', async (req, res) => {
    try {
        const appointment = await updateAppointmentStatus(req.params.id, req.body.status);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
