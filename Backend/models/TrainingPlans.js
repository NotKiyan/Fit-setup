// Example Backend/models/TrainingPlan.js
const mongoose = require('mongoose');

const ExerciseDetailSchema = new mongoose.Schema({
    exerciseId: { type: Number, required: true }, // <--- THE FIX
    name: { type: String, required: true },
    reps: { type: String, default: '' },
    time: { type: String, default: '' },
}, { _id: false });

const TrainingPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    planName: { // Allow users to name their plans
        type: String,
        required: true,
        default: 'My Training Plan'
    },
    isAIPlan: { // Differentiate AI plans
        type: Boolean,
        default: false
    },
    exercises: [ExerciseDetailSchema], // Array of exercises in the plan
}, {
    timestamps: true,
    collection: 'trainingplans' // Explicit collection name
});

module.exports = mongoose.model('TrainingPlan', TrainingPlanSchema);
