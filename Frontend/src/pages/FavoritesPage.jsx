import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import './FavoritesPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const FavoritesPage = () => {
    const navigate = useNavigate();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState({});

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            setLoading(false);
            return;
        }

        const user = JSON.parse(userStr);

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/wishlist`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setWishlistItems(data.items || []);
            } else {
                setError('Failed to load wishlist');
            }
        } catch (err) {
            console.error('Error fetching wishlist:', err);
            setError('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;

        const user = JSON.parse(userStr);

        try {
            const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setWishlistItems(data.wishlist.items || []);
            } else {
                alert('Failed to remove item');
            }
        } catch (err) {
            console.error('Error removing from wishlist:', err);
            alert('Failed to remove item');
        }
    };

    const handleAddToCart = async (productId, stock) => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Please login to add items to cart');
            return;
        }

        if (stock < 1) {
            alert('Product is out of stock');
            return;
        }

        const user = JSON.parse(userStr);

        try {
            setAddingToCart(prev => ({ ...prev, [productId]: true }));

            const response = await fetch(`${API_BASE_URL}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    productId: productId,
                    quantity: 1
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Item added to cart successfully!');
            } else {
                alert(data.msg || 'Failed to add item to cart');
            }
        } catch (err) {
            console.error('Error adding to cart:', err);
            alert('Failed to add item to cart');
        } finally {
            setAddingToCart(prev => ({ ...prev, [productId]: false }));
        }
    };

    if (loading) {
        return (
            <div className="favorites-page-container">
                <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <p>Loading wishlist...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="favorites-page-container">
                <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <h2>Error loading wishlist</h2>
                    <p>{error}</p>
                    <Link to="/equipments" className="btn btn-primary">Start Shopping</Link>
                </div>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="favorites-page-container">
                <div className="container empty-wishlist">
                    <FaHeart className="empty-icon" />
                    <h2>Your Wishlist is Empty</h2>
                    <p>Save your favorite items here for later!</p>
                    <Link to="/equipments" className="btn btn-primary">Start Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="favorites-page-container">
            <div className="container">
                <div className="favorites-header">
                    <h1>My Wishlist</h1>
                    <p>{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</p>
                </div>

                <div className="favorites-grid">
                    {wishlistItems.map(item => {
                        const product = item.productId;
                        if (!product) return null;

                        return (
                            <div key={product._id} className="favorite-item">
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveFromWishlist(product._id)}
                                    title="Remove from wishlist"
                                >
                                    <FaTrash />
                                </button>

                                <Link to={`/product/${product._id}`} className="favorite-item-image-link">
                                    <img
                                        src={product.images?.[0] || 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                        className="favorite-item-image"
                                    />
                                </Link>

                                <div className="favorite-item-details">
                                    <Link to={`/product/${product._id}`}>
                                        <h3 className="favorite-item-name">{product.name}</h3>
                                    </Link>

                                    <div className="favorite-item-price">
                                        <span className="current-price">₹{product.finalPrice?.toLocaleString()}</span>
                                        {product.discount > 0 && (
                                            <>
                                                <span className="original-price">₹{product.price?.toLocaleString()}</span>
                                                <span className="discount-badge">{product.discount}% OFF</span>
                                            </>
                                        )}
                                    </div>

                                    <div className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                        <span className="status-dot"></span>
                                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </div>

                                    <button
                                        className="btn btn-primary add-to-cart-btn"
                                        onClick={() => handleAddToCart(product._id, product.stock)}
                                        disabled={addingToCart[product._id] || product.stock < 1}
                                    >
                                        <FaShoppingCart />
                                        {addingToCart[product._id] ? 'Adding...' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FavoritesPage;
