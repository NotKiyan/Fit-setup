import { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('stats');
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Product form state
    const [productForm, setProductForm] = useState({
        name: '',
        description: '',
        price: '',
        discount: 0,
        category: 'Strength',
        stock: '',
        image: '',
        featured: false
    });

    const [editingProduct, setEditingProduct] = useState(null);

    // Fetch stats
    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            setStats(data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    // Fetch products
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5001/api/admin/products', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError('Failed to fetch products');
        }
        setLoading(false);
    };

    // Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5001/api/admin/users', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError('Failed to fetch users');
        }
        setLoading(false);
    };

    // Create or update product
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const url = editingProduct
                ? `http://localhost:5001/api/admin/products/${editingProduct._id}`
                : 'http://localhost:5001/api/admin/products';

            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(productForm)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
                setProductForm({
                    name: '',
                    description: '',
                    price: '',
                    discount: 0,
                    category: 'Strength',
                    stock: '',
                    image: '',
                    featured: false
                });
                setEditingProduct(null);
                fetchProducts();
            } else {
                setError(data.msg || 'Failed to save product');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        }
        setLoading(false);
    };

    // Delete product
    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`http://localhost:5001/api/admin/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.ok) {
                setSuccess('Product deleted successfully!');
                fetchProducts();
            } else {
                setError('Failed to delete product');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        }
    };

    // Edit product
    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            description: product.description,
            price: product.price,
            discount: product.discount,
            category: product.category,
            stock: product.stock,
            image: product.image,
            featured: product.featured
        });
        setActiveTab('products');
    };

    // Cancel edit
    const handleCancelEdit = () => {
        setEditingProduct(null);
        setProductForm({
            name: '',
            description: '',
            price: '',
            discount: 0,
            category: 'Strength',
            stock: '',
            image: '',
            featured: false
        });
    };

    // Delete user
    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`http://localhost:5001/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('User deleted successfully!');
                fetchUsers();
            } else {
                setError(data.msg || 'Failed to delete user');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        }
    };

    // Toggle user role
    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'customer' : 'admin';

        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        try {
            const response = await fetch(`http://localhost:5001/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.msg);
                fetchUsers();
            } else {
                setError(data.msg || 'Failed to update user role');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        }
    };

    // Load data when tab changes
    useEffect(() => {
        if (activeTab === 'stats') {
            fetchStats();
        } else if (activeTab === 'products') {
            fetchProducts();
        } else if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab]);

    // Auto-clear messages
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Welcome, {user.email}</p>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="admin-tabs">
                <button
                    className={activeTab === 'stats' ? 'active' : ''}
                    onClick={() => setActiveTab('stats')}
                >
                    Statistics
                </button>
                <button
                    className={activeTab === 'products' ? 'active' : ''}
                    onClick={() => setActiveTab('products')}
                >
                    Products
                </button>
                <button
                    className={activeTab === 'users' ? 'active' : ''}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
            </div>

            <div className="admin-content">
                {/* STATISTICS TAB */}
                {activeTab === 'stats' && (
                    <div className="stats-container">
                        <div className="stat-card">
                            <h3>Total Users</h3>
                            <p className="stat-number">{stats.totalUsers || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Total Products</h3>
                            <p className="stat-number">{stats.totalProducts || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Admins</h3>
                            <p className="stat-number">{stats.totalAdmins || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Customers</h3>
                            <p className="stat-number">{stats.totalCustomers || 0}</p>
                        </div>
                        <div className="stat-card warning">
                            <h3>Low Stock Products</h3>
                            <p className="stat-number">{stats.lowStockProducts || 0}</p>
                        </div>
                    </div>
                )}

                {/* PRODUCTS TAB */}
                {activeTab === 'products' && (
                    <div className="products-container">
                        <div className="product-form-section">
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <form onSubmit={handleProductSubmit}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Product Name *</label>
                                        <input
                                            type="text"
                                            value={productForm.name}
                                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Category *</label>
                                        <select
                                            value={productForm.category}
                                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                            required
                                        >
                                            <option value="Strength">Strength</option>
                                            <option value="Cardio">Cardio</option>
                                            <option value="Functional">Functional</option>
                                            <option value="Accessories">Accessories</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea
                                        value={productForm.description}
                                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                        required
                                        rows="3"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Price ($) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={productForm.price}
                                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Discount (%)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={productForm.discount}
                                            onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Stock *</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={productForm.stock}
                                            onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Image URL</label>
                                    <input
                                        type="text"
                                        value={productForm.image}
                                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                <div className="form-group checkbox-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={productForm.featured}
                                            onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                                        />
                                        Featured Product
                                    </label>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                                    </button>
                                    {editingProduct && (
                                        <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                                            Cancel Edit
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="products-list-section">
                            <h2>All Products</h2>
                            {loading ? (
                                <p>Loading...</p>
                            ) : products.length === 0 ? (
                                <p>No products found. Create your first product above.</p>
                            ) : (
                                <div className="products-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Category</th>
                                                <th>Price</th>
                                                <th>Discount</th>
                                                <th>Final Price</th>
                                                <th>Stock</th>
                                                <th>Featured</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map(product => (
                                                <tr key={product._id}>
                                                    <td>{product.name}</td>
                                                    <td>{product.category}</td>
                                                    <td>${product.price.toFixed(2)}</td>
                                                    <td>{product.discount}%</td>
                                                    <td>${product.finalPrice.toFixed(2)}</td>
                                                    <td className={product.stock < 10 ? 'low-stock' : ''}>{product.stock}</td>
                                                    <td>{product.featured ? 'Yes' : 'No'}</td>
                                                    <td className="action-buttons">
                                                        <button
                                                            className="btn-edit"
                                                            onClick={() => handleEditProduct(product)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn-delete"
                                                            onClick={() => handleDeleteProduct(product._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* USERS TAB */}
                {activeTab === 'users' && (
                    <div className="users-container">
                        <h2>All Users</h2>
                        {loading ? (
                            <p>Loading...</p>
                        ) : users.length === 0 ? (
                            <p>No users found.</p>
                        ) : (
                            <div className="users-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Phone</th>
                                            <th>Created At</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u._id}>
                                                <td>{u.email}</td>
                                                <td>
                                                    <span className={`role-badge ${u.role}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td>{u.firstName || '-'}</td>
                                                <td>{u.lastName || '-'}</td>
                                                <td>{u.phone || '-'}</td>
                                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                                <td className="action-buttons">
                                                    {u._id !== user._id && (
                                                        <>
                                                            <button
                                                                className="btn-role"
                                                                onClick={() => handleToggleRole(u._id, u.role)}
                                                            >
                                                                {u.role === 'admin' ? 'Demote' : 'Promote'}
                                                            </button>
                                                            <button
                                                                className="btn-delete"
                                                                onClick={() => handleDeleteUser(u._id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                                    {u._id === user._id && (
                                                        <span className="current-user-badge">You</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
