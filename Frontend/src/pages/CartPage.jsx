import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CartPage.css'; // We'll create this CSS file next

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const [shippingCost, setShippingCost] = useState(0); // Free shipping
    const [total, setTotal] = useState(0);

    // Fetch cart data
    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            setLoading(false);
            return;
        }

        const user = JSON.parse(userStr);

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/cart`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCartItems(data.items || []);
            } else {
                setError('Failed to load cart');
            }
        } catch (err) {
            console.error('Error fetching cart:', err);
            setError('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    // --- Calculate Totals ---
    useEffect(() => {
        const newSubtotal = cartItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
        setSubtotal(newSubtotal);
        setTotal(newSubtotal + shippingCost);
    }, [cartItems, shippingCost]);

    // --- Handlers ---
    const handleQuantityChange = async (productId, delta) => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;

        const user = JSON.parse(userStr);
        // Handle both populated (object) and unpopulated (string) productId
        const productIdStr = typeof productId === 'object' ? productId._id : productId;
        const item = cartItems.find(item => {
            const itemProductId = typeof item.productId === 'object' ? item.productId._id : item.productId;
            return itemProductId === productIdStr;
        });
        if (!item) return;

        const newQuantity = Math.max(1, item.quantity + delta);

        try {
            const response = await fetch(`${API_BASE_URL}/cart/${productIdStr}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ quantity: newQuantity })
            });

            if (response.ok) {
                const data = await response.json();
                setCartItems(data.cart.items || []);
            } else {
                const data = await response.json();
                alert(data.msg || 'Failed to update quantity');
            }
        } catch (err) {
            console.error('Error updating quantity:', err);
            alert('Failed to update quantity');
        }
    };

    const handleRemoveItem = async (productId) => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;

        const user = JSON.parse(userStr);
        // Handle both populated (object) and unpopulated (string) productId
        const productIdStr = typeof productId === 'object' ? productId._id : productId;

        try {
            const response = await fetch(`${API_BASE_URL}/cart/${productIdStr}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCartItems(data.cart.items || []);
            } else {
                alert('Failed to remove item');
            }
        } catch (err) {
            console.error('Error removing item:', err);
            alert('Failed to remove item');
        }
    };

    // --- Render Logic ---
    if (loading) {
        return (
            <div className="cart-page-container empty-cart">
            <h2>Loading cart...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cart-page-container empty-cart">
            <h2>Error loading cart</h2>
            <p>{error}</p>
            <Link to="/equipments" className="btn btn-primary">Start Shopping</Link>
            </div>
        );
    }

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
            <div className="cart-item" key={item._id || item.productId}>
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
            <h3 className="cart-item-name">{item.name}</h3>
            <p className="cart-item-price">₹{item.finalPrice?.toLocaleString()}</p>
            </div>
            <div className="cart-item-quantity">
            <button onClick={() => handleQuantityChange(item.productId, -1)} aria-label="Decrease quantity">
            <MinusIcon />
            </button>
            <span>{item.quantity}</span>
            <button onClick={() => handleQuantityChange(item.productId, 1)} aria-label="Increase quantity">
            <PlusIcon />
            </button>
            </div>
            <p className="cart-item-total">₹{(item.finalPrice * item.quantity).toLocaleString()}</p>
            <button className="cart-item-remove" onClick={() => handleRemoveItem(item.productId)} aria-label="Remove item">
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
        <span>₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="summary-row">
        <span>Estimated Shipping</span>
        <span>{shippingCost > 0 ? `₹${shippingCost.toLocaleString()}` : 'FREE'}</span>
        </div>
        <hr className="summary-divider" />
        <div className="summary-row total-row">
        <span>Total</span>
        <span>₹{total.toLocaleString()}</span>
        </div>
        <Link to="/checkout" className="btn btn-primary checkout-btn">Proceed to Checkout</Link>
        <Link to="/equipments" className="continue-shopping-link">Continue Shopping</Link>
        </div>
        </div>
        </div>
    );
}
