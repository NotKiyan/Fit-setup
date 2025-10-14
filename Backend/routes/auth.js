const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// --- Helper Function to Generate JWT ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};


// --- Route: POST /api/auth/register ---
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        // Create a new user instance
        const user = await User.create({
            email,
            password,
        });

        // If user is created successfully, generate a token
        if (user) {
            res.status(201).json({
                _id: user._id,
                email: user.email,
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
        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists and password matches
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ msg: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
