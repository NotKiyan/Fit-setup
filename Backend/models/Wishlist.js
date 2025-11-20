const mongoose = require('mongoose');

const WishlistItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const WishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [WishlistItemSchema]
}, {
    timestamps: true
});

// Prevent duplicate products in wishlist
WishlistSchema.index({ userId: 1, 'items.productId': 1 });

module.exports = mongoose.model('Wishlist', WishlistSchema);
