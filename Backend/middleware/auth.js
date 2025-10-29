const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes:
 * 1. Checks for a valid JWT in the Authorization header.
 * 2. Verifies the token.
 * 3. Attaches the user object (minus password) to req.user.
 */
const protect = async (req, res, next) => {
    let token;

    // Check if the Authorization header exists and starts with "Bearer"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from the header (e.g., "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by the ID from the token's payload
            // **THIS IS THE CHANGE (Line 1)**
            const user = await User.findById(decoded.id).select('-password');

            // **THIS IS THE CHANGE (Line 2) - THE CHECK**
            if (!user) {
                return res.status(401).json({ msg: 'Not authorized, user not found' });
            }

            // **THIS IS THE CHANGE (Line 3)**
            // Attach the *found* user to the request
            req.user = user;

            // Proceed to the next middleware or the route handler
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ msg: 'Not authorized, token failed' });
        }
    }

    // If no token is found in the header
    if (!token) {
        res.status(401).json({ msg: 'Not authorized, no token' });
    }
};

/**
 * Middleware to check if user is an admin.
 * This middleware should be used AFTER the 'protect' middleware.
 */
const admin = (req, res, next) => {
    // req.user is attached by the 'protect' middleware
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed
    } else {
        // User is authenticated but not an admin
        res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }
};

// Export both middlewares
module.exports = { protect, admin };
