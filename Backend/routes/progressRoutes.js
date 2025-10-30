const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); //
const WorkoutLog = require('../models/WorkoutLog'); //
const mongoose = require('mongoose');

// --- GET /api/progress/strength/:exerciseId ---
// Tracks the 1-rep max (or just max weight) for a specific exercise over time
router.get('/strength/:exerciseId', protect, async (req, res) => {
    try {
        const exerciseId = req.params.exerciseId;

        const strengthProgress = await WorkoutLog.aggregate([
            // 1. Find all workouts by this user
            { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
                                                            // 2. Unwind the 'exercises' array to work with each exercise individually
                                                            { $unwind: '$exercises' },
                                                            // 3. Filter for the specific exerciseId
                                                            { $match: { 'exercises.exerciseId': exerciseId } },
                                                            // 4. Unwind the 'sets' array to look at each set
                                                            { $unwind: '$exercises.sets' },
                                                            // 5. Group by workout date, finding the max weight lifted on that day
                                                            {
                                                                $group: {
                                                                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, // Group by date
                                                                    maxWeight: { $max: '$exercises.sets.weight' } // Find max weight in that day's sets
                                                                }
                                                            },
                                                            // 6. Sort by date
                                                            { $sort: { _id: 1 } },
                                                            // 7. Format the output
                                                            { $project: { _id: 0, date: '$_id', maxWeight: '$maxWeight' } }
        ]);

        if (strengthProgress.length === 0) {
            return res.status(404).json({ msg: 'No data found for this exercise' });
        }
        res.json(strengthProgress);

    } catch (error) {
        console.error('Error fetching strength progress:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});


// --- GET /api/progress/prs ---
// Finds Personal Records (e.g., heaviest lift for each exercise)
router.get('/prs', protect, async (req, res) => {
    try {
        const prs = await WorkoutLog.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
                                               { $unwind: '$exercises' },
                                               { $unwind: '$exercises.sets' },
                                               // Group by exercise, finding the max weight for each
                                               {
                                                   $group: {
                                                       _id: '$exercises.exerciseName', // Group by exercise name
                                                       maxWeight: { $max: '$exercises.sets.weight' },
                                                       exerciseId: { $first: '$exercises.exerciseId' }
                                                   }
                                               },
                                               // Filter out any exercises where no weight was logged
                                               { $match: { maxWeight: { $gt: 0 } } },
                                               // Format the output
                                               {
                                                   $project: {
                                                       _id: 0,
                                                       exerciseName: '$_id',
                                                       maxWeight: '$maxWeight',
                                                       exerciseId: '$exerciseId'
                                                   }
                                               },
                                               { $sort: { exerciseName: 1 } } // Sort by name
        ]);

        if (prs.length === 0) {
            return res.status(404).json({ msg: 'No PRs found' });
        }
        res.json(prs);

    } catch (error) {
        console.error('Error fetching PRs:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- GET /api/progress/consistency ---
// Returns a list of dates the user has logged a workout
router.get('/consistency', protect, async (req, res) => {
    try {
        // Find all workouts for the user
        const workouts = await WorkoutLog.find({
            userId: new mongoose.Types.ObjectId(req.user.id)
        })
        .select('date'); // Only select the date field

        if (!workouts || workouts.length === 0) {
            return res.status(404).json({ msg: 'No workout data found' });
        }

        // We need to format the data for the heatmap: [{ date: 'YYYY-MM-DD', count: 1 }]
        // We use a Set to only count each day once, even if multiple workouts were logged
        const dates = new Set();
        workouts.forEach(workout => {
            // Format date as 'YYYY-MM-DD'
            dates.add(workout.date.toISOString().split('T')[0]);
        });

        // Convert the Set of unique dates into the array format the heatmap needs
        const heatmapData = Array.from(dates).map(dateStr => ({
            date: dateStr,
            count: 1 // We'll just count 1 for "worked out"
        }));

        res.json(heatmapData);

    } catch (error) {
        console.error('Error fetching consistency data:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// We can add routes for /volume and /consistency later in a similar way

console.log('--- progressRoutes.js loaded ---');
module.exports = router;
