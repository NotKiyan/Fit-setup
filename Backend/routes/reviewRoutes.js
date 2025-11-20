const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// --- Route: GET /api/reviews/product/:productId ---
// @desc    Get all reviews for a product
// @access  Public
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
            .sort({ createdAt: -1 })
            .select('-__v');

        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- Route: GET /api/reviews/can-review/:productId ---
// @desc    Check if user can review a product
// @access  Private
router.get('/can-review/:productId', protect, async (req, res) => {
    try {
        // Check if user has purchased and received the product
        const purchasedOrder = await Order.findOne({
            userId: req.user._id,
            'items.productId': req.params.productId,
            orderStatus: 'delivered'
        });

        // Check if user already reviewed
        const existingReview = await Review.findOne({
            productId: req.params.productId,
            userId: req.user._id
        });

        res.json({
            canReview: !!purchasedOrder && !existingReview,
            hasPurchased: !!purchasedOrder,
            hasReviewed: !!existingReview
        });
    } catch (error) {
        console.error('Error checking review eligibility:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// --- Route: POST /api/reviews ---
// @desc    Create a new review
// @access  Private (must be logged in AND purchased product)
router.post('/', protect, async (req, res) => {
    const { productId, rating, title, comment } = req.body;

    try {
        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Check if user has purchased and received the product
        const purchasedOrder = await Order.findOne({
            userId: req.user._id,
            'items.productId': productId,
            orderStatus: 'delivered'
        });

        if (!purchasedOrder) {
            return res.status(403).json({
                msg: 'You can only review products you have purchased and received'
            });
        }

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({
            productId,
            userId: req.user._id
        });

        if (existingReview) {
            return res.status(400).json({ msg: 'You have already reviewed this product' });
        }

        // Create review
        const review = await Review.create({
            productId,
            userId: req.user._id,
            userName: req.user.first_name || req.user.email.split('@')[0],
            rating,
            title,
            comment,
            verified: true // Mark as verified since they purchased it
        });

        // Update product rating and review count
        const allReviews = await Review.find({ productId });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        product.rating = Math.round(avgRating * 10) / 10; // Round to 1 decimal
        product.numReviews = allReviews.length;
        await product.save();

        res.status(201).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(400).json({ msg: 'Failed to create review', error: error.message });
    }
});

// --- Route: PUT /api/reviews/:id ---
// @desc    Update a review
// @access  Private (must be the review author)
router.put('/:id', protect, async (req, res) => {
    const { rating, title, comment } = req.body;

    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        // Check if user is the review author
        if (review.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: 'Not authorized to update this review' });
        }

        review.rating = rating || review.rating;
        review.title = title || review.title;
        review.comment = comment || review.comment;

        const updatedReview = await review.save();

        // Recalculate product rating
        const product = await Product.findById(review.productId);
        const allReviews = await Review.find({ productId: review.productId });
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        product.rating = Math.round(avgRating * 10) / 10;
        await product.save();

        res.json(updatedReview);
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(400).json({ msg: 'Failed to update review', error: error.message });
    }
});

// --- Route: DELETE /api/reviews/:id ---
// @desc    Delete a review
// @access  Private (must be the review author or admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ msg: 'Review not found' });
        }

        // Check if user is the review author or admin
        if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized to delete this review' });
        }

        const productId = review.productId;
        await review.deleteOne();

        // Recalculate product rating
        const product = await Product.findById(productId);
        const allReviews = await Review.find({ productId });

        if (allReviews.length > 0) {
            const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
            product.rating = Math.round(avgRating * 10) / 10;
            product.numReviews = allReviews.length;
        } else {
            product.rating = 0;
            product.numReviews = 0;
        }

        await product.save();

        res.json({ msg: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
