// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();

// Connect to the database
connectDB();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS)
// This allows your React frontend (running on a different port) to communicate with the backend
app.use(cors());

// Enable Express to parse JSON in the request body
app.use(express.json());


// --- API Routes ---
// Define a basic route to confirm the server is running
app.get('/', (req, res) => res.send('Fitsetup API is running...'));

// Mount the authentication routes
app.use('/api/auth', require('./routes/auth'));


// --- Server Initialization ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
