import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css'; // We'll create this CSS file next

// --- SVG Icons ---
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);


export default function CartPage() {
    // --- Mock Cart Data ---
    // In a real app, this would come from context, state management, or API
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Pro-Grade Dumbbell Set (20kg)', price: 249.99, quantity: 1, image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop' },
                                               { id: 4, name: 'Kettlebell Pro (16kg)', price: 79.99, quantity: 2, image: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?q=80&w=1169&auto=format&fit=crop' },
    ]);

    const [subtotal, setSubtotal] = useState(0);
    const [shippingCost, setShippingCost] = useState(15.00); // Example shipping cost
    const [total, setTotal] = useState(0);

    // --- Calculate Totals ---
    useEffect(() => {
        const newSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setSubtotal(newSubtotal);
        setTotal(newSubtotal + shippingCost);
    }, [cartItems, shippingCost]);

    // --- Handlers ---
    const handleQuantityChange = (id, delta) => {
        setCartItems(currentItems =>
        currentItems.map(item =>
        item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) } // Ensure quantity doesn't go below 1
        : item
        ).filter(item => item.quantity > 0) // Optionally remove item if quantity becomes 0, though we prevent going below 1 here.
        );
    };

    const handleRemoveItem = (id) => {
        setCartItems(currentItems => currentItems.filter(item => item.id !== id));
    };

    // --- Render Logic ---
    if (cartItems.length === 0) {
        return (
            <div className="cart-page-container empty-cart">
            <h2>Your Shopping Cart is Empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/equipments" className="btn btn-primary">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="cart-page-container">
        <h1>Shopping Cart</h1>
        <div className="cart-layout">
        {/* Cart Items List */}
        <div className="cart-items-list">
        {cartItems.map(item => (
            <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
            <h3 className="cart-item-name">{item.name}</h3>
            <p className="cart-item-price">${item.price.toFixed(2)}</p>
            </div>
            <div className="cart-item-quantity">
            <button onClick={() => handleQuantityChange(item.id, -1)} aria-label="Decrease quantity">
            <MinusIcon />
            </button>
            <span>{item.quantity}</span>
            <button onClick={() => handleQuantityChange(item.id, 1)} aria-label="Increase quantity">
            <PlusIcon />
            </button>
            </div>
            <p className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</p>
            <button className="cart-item-remove" onClick={() => handleRemoveItem(item.id)} aria-label="Remove item">
            <TrashIcon />
            </button>
            </div>
        ))}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
        <h2>Order Summary</h2>
        <div className="summary-row">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
        <span>Estimated Shipping</span>
        <span>${shippingCost.toFixed(2)}</span>
        </div>
        <hr className="summary-divider" />
        <div className="summary-row total-row">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
        </div>
        <button className="btn btn-primary checkout-btn">Proceed to Checkout</button>
        <Link to="/equipments" className="continue-shopping-link">Continue Shopping</Link>
        </div>
        </div>
        </div>
    );
}
