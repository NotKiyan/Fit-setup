const mongoose = require('mongoose');

// Sub-schema for a single exercise *within* a workout
const ExerciseLogSchema = new mongoose.Schema({
    exerciseId: {
        type: String, // From Prisma
        required: true,
    },
    exerciseName: {
        type: String,
        required: true,
    },
    sets: [
        {
            reps: { type: Number },
            weight: { type: Number },
            timeInSeconds: { type: Number },
        }
    ],
    rpe: {
        type: Number,
        min: 1,
        max: 10,
    },
    notes: {
        type: String,
        trim: true,
        default: '',
    },
}, { _id: false }); // No separate _id for sub-documents

// Main document schema: one per day/session
const WorkoutLogSchema = new mongoose.Schema({ // <-- Keep original name
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', //
        index: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    workoutType: {
        type: String,
        trim: true,
        default: 'Workout',
    },
    exercises: [ExerciseLogSchema],

}, {
    timestamps: true, // Adds createdAt and updatedAt
});

// Compound index
WorkoutLogSchema.index({ userId: 1, date: -1 });

// Mongoose will create collection 'workoutlogs'
const WorkoutLog = mongoose.model('WorkoutLog', WorkoutLogSchema); // <-- Keep original name
module.exports = WorkoutLog;
