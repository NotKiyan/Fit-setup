import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';
import './PaymentResultPage.css';

const PaymentFailurePage = () => {
    const location = useLocation();
    const { orderId, totalAmount } = location.state || {};

    return (
        <div className="payment-result-container">
            <div className="container">
                <div className="payment-result-card failure">
                    <FaTimesCircle className="result-icon failure-icon" />
                    <h1>Payment Failed</h1>
                    <p className="result-message">
                        We're sorry, but your payment could not be processed at this time.
                    </p>

                    <div className="order-details">
                        <div className="detail-row">
                            <span className="detail-label">Order ID:</span>
                            <span className="detail-value">{orderId || 'N/A'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Amount:</span>
                            <span className="detail-value">₹{totalAmount?.toLocaleString() || '0'}</span>
                        </div>
                    </div>

                    <div className="result-info failure-info">
                        <p>✗ Payment was declined or interrupted</p>
                        <p>✗ Your order has not been placed</p>
                        <p>• Please check your payment details and try again</p>
                        <p>• Items are still in your cart</p>
                    </div>

                    <div className="result-actions">
                        <Link to="/checkout" className="btn btn-primary">
                            Try Again
                        </Link>
                        <Link to="/cart" className="btn btn-secondary">
                            Back to Cart
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailurePage;
