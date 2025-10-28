const mongoose = require('mongoose');

// Define the schema for the Product model
const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description'],
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
    stock: {
        type: Number,
        required: [true, 'Please provide stock quantity'],
        min: [0, 'Stock cannot be negative'],
        default: 0,
    },
    image: {
        type: String,
        default: '',
    },
    featured: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
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

// Create and export the Product model
const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
