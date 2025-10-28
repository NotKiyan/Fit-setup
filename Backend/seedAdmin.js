// Seed script to create an initial admin user
// Run this script once with: node seedAdmin.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const createAdminUser = async () => {
    try {
        // Connect to database
        await connectDB();

        // Admin credentials
        const adminEmail = 'admin@fitsetup.com';
        const adminPassword = 'Admin@123';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email:', existingAdmin.email);
            console.log('Role:', existingAdmin.role);
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
            firstName: 'Admin',
            lastName: 'User',
        });

        console.log('Admin user created successfully!');
        console.log('===================================');
        console.log('Email:', admin.email);
        console.log('Password:', adminPassword);
        console.log('Role:', admin.role);
        console.log('===================================');
        console.log('IMPORTANT: Save these credentials and change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error.message);
        process.exit(1);
    }
};

createAdminUser();
