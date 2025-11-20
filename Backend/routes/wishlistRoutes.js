const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ userId: req.user._id })
            .populate({
                path: 'items.productId',
                select: 'name price finalPrice discount images stock category subCategory'
            });

        if (!wishlist) {
            // Create empty wishlist if doesn't exist
            wishlist = new Wishlist({ userId: req.user._id, items: [] });
            await wishlist.save();
        }

        res.json(wishlist);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST /api/wishlist
// @desc    Add item to wishlist
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { productId } = req.body;

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Find or create wishlist
        let wishlist = await Wishlist.findOne({ userId: req.user._id });
        if (!wishlist) {
            wishlist = new Wishlist({ userId: req.user._id, items: [] });
        }

        // Check if product already in wishlist
        const existingItem = wishlist.items.find(
            item => item.productId.toString() === productId
        );

        if (existingItem) {
            return res.status(400).json({ msg: 'Product already in wishlist' });
        }

        // Add new item to wishlist
        wishlist.items.push({
            productId: productId,
            addedAt: new Date()
        });

        await wishlist.save();

        // Populate product details before sending response
        await wishlist.populate({
            path: 'items.productId',
            select: 'name price finalPrice discount images stock category subCategory'
        });

        res.json({ msg: 'Item added to wishlist', wishlist });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   DELETE /api/wishlist/:productId
// @desc    Remove item from wishlist
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ userId: req.user._id });
        if (!wishlist) {
            return res.status(404).json({ msg: 'Wishlist not found' });
        }

        wishlist.items = wishlist.items.filter(
            item => item.productId.toString() !== productId
        );

        await wishlist.save();

        await wishlist.populate({
            path: 'items.productId',
            select: 'name price finalPrice discount images stock category subCategory'
        });

        res.json({ msg: 'Item removed from wishlist', wishlist });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   DELETE /api/wishlist
// @desc    Clear entire wishlist
// @access  Private
router.delete('/', protect, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.user._id });
        if (!wishlist) {
            return res.status(404).json({ msg: 'Wishlist not found' });
        }

        wishlist.items = [];
        await wishlist.save();

        res.json({ msg: 'Wishlist cleared', wishlist });
    } catch (error) {
        console.error('Error clearing wishlist:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET /api/wishlist/check/:productId
// @desc    Check if product is in wishlist
// @access  Private
router.get('/check/:productId', protect, async (req, res) => {
    try {
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({ userId: req.user._id });

        if (!wishlist) {
            return res.json({ inWishlist: false });
        }

        const inWishlist = wishlist.items.some(
            item => item.productId.toString() === productId
        );

        res.json({ inWishlist });
    } catch (error) {
        console.error('Error checking wishlist:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
