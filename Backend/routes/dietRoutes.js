const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); // Your auth middleware
const DietLog = require('../models/DietLog');
const mongoose = require('mongoose');

// GET /api/dietlog - Get all calorie entries for the user
router.get('/', protect, async (req, res) => {
    try {
        const logs = await DietLog.find({ userId: req.user.id }).sort({ date: -1 });
        if (!logs || logs.length === 0) {
            return res.status(404).json({ msg: 'No diet logs found.' });
        }
        res.json(logs);
    } catch (error) {
        console.error('Error fetching diet logs:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// POST /api/dietlog - Add or Update a calorie entry for a day
router.post('/', protect, async (req, res) => {
    try {
        const { date, calories } = req.body;
        if (!date || calories == null || calories < 0) {
            return res.status(400).json({ msg: 'Valid date and calories are required' });
        }

        const savedLog = await DietLog.findOneAndUpdate(
            { userId: req.user.id, date: new Date(date) },
                                                        { $set: { userId: req.user.id, date: new Date(date), calories: calories } },
                                                        { new: true, upsert: true, runValidators: true }
        );
        res.status(201).json(savedLog);
    } catch (error) {
        console.error('Error saving diet log:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const logId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(logId)) {
            return res.status(400).json({ msg: 'Invalid diet log ID' });
        }

        const log = await DietLog.findById(logId);

        if (!log) {
            return res.status(404).json({ msg: 'Diet log not found' });
        }

        // Check if the log belongs to the user
        if (log.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await log.deleteOne();
        res.json({ msg: 'Diet log removed' });

    } catch (error) {
        console.error('Error deleting diet log:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
