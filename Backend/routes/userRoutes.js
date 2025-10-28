const express = require('express');
const router = express.Router();
const User = require('../models/User'); //
const { protect } = require('../middleware/auth'); //

// --- Route: GET /api/users/profile ---
// @desc    Get user profile data
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // Password excluded by default

        if (user) {
            res.json({
                _id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone_number: user.phone_number,
                // --- RETURN ADDRESS ---
                shipping_address: user.shipping_address || { street: '', city: '', zip_code: '' }, // Ensure address object exists
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            });
        } else {
            res.status(404).json({ msg: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error getting profile' });
    }
});

// --- Route: PUT /api/users/profile ---
// @desc    Update user profile data
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id); //

        if (user) {
            // Update basic fields
            user.first_name = req.body.first_name ?? user.first_name; // Use ?? nullish coalescing
            user.last_name = req.body.last_name ?? user.last_name;
            user.phone_number = req.body.phone_number ?? user.phone_number;

            // --- UPDATE ADDRESS ---
            // Ensure shipping_address object exists before trying to update its properties
            if (!user.shipping_address) {
                user.shipping_address = {};
            }
            // Update address fields if provided in the request body
            if (req.body.shipping_address) {
                user.shipping_address.street = req.body.shipping_address.street ?? user.shipping_address.street;
                user.shipping_address.city = req.body.shipping_address.city ?? user.shipping_address.city;
                user.shipping_address.zip_code = req.body.shipping_address.zip_code ?? user.shipping_address.zip_code;
                // Add state/country updates here if you include them in the schema
                // user.shipping_address.state = req.body.shipping_address.state ?? user.shipping_address.state;
                // user.shipping_address.country = req.body.shipping_address.country ?? user.shipping_address.country;
            }

            const updatedUser = await user.save(); //

            res.json({
                _id: updatedUser._id,
                email: updatedUser.email,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                phone_number: updatedUser.phone_number,
                // --- RETURN UPDATED ADDRESS ---
                shipping_address: updatedUser.shipping_address || { street: '', city: '', zip_code: '' }, //
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            });
        } else {
            res.status(404).json({ msg: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ msg: 'Validation Error', errors: error.errors });
        } else {
            res.status(500).json({ msg: 'Server Error updating profile' });
        }
    }
});

module.exports = router; //
