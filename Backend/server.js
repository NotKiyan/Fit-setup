// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Ensure this path is correct
const prisma = require('./config/prismaClient'); // Assuming you have this for Prisma
const fileUpload = require('express-fileupload');
// Initialize Express app
const app = express();

// Connect to MongoDB Database
connectDB();

// --- Middleware ---
app.use(cors()); // Enable CORS
app.use(express.json()); // Body parser for JSON
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',   // Specify a temporary directory
    limits: { fileSize: 50 * 1024 * 1024 }, // Optional: Limit file size (50MB)
}));

// --- API Routes ---
app.get('/', (req, res) => res.send('Fitsetup API is running...'));

// Mount existing routes
app.use('/api/auth', require('./routes/auth')); //
app.use('/api/users', require('./routes/userRoutes')); //
app.use('/api/admin', require('./routes/adminRoutes')); //
app.use('/api/admin', require('./routes/adminProductRoutes')); // Admin product routes with file upload
// Assuming you have a product routes file, ensure it's mounted
app.use('/api/products', require('./routes/productRoutes')); //

// --- ADD THESE LINES for exercises and training plans ---
app.use('/api/exercises', require('./routes/exerciseRoutes')); // Assumes exerciseRoutes.js exists
app.use('/api/trainingplans', require('./routes/trainingPlanRoutes')); // Assumes trainingPlanRoutes.js exists
app.use('/api/workoutlog', require('./routes/workoutLogRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/dietanalysis', require('./routes/dietAnalysisRoutes'));
app.use('/api/dietlog', require('./routes/dietRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

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
