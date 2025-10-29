const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // <-- ADD THIS LINE
const TrainingPlan = require('../models/TrainingPlans');
const { protect } = require('../middleware/auth');


// --- GET /api/trainingplans ---
// @desc    Fetch logged-in user's training plans
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const plans = await TrainingPlan.find({ userId: req.user.id });
        if (!plans) {
            // It's okay if no plans are found, return empty array
            return res.json([]);
        }
        res.json(plans);
    } catch (error) {
        console.error('Error fetching training plans:', error);
        res.status(500).json({ msg: 'Server Error fetching plans' });
    }
});

// --- POST /api/trainingplans ---
// @desc    Create a new training plan for the logged-in user
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const { planName, isAIPlan, exercises } = req.body;

        // --- Server-side Validation ---
        if (!planName || !Array.isArray(exercises)) {
            return res.status(400).json({ msg: 'Missing plan name or exercises array.' });
        }
        // Check plan limit only for manual plans
        if (!isAIPlan) {
            const existingManualPlans = await TrainingPlan.countDocuments({ userId: userId, isAIPlan: false });
            if (existingManualPlans >= 2) {
                return res.status(400).json({ msg: 'You can only save up to 2 manual training plans.' });
            }
        }
        // Optional: Validate exercise structure within the array if needed

        // --- Create New Plan ---
        const newPlan = new TrainingPlan({
            userId,
            planName,
            isAIPlan,
            exercises, // Assuming frontend sends exercises in the correct format for the model
        });

        const savedPlan = await newPlan.save();
        res.status(201).json(savedPlan); // Return the newly created plan

    } catch (error) {
        console.error('Error saving training plan:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ msg: 'Validation Error', errors: error.errors });
        }
        res.status(500).json({ msg: 'Server Error saving plan' });
    }
});

// --- TODO: Add PUT /:id and DELETE /:id routes later for editing/deleting ---

router.put('/:id', protect, async (req, res) => {
    try {
        const planId = req.params.id;
        const userId = req.user.id;
        const { planName, exercises } = req.body; // Expect updated name and exercises array

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(planId)) {
            return res.status(400).json({ msg: 'Invalid Plan ID format.' });
        }

        // Validate input
        if (!planName || !Array.isArray(exercises)) {
            return res.status(400).json({ msg: 'Missing plan name or exercises.' });
        }

        // Find the plan by ID
        const plan = await TrainingPlan.findById(planId);

        if (!plan) {
            return res.status(404).json({ msg: 'Training plan not found.' });
        }

        // Check if the plan belongs to the logged-in user
        if (plan.userId.toString() !== userId) {
            return res.status(401).json({ msg: 'User not authorized to update this plan.' });
        }

        // Update the plan fields
        plan.planName = planName;
        plan.exercises = exercises; // Replace the whole exercises array
        // Note: isAIPlan status probably shouldn't be changed here

        const updatedPlan = await plan.save();
        res.json(updatedPlan);

    } catch (error) {
        console.error('Error updating training plan:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ msg: 'Validation Error', errors: error.errors });
        }
        res.status(500).json({ msg: 'Server Error updating plan' });
    }
});
router.delete('/:id', protect, async (req, res) => {
    try {
        const planId = req.params.id;
        const userId = req.user.id;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(planId)) {
            return res.status(400).json({ msg: 'Invalid Plan ID format.' });
        }

        // Find the plan by ID
        const plan = await TrainingPlan.findById(planId);

        if (!plan) {
            return res.status(404).json({ msg: 'Training plan not found.' });
        }

        // Check if the plan belongs to the logged-in user
        if (plan.userId.toString() !== userId) {
            return res.status(401).json({ msg: 'User not authorized to delete this plan.' });
        }

        // Delete the plan
        await TrainingPlan.deleteOne({ _id: planId }); // Use deleteOne for Mongoose v6+

        res.json({ msg: 'Training plan removed successfully.' });

    } catch (error) {
        console.error('Error deleting training plan:', error);
        res.status(500).json({ msg: 'Server Error deleting plan' });
    }
});
module.exports = router;
