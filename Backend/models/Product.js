const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true,
    },
    // Added SKU for inventory management (e.g. "TRD-800-AI")
    sku: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description'],
    },
    // Optional: Short description for the card view in listing pages
    shortDesc: {
        type: String,
        maxLength: 200
    },
    price: {
        type: Number,
        required: [true, 'Please provide a product price'],
        min: [0, 'Price cannot be negative'],
    },
    discount: {
        type: Number,
        default: 0,
            min: [0, 'Discount cannot be negative'],
            max: [100, 'Discount cannot exceed 100%'],
    },
    finalPrice: {
        type: Number,
    },
    category: {
        type: String,
        required: [true, 'Please provide a product category'],
        enum: ['Strength', 'Cardio', 'Functional', 'Accessories', 'Other'],
    },
    // Added SubCategory for better filtering (e.g. Category: Cardio -> Sub: Treadmill)
    subCategory: {
        type: String,
        trim: true
    },
    stock: {
        type: Number,
        required: [true, 'Please provide stock quantity'],
        min: [0, 'Stock cannot be negative'],
        default: 0,
    },

    // --- CHANGE 1: Support Multiple Images for Gallery ---
    // Instead of "image: String", we use an array to store multiple Cloudinary links
    images: [{
        type: String,
    }],

    featured: {
        type: Boolean,
        default: false,
    },

    // --- CHANGE 2: Ratings for the UI ---
    rating: {
        type: Number,
        default: 0,
            min: 0,
            max: 5
    },
    numReviews: {
        type: Number,
        default: 0
    },

    // Flexible Specs (Perfect choice!)
    specs: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true,
});

// Calculate final price before saving
ProductSchema.pre('save', function(next) {
    if (this.discount > 0) {
        this.finalPrice = this.price - (this.price * this.discount / 100);
    } else {
        this.finalPrice = this.price;
    }
    next();
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
