import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './PaymentResultPage.css';

const PaymentSuccessPage = () => {
    const location = useLocation();
    const { orderId, orderNumber, totalAmount } = location.state || {};

    return (
        <div className="payment-result-container">
            <div className="container">
                <div className="payment-result-card success">
                    <FaCheckCircle className="result-icon success-icon" />
                    <h1>Payment Successful!</h1>
                    <p className="result-message">
                        Thank you for your order. Your payment has been processed successfully.
                    </p>

                    <div className="order-details">
                        <div className="detail-row">
                            <span className="detail-label">Order Number:</span>
                            <span className="detail-value">{orderNumber || 'N/A'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Amount Paid:</span>
                            <span className="detail-value">₹{totalAmount?.toLocaleString() || '0'}</span>
                        </div>
                    </div>

                    <div className="result-info">
                        <p>✓ Order confirmation has been sent to your email</p>
                        <p>✓ You can track your order from your profile</p>
                        <p>✓ Expected delivery: 3-7 business days</p>
                    </div>

                    <div className="result-actions">
                        <Link to="/profile" className="btn btn-primary">
                            View Order Details
                        </Link>
                        <Link to="/equipments" className="btn btn-secondary">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
