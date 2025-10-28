const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Public routes for customers to view products

// --- Route: GET /api/products ---
// @desc    Get all products (public view)
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Only show products that are in stock
        const products = await Product.find({ stock: { $gt: 0 } }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- Route: GET /api/products/featured ---
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
    try {
        const products = await Product.find({ featured: true, stock: { $gt: 0 } }).limit(4);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- Route: GET /api/products/category/:category ---
// @desc    Get products by category
// @access  Public
router.get('/category/:category', async (req, res) => {
    try {
        const products = await Product.find({
            category: req.params.category,
            stock: { $gt: 0 }
        });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- Route: GET /api/products/:id ---
// @desc    Get a single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
