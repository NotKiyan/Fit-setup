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
    }
});

// --- Mongoose Middleware ---
// This function will run before a new user is saved to the database
UserSchema.pre('save', async function (next) {
    // If the password has not been modified, move to the next middleware
    if (!this.isModified('password')) {
        next();
    }

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


// --- Mongoose Methods ---
// Method to compare entered password with the hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


// Create and export the User model
const User = mongoose.model('User', UserSchema);
module.exports = User;
