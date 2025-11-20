// routes/adminProductRoutes.js
const express = require('express');
const router = express.Router();
// 💡 Assuming your authentication middleware is here:
const { protect, admin } = require('../middleware/auth');
const {
    // Handlers from the previous step:
    processProductFiles,
    createProduct,
    updateProduct,
    // We need new handlers for the list/delete operations:
    // getAdminProducts, // If you need a view of ALL products including out-of-stock
    deleteProduct,
} = require('../controller/productController');

// ----------------------------------------------------
// ALL ROUTES BELOW REQUIRE ADMIN AUTHORIZATION
// ----------------------------------------------------

// --- Route: GET /api/admin/products ---
// @desc    Get all products (admin view)
// @access  Private (Admin)
router.get('/products', protect, admin, async (req, res) => {
    try {
        const Product = require('../models/Product');
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- Route: POST /api/admin/products ---
// @desc    Create a new product (Handles file upload via processProductFiles)
// @access  Private (Admin)
router.post(
    '/products',
    protect,
    admin,
    processProductFiles, // 👈 Middleware to handle files and Cloudinary upload
    createProduct
);

// --- Route: PUT /api/admin/products/:id ---
// @desc    Update an existing product (Handles file upload/merge via processProductFiles)
// @access  Private (Admin)
router.put(
    '/products/:id',
    protect,
    admin,
    processProductFiles, // 👈 Middleware to handle files and merge old URLs
    updateProduct
);

// --- Route: DELETE /api/admin/products/:id ---
// @desc    Delete a product
// @access  Private (Admin)
// ⚠️ NOTE: The DELETE operation also destroys the images on Cloudinary.
router.delete('/products/:id', protect, admin, deleteProduct);

module.exports = router;
