import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductPage.css';
import { FaStar, FaTruck, FaShieldAlt, FaCheck, FaRulerCombined, FaWeightHanging } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ProductPage = () => {
    const { id } = useParams();
    // State for image gallery
    const [selectedImage, setSelectedImage] = useState(0);
    // State for quantity
    const [quantity, setQuantity] = useState(1);
    // State for active tab
    const [activeTab, setActiveTab] = useState('description');
    // State for product data
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // State for reviews
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        title: '',
        comment: ''
    });
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');
    const [canReview, setCanReview] = useState(false);
    const [reviewEligibility, setReviewEligibility] = useState(null);

    // Fetch product data from API
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/products/${id}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const data = await response.json();
                setProduct(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            if (!id) return;
            try {
                setReviewsLoading(true);
                const response = await fetch(`${API_BASE_URL}/reviews/product/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                }
            } catch (err) {
                console.error('Error fetching reviews:', err);
            } finally {
                setReviewsLoading(false);
            }
        };
        fetchReviews();
    }, [id]);

    // Check if user can review
    useEffect(() => {
        const checkReviewEligibility = async () => {
            if (!id) return;

            const userStr = localStorage.getItem('user');
            if (!userStr) {
                setCanReview(false);
                return;
            }

            const user = JSON.parse(userStr);

            try {
                const response = await fetch(`${API_BASE_URL}/reviews/can-review/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCanReview(data.canReview);
                    setReviewEligibility(data);
                }
            } catch (err) {
                console.error('Error checking review eligibility:', err);
                setCanReview(false);
            }
        };

        checkReviewEligibility();
    }, [id]);

    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const handleQuantityChange = (type) => {
        if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
        if (type === 'inc') setQuantity(quantity + 1);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewError('');
        setReviewSuccess('');

        // Get user from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            setReviewError('Please login to submit a review');
            return;
        }

        const user = JSON.parse(userStr);

        try {
            const response = await fetch(`${API_BASE_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    productId: id,
                    ...reviewForm
                })
            });

            const data = await response.json();

            if (response.ok) {
                setReviewSuccess('Review submitted successfully!');
                setReviewForm({ rating: 5, title: '', comment: '' });
                setShowReviewForm(false);
                setCanReview(false); // User can't review again
                // Refresh reviews
                const reviewsResponse = await fetch(`${API_BASE_URL}/reviews/product/${id}`);
                if (reviewsResponse.ok) {
                    const reviewsData = await reviewsResponse.json();
                    setReviews(reviewsData);
                }
                // Refresh product to update rating
                const productResponse = await fetch(`${API_BASE_URL}/products/${id}`);
                if (productResponse.ok) {
                    const productData = await productResponse.json();
                    setProduct(productData);
                }
                // Update eligibility
                setReviewEligibility({
                    canReview: false,
                    hasPurchased: true,
                    hasReviewed: true
                });
            } else {
                setReviewError(data.msg || 'Failed to submit review');
            }
        } catch (err) {
            console.error('Error submitting review:', err);
            setReviewError('Failed to submit review. Please try again.');
        }
    };

    // Convert specs object to array format for display
    const getSpecsArray = () => {
        if (!product?.specs) return [];
        if (Array.isArray(product.specs)) return product.specs;

        // Convert object to array
        return Object.entries(product.specs).map(([label, value]) => {
            let formattedValue;

            // Handle arrays
            if (Array.isArray(value)) {
                formattedValue = value.join(', ');
            }
            // Handle nested objects
            else if (typeof value === 'object' && value !== null) {
                formattedValue = Object.entries(value)
                    .map(([key, val]) => `${key}: ${val}`)
                    .join(', ');
            }
            // Handle primitives
            else {
                formattedValue = String(value);
            }

            return {
                label: label.charAt(0).toUpperCase() + label.slice(1).replace(/([A-Z])/g, ' $1').trim(),
                value: formattedValue
            };
        });
    };

    if (loading) {
        return (
            <div className="product-page-container">
                <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <p>Loading product...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-page-container">
                <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <p>Product not found</p>
                    <Link to="/equipments">← Back to Products</Link>
                </div>
            </div>
        );
    }

    const productImages = product.images && product.images.length > 0
        ? product.images
        : ['https://via.placeholder.com/600'];

        return (
            <div className="product-page-container">
            <div className="container">

            {/* Breadcrumbs */}
            <div className="breadcrumbs">
            <Link to="/">Home</Link> / <Link to="/equipments">{product.category || 'Products'}</Link> / <span>{product.name}</span>
            </div>

            <div className="product-main-wrapper">
            {/* Left Column: Image Gallery */}
            <div className="product-gallery">
            <div className="main-image-container">
            <img
            src={productImages[selectedImage] || "https://via.placeholder.com/600"}
            alt={product.name}
            className="main-image"
            />
            </div>
            <div className="thumbnail-list">
            {productImages.map((img, index) => (
                <div
                key={index}
                className={`thumbnail-item ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
                >
                <img src={img || "https://via.placeholder.com/100"} alt={`View ${index + 1}`} />
                </div>
            ))}
            </div>
            </div>

            {/* Right Column: Product Details */}
            <div className="product-details">
            <div className="brand-badge">FITSETUP PRO</div>
            <h1 className="product-title">{product.name}</h1>

            <div className="product-meta">
            <div className="rating-container">
            <span className="stars">
            {[...Array(5)].map((_, i) => (
                <FaStar key={i} color={i < Math.floor(product.rating || 0) ? "#fca311" : "#e4e5e9"} />
            ))}
            </span>
            <span className="review-count">({product.numReviews || 0} Reviews)</span>
            </div>
            <span className="sku">SKU: {product.sku || 'N/A'}</span>
            </div>

            <div className="price-container">
            <span className="current-price">₹{(product.finalPrice || product.price).toLocaleString()}</span>
            {product.discount > 0 && (
                <span className="original-price">₹{product.price.toLocaleString()}</span>
            )}
            {product.discount > 0 && (
                <span className="discount-badge">
                {product.discount}% OFF
                </span>
            )}
            </div>

            <p className="short-description">{product.shortDesc || product.description?.substring(0, 200) + '...'}</p>

            {/* Key Features Icons */}
            <div className="key-features">
            <div className="feature-item">
            <FaTruck /> <span>Free Shipping</span>
            </div>
            <div className="feature-item">
            <FaShieldAlt /> <span>5 Year Warranty</span>
            </div>
            <div className="feature-item">
            <FaCheck /> <span>Installation Available</span>
            </div>
            </div>

            <hr className="divider" />

            <div className="actions-container">
            <div className="quantity-selector">
            <button onClick={() => handleQuantityChange('dec')}>-</button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantityChange('inc')}>+</button>
            </div>
            <button className="btn btn-primary add-to-cart-btn">
            Add to Cart
            </button>
            </div>

            <div className="stock-status">
            <span className={`status-dot ${product.stock > 0 ? 'green' : 'red'}`}></span>
            {product.stock > 0 ? 'In Stock & Ready to Ship' : 'Out of Stock'}
            </div>
            </div>
            </div>

            {/* Tabbed Information Section */}
            <div className="product-tabs-section">
            <div className="tabs-header">
            <button
            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
            >
            Description
            </button>
            <button
            className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
            >
            Specifications
            </button>
            <button
            className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipping')}
            >
            Shipping & Installation
            </button>
            </div>

            <div className="tab-content">
            {activeTab === 'description' && (
                <div className="description-content fade-in">
                <h3>Product Overview</h3>
                <p>{product.description || 'No description available.'}</p>
                </div>
            )}

            {activeTab === 'specs' && (
                <div className="specs-content fade-in">
                <h3>Technical Specifications</h3>
                <div className="specs-grid">
                {getSpecsArray().length > 0 ? (
                    getSpecsArray().map((spec, index) => (
                        <div key={index} className="spec-item">
                        <span className="spec-label">{spec.label}</span>
                        <span className="spec-value">{spec.value}</span>
                        </div>
                    ))
                ) : (
                    <p>No specifications available.</p>
                )}
                </div>
                </div>
            )}

            {activeTab === 'shipping' && (
                <div className="shipping-content fade-in">
                <h3>Delivery Information</h3>
                <ul className="info-list">
                <li><strong>Dispatch:</strong> Within 24-48 hours of order placement.</li>
                <li><strong>Delivery Time:</strong> 3-7 business days depending on location.</li>
                <li><strong>Installation:</strong> Our technician will visit within 48 hours of delivery for assembly.</li>
                </ul>
                </div>
            )}
            </div>
            </div>

            {/* Reviews Section */}
            <div className="product-reviews-section">
                <h2 className="reviews-heading">Customer Reviews</h2>

                {/* Review Summary */}
                <div className="review-summary">
                    <div className="summary-left">
                        <div className="average-rating">
                            <span className="rating-number">{product.rating || 0}</span>
                            <div className="rating-stars">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} color={i < Math.floor(product.rating || 0) ? "#fca311" : "#e4e5e9"} />
                                ))}
                            </div>
                            <p className="total-reviews">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
                        </div>
                    </div>
                    <div className="summary-right">
                        {canReview && (
                            <button
                                className="btn btn-primary write-review-btn"
                                onClick={() => setShowReviewForm(!showReviewForm)}
                            >
                                {showReviewForm ? 'Cancel' : 'Write a Review'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                    <div className="review-form-container">
                        <h3>Write Your Review</h3>
                        {reviewError && <div className="alert alert-error">{reviewError}</div>}
                        {reviewSuccess && <div className="alert alert-success">{reviewSuccess}</div>}

                        <form onSubmit={handleReviewSubmit} className="review-form">
                            <div className="form-group">
                                <label>Rating</label>
                                <div className="star-rating-input">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            size={28}
                                            color={star <= reviewForm.rating ? "#fca311" : "#e4e5e9"}
                                            style={{ cursor: 'pointer', marginRight: '5px' }}
                                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Review Title</label>
                                <input
                                    type="text"
                                    value={reviewForm.title}
                                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                                    placeholder="Summarize your review"
                                    maxLength={100}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Review</label>
                                <textarea
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    placeholder="Share your experience with this product"
                                    rows={5}
                                    maxLength={1000}
                                    required
                                />
                                <small>{reviewForm.comment.length}/1000 characters</small>
                            </div>

                            <button type="submit" className="btn btn-primary">Submit Review</button>
                        </form>
                    </div>
                )}

                {/* Reviews List */}
                <div className="reviews-list">
                    {reviewsLoading ? (
                        <p>Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                        <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="review-item">
                                <div className="review-header">
                                    <div className="reviewer-info">
                                        <div className="reviewer-avatar">
                                            {review.userName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="reviewer-details">
                                            <span className="reviewer-name">{review.userName}</span>
                                            {review.verified && (
                                                <span className="verified-badge">Verified Purchase</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="review-meta">
                                        <div className="review-rating">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} size={16} color={i < review.rating ? "#fca311" : "#e4e5e9"} />
                                            ))}
                                        </div>
                                        <span className="review-date">
                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                                <h4 className="review-title">{review.title}</h4>
                                <p className="review-comment">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            </div>
            </div>
        );
};

export default ProductPage;
