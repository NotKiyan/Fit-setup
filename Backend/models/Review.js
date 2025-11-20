const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
        index: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    userName: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        maxLength: 1000,
    },
    verified: {
        type: Boolean,
        default: false, // Can be set to true if user purchased the product
    },
}, {
    timestamps: true,
    collection: 'reviews'
});

// Compound index to prevent duplicate reviews from same user for same product
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
