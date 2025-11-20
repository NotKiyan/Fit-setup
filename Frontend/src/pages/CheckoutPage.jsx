import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingPayment, setProcessingPayment] = useState(false);

    // Shipping Information
    const [shippingInfo, setShippingInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
    });

    // Payment Method
    const [paymentMethod, setPaymentMethod] = useState('cod'); // cod, card, upi

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    // Fetch cart items and user profile
    useEffect(() => {
        fetchCart();
        fetchUserProfile();
    }, []);

    const fetchCart = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
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

                // Redirect if cart is empty
                if (!data.items || data.items.length === 0) {
                    navigate('/cart');
                }
            }
        } catch (err) {
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;

        const user = JSON.parse(userStr);

        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();

                // Pre-fill shipping information from user profile
                // Try to use default address from shipping_addresses array
                let defaultAddress = null;
                if (Array.isArray(data.shipping_addresses) && data.shipping_addresses.length > 0) {
                    defaultAddress = data.shipping_addresses.find(addr => addr.isDefault) || data.shipping_addresses[0];
                }

                if (defaultAddress) {
                    setShippingInfo({
                        firstName: defaultAddress.firstName || '',
                        lastName: defaultAddress.lastName || '',
                        email: user.email || '',
                        phone: defaultAddress.phone || '',
                        address: defaultAddress.address || '',
                        city: defaultAddress.city || '',
                        state: defaultAddress.state || '',
                        pincode: defaultAddress.pincode || '',
                        country: defaultAddress.country || 'India'
                    });
                } else {
                    // Fallback to old format or basic user data
                    setShippingInfo({
                        firstName: data.first_name || '',
                        lastName: data.last_name || '',
                        email: user.email || '',
                        phone: data.phone_number || '',
                        address: data.shipping_address?.street || '',
                        city: data.shipping_address?.city || '',
                        state: '',
                        pincode: data.shipping_address?.zip_code || '',
                        country: 'India'
                    });
                }
            }
        } catch (err) {
            console.error('Error fetching user profile:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];

        for (let field of required) {
            if (!shippingInfo[field] || shippingInfo[field].trim() === '') {
                alert(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
                return false;
            }
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(shippingInfo.email)) {
            alert('Please enter a valid email address');
            return false;
        }

        // Validate phone
        if (shippingInfo.phone.length !== 10) {
            alert('Please enter a valid 10-digit phone number');
            return false;
        }

        // Validate pincode
        if (shippingInfo.pincode.length !== 6) {
            alert('Please enter a valid 6-digit pincode');
            return false;
        }

        return true;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }

        const user = JSON.parse(userStr);

        setProcessingPayment(true);

        try {
            // Create order
            const orderData = {
                items: cartItems.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.finalPrice,
                    quantity: item.quantity,
                    image: item.image
                })),
                shippingAddress: {
                    firstName: shippingInfo.firstName,
                    lastName: shippingInfo.lastName,
                    email: shippingInfo.email,
                    phone: shippingInfo.phone,
                    address: shippingInfo.address,
                    city: shippingInfo.city,
                    state: shippingInfo.state,
                    pincode: shippingInfo.pincode,
                    country: shippingInfo.country
                },
                paymentMethod: paymentMethod,
                totalAmount: total,
                orderStatus: 'processing',
                paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid'
            };

            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const data = await response.json();

                // Clear cart after successful order
                await fetch(`${API_BASE_URL}/cart`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                // Simulate payment processing delay
                setTimeout(() => {
                    // 90% success rate for dummy payment
                    const paymentSuccess = Math.random() > 0.1;

                    if (paymentSuccess) {
                        navigate('/payment-success', {
                            state: {
                                orderId: data.order._id,
                                orderNumber: data.order.orderNumber || data.order._id.slice(-8).toUpperCase(),
                                totalAmount: total
                            }
                        });
                    } else {
                        navigate('/payment-failure', {
                            state: {
                                orderId: data.order._id,
                                totalAmount: total
                            }
                        });
                    }
                }, 2000);
            } else {
                alert('Failed to create order. Please try again.');
                setProcessingPayment(false);
            }
        } catch (err) {
            console.error('Error placing order:', err);
            alert('Failed to place order. Please try again.');
            setProcessingPayment(false);
        }
    };

    if (loading) {
        return (
            <div className="checkout-page-container">
                <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <p>Loading checkout...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page-container">
            <div className="container">
                <h1>Checkout</h1>

                <div className="checkout-layout">
                    {/* Left Column - Forms */}
                    <div className="checkout-forms">
                        {/* Shipping Information */}
                        <div className="checkout-section">
                            <h2>Shipping Information</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={shippingInfo.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={shippingInfo.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={shippingInfo.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={shippingInfo.phone}
                                        onChange={handleInputChange}
                                        maxLength="10"
                                        required
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Address *</label>
                                    <textarea
                                        name="address"
                                        value={shippingInfo.address}
                                        onChange={handleInputChange}
                                        rows="3"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={shippingInfo.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={shippingInfo.state}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Pincode *</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={shippingInfo.pincode}
                                        onChange={handleInputChange}
                                        maxLength="6"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Country *</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={shippingInfo.country}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="checkout-section">
                            <h2>Payment Method</h2>
                            <div className="payment-methods">
                                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>Cash on Delivery</span>
                                </label>
                                <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>Credit/Debit Card (Dummy)</span>
                                </label>
                                <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="upi"
                                        checked={paymentMethod === 'upi'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <span>UPI (Dummy)</span>
                                </label>
                            </div>
                            {paymentMethod !== 'cod' && (
                                <p className="dummy-payment-note">
                                    Note: This is a dummy payment system. No actual payment will be processed.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="checkout-summary">
                        <h2>Order Summary</h2>

                        <div className="summary-items">
                            {cartItems.map(item => (
                                <div key={item.productId} className="summary-item">
                                    <img src={item.image} alt={item.name} />
                                    <div className="summary-item-details">
                                        <p className="summary-item-name">{item.name}</p>
                                        <p className="summary-item-qty">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="summary-item-price">₹{(item.finalPrice * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        <div className="summary-totals">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>{shipping > 0 ? `₹${shipping.toLocaleString()}` : 'FREE'}</span>
                            </div>
                            <hr />
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{total.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary place-order-btn"
                            onClick={handlePlaceOrder}
                            disabled={processingPayment}
                        >
                            {processingPayment ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
