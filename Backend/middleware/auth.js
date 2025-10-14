const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
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
            // Attach the user object to the request, excluding the password
            req.user = await User.findById(decoded.id).select('-password');

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

module.exports = { protect };
