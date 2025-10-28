const express = require('express');
const router = express.Router();
const User = require('../models/User'); //
const jwt = require('jsonwebtoken');

// --- Helper Function to Generate JWT (remains the same) ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { //
        expiresIn: '30d',
    });
};

// --- Route: POST /api/auth/register (remains the same) ---
router.post('/register', async (req, res) => {
    // ... registration logic ...
    const { email, password } = req.body;

    try {
        const userExists = await User.findOne({ email }); //

        if (userExists) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        const user = await User.create({ //
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                email: user.email,
                // role: user.role, // Assuming role might be added later
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ msg: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});


// --- Route: POST /api/auth/login ---
// @desc    Authenticate a user and get a token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // --- MODIFICATION: Explicitly select the password ---
        const user = await User.findOne({ email }).select('+password'); //

        // Check if user exists AND password matches
        // The user.matchPassword method should now receive the correct hash
        if (user && (await user.matchPassword(password))) { //
            res.json({
                _id: user._id,
                email: user.email,
                // role: user.role, // Assuming role might be added later
                token: generateToken(user._id),
            });
        } else {
            // User not found OR password didn't match
            res.status(401).json({ msg: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error); // Log the actual error for debugging
        res.status(500).json({ msg: 'Server Error during login' }); // More specific error message
    }
});

module.exports = router;
