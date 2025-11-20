const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            paymentMethod,
            totalAmount,
            orderStatus = 'processing',
            paymentStatus = 'pending'
        } = req.body;

        // Validate items
        if (!items || items.length === 0) {
            return res.status(400).json({ msg: 'No items in order' });
        }

        // Validate shipping address
        if (!shippingAddress || !shippingAddress.firstName || !shippingAddress.address || !shippingAddress.phone) {
            return res.status(400).json({ msg: 'Invalid shipping address' });
        }

        // Validate stock for all items
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ msg: `Product ${item.name} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ msg: `Not enough stock for ${item.name}` });
            }
        }

        // Create order
        const order = new Order({
            userId: req.user._id,
            items: items.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            shippingAddress: {
                fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                address: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                pincode: shippingAddress.pincode,
                country: shippingAddress.country || 'India',
                phone: shippingAddress.phone,
                email: shippingAddress.email
            },
            paymentMethod: paymentMethod,
            totalAmount: totalAmount,
            orderStatus: orderStatus,
            paymentStatus: paymentStatus
        });

        await order.save();

        // Update product stock
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } }
            );
        }

        res.status(201).json({
            msg: 'Order created successfully',
            order: order
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .populate('items.productId', 'name images');

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user._id
        }).populate('items.productId', 'name images');

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
