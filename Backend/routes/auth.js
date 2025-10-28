const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// --- Helper Function to Generate JWT ---
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// --- Route: POST /api/auth/register ---
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        const user = await User.create({
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                email: user.email,
                role: user.role, // <-- FIX 1: Uncommented
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
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                email: user.email,
                role: user.role, // <-- FIX 2: Uncommented
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ msg: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error during login' });
    }
});

module.exports = router;
