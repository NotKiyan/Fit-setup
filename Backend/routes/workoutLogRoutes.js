const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const mongoose = require('mongoose');
const WorkoutLog = require('../models/WorkoutLog'); // <-- Keep original model name

// --- POST /api/workoutlog ---
// Create a new workout session (Refactored schema)
router.post('/', protect, async (req, res) => {
    try {
        const { date, workoutType, exercises } = req.body;

        if (!exercises || exercises.length === 0) {
            return res.status(400).json({ msg: 'A workout must have at least one exercise' });
        }

        const newWorkout = new WorkoutLog({ // <-- Use WorkoutLog model
            userId: req.user.id,
            date,
            workoutType,
            exercises, // This is the full array of exercises
        });

        const savedWorkout = await newWorkout.save();
        res.status(201).json(savedWorkout);
    } catch (error) { // <-- ADD THE OPENING BRACE HERE
        console.error('Error saving workout:', error);
        res.status(500).json({ msg: 'Server Error' });
    } // The closing brace was already there
});

// --- GET /api/workoutlog ---
// Get all workout *sessions* for the logged-in user (Refactored schema)
router.get('/', protect, async (req, res) => {
    try {
        const workouts = await WorkoutLog.find({ userId: req.user.id }) // <-- Use WorkoutLog model
        .sort({ date: -1 }); // Show newest first

        // --- ADDED CHECK: If no workouts found, send 404 ---
        if (!workouts || workouts.length === 0) {
            return res.status(404).json({ msg: 'No workouts found for this user.' });
        }
        // --- END CHECK ---

        res.json(workouts);
    } catch (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});
router.put('/:id', protect, async (req, res) => {
    try {
        const { date, workoutType, exercises } = req.body;
        const logId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(logId)) {
            return res.status(400).json({ msg: 'Invalid workout log ID' });
        }

        const log = await WorkoutLog.findById(logId);

        if (!log) {
            return res.status(404).json({ msg: 'Workout log not found' });
        }

        // Check if the log belongs to the user
        if (log.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Update fields
        log.date = date || log.date;
        log.workoutType = workoutType || log.workoutType;
        log.exercises = exercises || log.exercises;

        const updatedLog = await log.save();
        res.json(updatedLog);

    } catch (error) {
        console.error('Error updating workout log:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- **NEW** DELETE /api/workoutlog/:id ---
// Delete a specific workout log
router.delete('/:id', protect, async (req, res) => {
    try {
        const logId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(logId)) {
            return res.status(400).json({ msg: 'Invalid workout log ID' });
        }

        const log = await WorkoutLog.findById(logId);

        if (!log) {
            return res.status(404).json({ msg: 'Workout log not found' });
        }

        // Check if the log belongs to the user
        if (log.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await log.deleteOne(); // Use deleteOne() on the document
        res.json({ msg: 'Workout log removed' });

    } catch (error) {
        console.error('Error deleting workout log:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

router.put('/:id', protect, async (req, res) => {
    try {
        const { date, workoutType, exercises } = req.body;
        const logId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(logId)) {
            return res.status(400).json({ msg: 'Invalid workout log ID' });
        }

        const log = await WorkoutLog.findById(logId);

        if (!log) {
            return res.status(404).json({ msg: 'Workout log not found' });
        }

        // Check if the log belongs to the user
        if (log.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Update fields
        log.date = date || log.date;
        log.workoutType = workoutType || log.workoutType;
        log.exercises = exercises || log.exercises;

        const updatedLog = await log.save();
        res.json(updatedLog);

    } catch (error) {
        console.error('Error updating workout log:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- **NEW** DELETE /api/workoutlog/:id ---
// Delete a specific workout log
router.delete('/:id', protect, async (req, res) => {
    try {
        const logId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(logId)) {
            return res.status(400).json({ msg: 'Invalid workout log ID' });
        }

        const log = await WorkoutLog.findById(logId);

        if (!log) {
            return res.status(404).json({ msg: 'Workout log not found' });
        }

        // Check if the log belongs to the user
        if (log.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await log.deleteOne(); // Use deleteOne() on the document
        res.json({ msg: 'Workout log removed' });

    } catch (error) {
        console.error('Error deleting workout log:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

console.log('--- workoutLogRoutes.js loaded ---');
module.exports = router;
