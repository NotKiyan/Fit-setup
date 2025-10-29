const express = require('express');
const router = express.Router();

// --- IMPORT and INITIALIZE Prisma Client ---
// Make sure @prisma/client is installed in your Backend folder
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // Create an instance of the client
// -----------------------------------------

// --- GET /api/exercises ---
// @desc    Fetch all exercises
// @access  Public (or Private if you add 'protect' middleware)
router.get('/', async (req, res) => {
    try {
        // Now 'prisma.exercise' should be defined
        const exercises = await prisma.exercise.findMany({
            orderBy: {
                name: 'asc' // Optional: Sort alphabetically
            }
        });

        // Ensure exercises have a consistent 'id' field for the frontend key prop
        // (Prisma usually uses 'id', Mongoose uses '_id'. Frontend expects 'id' here)
        const exercisesWithId = exercises.map(ex => ({ ...ex, id: ex.id })); // Use Prisma's default 'id'

        res.json(exercisesWithId);
    } catch (error) {
        console.error('Error fetching exercises:', error); // Log the specific Prisma error
        res.status(500).json({ msg: 'Server Error fetching exercises' });
    } finally {
        // Optional: Disconnect client after request if not using global instance
        // await prisma.$disconnect();
    }
});

module.exports = router;

// Optional: Graceful shutdown if client is initialized here
// process.on('exit', async () => { await prisma.$disconnect(); });
// process.on('SIGINT', async () => { await prisma.$disconnect(); process.exit(); });
// process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(); });
