const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth'); // Our middleware "bouncer"

// --- Route: GET /api/users/profile ---
// @desc    Get user profile data
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        // The `protect` middleware has already verified the token
        // and attached the user object to the request (req.user)
        const user = await User.findById(req.user._id).select('-password');

        if (user) {
            res.json(user);
        } else {

            res.status(404).json({ msg: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
