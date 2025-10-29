const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
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

// We are removing the '/latest/:exerciseId' route for now
console.log('--- workoutLogRoutes.js loaded ---');
module.exports = router;
