const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    },
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
    }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true,
    },
    items: [OrderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: 'India' },
        phone: { type: String, required: true },
        email: { type: String, required: true },
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'card', 'upi'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
    },
    orderStatus: {
        type: String,
        enum: ['processing', 'shipped', 'delivered', 'cancelled'],
        default: 'processing',
    },
    deliveredAt: {
        type: Date,
    },
}, {
    timestamps: true,
    collection: 'orders'
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
