const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// All routes here are protected by both authentication AND admin role
// Usage: router.METHOD(path, protect, admin, handler)

// ==================== PRODUCT MANAGEMENT ROUTES ====================

// --- Route: GET /api/admin/products ---
// @desc    Get all products (admin view)
// @access  Private/Admin
router.get('/products', protect, admin, async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- Route: POST /api/admin/products ---
// @desc    Create a new product
// @access  Private/Admin
router.post('/products', protect, admin, async (req, res) => {
    const { name, description, price, discount, category, stock, image, featured } = req.body;

    try {
        const product = await Product.create({
            name,
            description,
            price,
            discount: discount || 0,
            category,
            stock,
            image: image || '',
            featured: featured || false,
        });

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Invalid product data', error: error.message });
    }
});

// --- Route: PUT /api/admin/products/:id ---
// @desc    Update a product (including discount)
// @access  Private/Admin
router.put('/products/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Update fields
        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.price = req.body.price !== undefined ? req.body.price : product.price;
        product.discount = req.body.discount !== undefined ? req.body.discount : product.discount;
        product.category = req.body.category || product.category;
        product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
        product.image = req.body.image !== undefined ? req.body.image : product.image;
        product.featured = req.body.featured !== undefined ? req.body.featured : product.featured;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(400).json({ msg: 'Failed to update product', error: error.message });
    }
});

// --- Route: DELETE /api/admin/products/:id ---
// @desc    Delete a product
// @access  Private/Admin
router.delete('/products/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        await Product.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Product removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// ==================== USER MANAGEMENT ROUTES ====================

// --- Route: GET /api/admin/users ---
// @desc    Get all users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- Route: DELETE /api/admin/users/:id ---
// @desc    Delete a user
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ msg: 'You cannot delete your own account' });
        }

        await User.deleteOne({ _id: req.params.id });
        res.json({ msg: 'User removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- Route: PUT /api/admin/users/:id/role ---
// @desc    Update user role (promote to admin or demote to customer)
// @access  Private/Admin
router.put('/users/:id/role', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Prevent admin from changing their own role
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ msg: 'You cannot change your own role' });
        }

        const { role } = req.body;

        if (!role || !['customer', 'admin'].includes(role)) {
            return res.status(400).json({ msg: 'Invalid role. Must be "customer" or "admin"' });
        }

        user.role = role;
        await user.save();

        res.json({ msg: `User role updated to ${role}`, user: { _id: user._id, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// ==================== STATISTICS ROUTES ====================

// --- Route: GET /api/admin/stats ---
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });

        res.json({
            totalUsers,
            totalProducts,
            totalAdmins,
            totalCustomers,
            lowStockProducts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
