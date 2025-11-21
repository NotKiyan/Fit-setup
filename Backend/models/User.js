const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for the User model
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please provide a valid email address',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },

    role: {
        type: String,
        required: true,
        default: 'customer',
    },
    isActive: {
        type: Boolean,
        default: true
    },
    ageGroup: {
        type: String,
        enum: ['18-24', '25-34', '35-44', '45-54', '55+', 'Not specified'],
        default: 'Not specified'
    },
    experienceLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Expert', 'Not specified'],
        default: 'Not specified'
    },
    // ----------------------

    first_name: {
        type: String,
        maxLength: 100,
        default: ''
    },
    last_name: {
        type: String,
        maxLength: 100,
        default: ''
    },
    phone_number: {
        type: String,
        maxLength: 20,
        default: ''
    },
    shipping_address: {
        street: { type: String, maxLength: 255, default: '' },
        city: { type: String, maxLength: 100, default: '' },
        zip_code: { type: String, maxLength: 20, default: '' },
    },
    shipping_addresses: [{
        firstName: { type: String, maxLength: 100, default: '' },
        lastName: { type: String, maxLength: 100, default: '' },
        phone: { type: String, maxLength: 20, default: '' },
        address: { type: String, maxLength: 500, default: '' },
        city: { type: String, maxLength: 100, default: '' },
        state: { type: String, maxLength: 100, default: '' },
        pincode: { type: String, maxLength: 20, default: '' },
        country: { type: String, maxLength: 100, default: 'India' },
        isDefault: { type: Boolean, default: false }
    }]
}, {
    timestamps: true
});
// --- Mongoose Middleware ---
// Hash password before saving (remains the same)
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


// --- Mongoose Methods ---
// Method to compare entered password (remains the same)
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


// Create and export the User model
const User = mongoose.model('User', UserSchema);
module.exports = User;
