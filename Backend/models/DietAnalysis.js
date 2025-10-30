const mongoose = require('mongoose');

const DietAnalysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true, // One analysis form per user
        index: true,
    },
    username: { type: String },
    age: { type: Number },
    dob: { type: Date },
    height: { type: Number },
    weight: { type: Number },
    phone: { type: String },
    mail: { type: String },
    dietType: { type: String }, // 'vegetarian' or 'non-vegetarian'
    allergies: { type: String },
    avoidedfood: { type: String },
    alcohol: { type: String }, // 'yes' or 'no'
    special_diet: { type: String },
    exercise: { type: String }, // 'yes' or 'no'
    exerfreq: { type: Number },
    reasons: { type: [String], default: [] }, // From checkboxes
    other_reason: { type: String },
    addinfo: { type: String },
    feedback: { type: String },
}, {
    timestamps: true,
    collection: 'dietanalyses'
});

const DietAnalysis = mongoose.model('DietAnalysis', DietAnalysisSchema);
module.exports = DietAnalysis;
