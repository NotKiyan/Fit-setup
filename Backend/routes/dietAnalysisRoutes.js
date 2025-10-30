const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); // Your auth middleware
const DietAnalysis = require('../models/DietAnalysis');

// GET /api/dietanalysis - Fetch the user's saved form data
router.get('/', protect, async (req, res) => {
    try {
        const analysisData = await DietAnalysis.findOne({ userId: req.user.id });
        if (!analysisData) {
            return res.status(404).json({ msg: 'No diet analysis found.' });
        }
        res.status(200).json(analysisData);
    } catch (error) {
        console.error('Error fetching diet analysis:', error);
        res.status(500).json({ msg: 'Server Error fetching diet analysis' });
    }
});

// PUT /api/dietanalysis - Save or Update the form
router.put('/', protect, async (req, res) => {
    try {
        const updatedAnalysis = await DietAnalysis.findOneAndUpdate(
            { userId: req.user.id }, // Find by user ID
            { $set: { ...req.body, userId: req.user.id } }, // Set all form data
            { new: true, upsert: true, runValidators: true } // Create if not exist
        );
        res.status(200).json({
            msg: 'Diet analysis saved successfully!',
            data: updatedAnalysis
        });
    } catch (error) {
        console.error('Error saving diet analysis:', error);
        res.status(500).json({ msg: 'Server Error saving diet analysis' });
    }
});

module.exports = router;
