const mongoose = require('mongoose');

const DietLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true,
    },
    date: {
        type: Date,
        required: true,
    },
    calories: {
        type: Number,
        required: true,
        min: 0,
    },
    notes: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true,
    collection: 'dietlogs'
});

// A user can only have one entry per day
DietLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const DietLog = mongoose.model('DietLog', DietLogSchema);
module.exports = DietLog;
