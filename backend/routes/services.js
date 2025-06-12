const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect } = require('./auth');

// Get all active services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find({ isActive: true });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all services (admin only)
router.get('/all', protect, async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new service (admin only)
router.post('/', protect, async (req, res) => {
    try {
        const service = new Service(req.body);
        const newService = await service.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update service (admin only)
router.put('/:id', protect, async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(service);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete service (admin only)
router.delete('/:id', protect, async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
