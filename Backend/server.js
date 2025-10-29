// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Ensure this path is correct
const prisma = require('./config/prismaClient'); // Assuming you have this for Prisma

// Initialize Express app
const app = express();

// Connect to MongoDB Database
connectDB();

// --- Middleware ---
app.use(cors()); // Enable CORS
app.use(express.json()); // Body parser for JSON

// --- API Routes ---
app.get('/', (req, res) => res.send('Fitsetup API is running...'));

// Mount existing routes
app.use('/api/auth', require('./routes/auth')); //
app.use('/api/users', require('./routes/userRoutes')); //
app.use('/api/admin', require('./routes/adminRoutes')); //
// Assuming you have a product routes file, ensure it's mounted
app.use('/api/products', require('./routes/productRoutes')); //

// --- ADD THESE LINES for exercises and training plans ---
app.use('/api/exercises', require('./routes/exerciseRoutes')); // Assumes exerciseRoutes.js exists
app.use('/api/trainingplans', require('./routes/trainingPlanRoutes')); // Assumes trainingPlanRoutes.js exists
app.use('/api/workoutlog', require('./routes/workoutLogRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
// --------------------------------------------------------

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// --- Optional: Prisma Client Shutdown ---
async function shutdown() {
    if(prisma) { // Check if prisma client exists before disconnecting
        await prisma.$disconnect();
        console.log('Prisma client disconnected.');
    }
    process.exit(0);
}
process.on('SIGINT', shutdown); // Handle Ctrl+C
process.on('SIGTERM', shutdown); // Handle termination signals
