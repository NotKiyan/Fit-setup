const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Your existing User model
const PersonalInfo = require('../models/PersonalInfo'); // Import the new model
const { protect } = require('../middleware/auth'); // Your auth middleware

// --- GET /api/users/profile (Existing route - Keep as is) ---
// (Your existing code for fetching profile details)
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        // *** ALSO FETCH PERSONAL INFO HERE ***
        const personalInfo = await PersonalInfo.findOne({ userId: req.user.id });

        res.json({
            // Include existing user details
            _id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: user.phone_number,
            shipping_address: user.shipping_address,
            shipping_addresses: user.shipping_addresses || [],
            // *** ADD PERSONAL INFO TO RESPONSE ***
            personalInfo: personalInfo || {}, // Send fetched data or empty object
            // role: user.role, // Include role if needed elsewhere
            // createdAt: user.createdAt,
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});


// --- PUT /api/users/profile (Existing route - Keep as is) ---
// (Your existing code for updating name, phone, address)
router.put('/profile', protect, async (req, res) => {
    // ... your existing logic to update User model fields ...
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.first_name = req.body.first_name || user.first_name;
            user.last_name = req.body.last_name || user.last_name;
            user.phone_number = req.body.phone_number || user.phone_number;

            // Update shipping address if provided (legacy single address)
            if (req.body.shipping_address) {
                user.shipping_address = {
                    street: req.body.shipping_address.street || user.shipping_address.street,
                    city: req.body.shipping_address.city || user.shipping_address.city,
                    zip_code: req.body.shipping_address.zip_code || user.shipping_address.zip_code,
                    // Add state/country if needed
                };
            }

            // Update shipping addresses array if provided (new multiple addresses)
            if (req.body.shipping_addresses !== undefined) {
                user.shipping_addresses = req.body.shipping_addresses;
            }

            const updatedUser = await user.save();

            // *** ALSO FETCH PERSONAL INFO TO SEND BACK ***
            const personalInfo = await PersonalInfo.findOne({ userId: req.user.id });


            res.json({
                _id: updatedUser._id,
                email: updatedUser.email,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                phone_number: updatedUser.phone_number,
                shipping_address: updatedUser.shipping_address,
                shipping_addresses: updatedUser.shipping_addresses,
                // *** ADD PERSONAL INFO TO RESPONSE ***
                personalInfo: personalInfo || {},
                // role: updatedUser.role,
            });
        } else {
            res.status(404).json({ msg: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- PUT /api/users/change-password (Existing route - Keep as is) ---
// (Your existing code for changing password)
router.put('/change-password', protect, async(req, res) => {
    // ... your existing password change logic ...
    const { currentPassword, newPassword } = req.body;

    // Basic validation
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ msg: 'Please provide current and new passwords' });
    }
    if (newPassword.length < 8) {
        return res.status(400).json({ msg: 'New password must be at least 8 characters' });
    }


    try {
        // Fetch user *including* password this time
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if current password matches
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Incorrect current password' });
        }

        // Hash the new password (the pre-save hook handles this)
        user.password = newPassword;
        await user.save();

        res.json({ msg: 'Password updated successfully' });

    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});


// --- *** NEW ROUTE: PUT /api/users/profile/personal *** ---
router.put('/profile/personal', protect, async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the protect middleware
        const userEmail = req.user.email; // Get user email from the protect middleware
        const personalInfoData = req.body; // Get the data sent from the frontend

        // Prepare the data, ensuring email and userId are included
        const updateData = {
            ...personalInfoData,
            userId: userId, // Ensure userId is set
            email: userEmail, // Ensure email is set
        };

        // Find the document for this user and update it, or create it if it doesn't exist
        const updatedPersonalInfo = await PersonalInfo.findOneAndUpdate(
            { userId: userId }, // Find by userId
            { $set: updateData }, // Apply the updates
            {
                new: true, // Return the updated document
                upsert: true, // Create the document if it doesn't exist
                runValidators: true, // Run schema validations
                setDefaultsOnInsert: true, // Apply defaults if creating new
            }
        );

        if (!updatedPersonalInfo) {
            // This should theoretically not happen with upsert: true, but handle defensively
            return res.status(404).json({ msg: 'Could not find or create personal info document.' });
        }


        // Send back the updated personal info
        res.json(updatedPersonalInfo);

    } catch (error) {
        console.error('Error updating personal info:', error);
        // Handle potential validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ msg: 'Validation Error', errors: error.errors });
        }
        res.status(500).json({ msg: 'Server Error saving personal info' });
    }
});


module.exports = router;
