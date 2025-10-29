const mongoose = require('mongoose');

const PersonalInfoSchema = new mongoose.Schema({
    // Link to the main User model (using the User's _id)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Reference to your User model
        unique: true, // Each user should only have one personal info document
    },
    // Add the user's email directly as requested
    email: {
        type: String,
        required: true,
        unique: true, // Also ensure email is unique here
    },
    // Fields matching the frontend state
    gender: { type: String, default: '' },
    equipmentUse: { type: [String], default: [] },
    equipmentSelect: {
        freeWeights: { type: [String], default: [] },
        machines: { type: [String], default: [] },
        benchRack: { type: [String], default: [] },
        cardio: { type: [String], default: [] },
    },
    workoutFrequency: { type: String, default: '' }, // Or Number if appropriate
    mainGoal: { type: String, default: '' },
    workoutPriorities: { type: [String], default: [] },
    height: { type: String, default: '' }, // Or Number
    currentWeight: { type: String, default: '' }, // Or Number
    targetWeight: { type: String, default: '' }, // Or Number
    hasInjuries: { type: String, default: '' }, // 'yes' or 'no'
    injuredAreas: { type: [String], default: [] },
    trainingExperience: { type: String, default: '' },
    wantsHomeGym: { type: String, default: '' }, // 'yes' or 'no'
    roomSpecs: {
        width: { type: String, default: '' }, // Or Number
        height: { type: String, default: '' }, // Or Number
        depth: { type: String, default: '' }, // Or Number
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt
});

// Create and export the model
const PersonalInfo = mongoose.model('PersonalInfo', PersonalInfoSchema, 'personalinfo'); // Explicitly set collection name
module.exports = PersonalInfo;
