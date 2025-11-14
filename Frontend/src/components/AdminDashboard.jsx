import { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

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

    // User edit modal state
    const [editingUser, setEditingUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [userForm, setUserForm] = useState({
        email: '',
        first_name: '',
        last_name: '',
        role: 'customer',
        isActive: true,
        ageGroup: 'Not specified',
        experienceLevel: 'Not specified'
    });

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

    // Open edit user modal
    const handleEditUser = (userToEdit) => {
        setEditingUser(userToEdit);
        setUserForm({
            email: userToEdit.email || '',
            first_name: userToEdit.first_name || '',
            last_name: userToEdit.last_name || '',
            role: userToEdit.role || 'customer',
            isActive: userToEdit.isActive !== undefined ? userToEdit.isActive : true,
            ageGroup: userToEdit.ageGroup || 'Not specified',
            experienceLevel: userToEdit.experienceLevel || 'Not specified'
        });
        setShowEditModal(true);
    };

    // Close edit user modal
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingUser(null);
        setUserForm({
            email: '',
            first_name: '',
            last_name: '',
            role: 'customer',
            isActive: true,
            ageGroup: 'Not specified',
            experienceLevel: 'Not specified'
        });
    };

    // Submit user edit
    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:5001/api/admin/users/${editingUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(userForm)
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('User updated successfully!');
                handleCloseEditModal();
                fetchUsers();
            } else {
                setError(data.msg || 'Failed to update user');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        }
        setLoading(false);
    };

    // Toggle user status
    const handleToggleStatus = async (userId, currentStatus) => {
        const newStatus = !currentStatus;

        try {
            const response = await fetch(`http://localhost:5001/api/admin/users/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ isActive: newStatus })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.msg);
                fetchUsers();
            } else {
                setError(data.msg || 'Failed to update user status');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        }
    };

    // Reset user password
    const handleResetPassword = async (userId, userEmail) => {
        if (!window.confirm(`Send password reset email to ${userEmail}?`)) return;

        try {
            const response = await fetch(`http://localhost:5001/api/admin/users/${userId}/reset-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.msg);
            } else {
                setError(data.msg || 'Failed to send password reset');
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
                    <div className="stats-dashboard">
                        <h2>System Statistics & Demographics</h2>

                        <div className="stats-grid">
                            {/* LEFT COLUMN */}
                            <div className="stats-left-column">
                                {/* Pie Chart - Role Distribution */}
                                <div className="chart-card">
                                    <h3>User Role Distribution</h3>
                                    <div className="chart-container">
                                        {stats.roleDistribution && (
                                            <Pie
                                                data={{
                                                    labels: ['Admin', 'Customer'],
                                                    datasets: [{
                                                        data: [
                                                            stats.roleDistribution.admin || 0,
                                                            stats.roleDistribution.customer || 0
                                                        ],
                                                        backgroundColor: [
                                                            '#007bff',
                                                            '#28a745'
                                                        ],
                                                        borderColor: ['#fff', '#fff'],
                                                        borderWidth: 2
                                                    }]
                                                }}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: true,
                                                    plugins: {
                                                        legend: {
                                                            position: 'bottom'
                                                        },
                                                        tooltip: {
                                                            callbacks: {
                                                                label: function(context) {
                                                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                                    const percentage = ((context.parsed / total) * 100).toFixed(1);
                                                                    return `${context.label}: ${context.parsed} (${percentage}%)`;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* User Summary Table */}
                                <div className="summary-card">
                                    <h3>User Summary</h3>
                                    <div className="summary-table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Metric</th>
                                                    <th>Count</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><strong>Total Users</strong></td>
                                                    <td className="metric-value">{stats.totalUsers || 0}</td>
                                                </tr>
                                                <tr>
                                                    <td>Active Users</td>
                                                    <td className="metric-value success">{stats.activeUsers || 0}</td>
                                                </tr>
                                                <tr>
                                                    <td>Inactive Users</td>
                                                    <td className="metric-value muted">{stats.inactiveUsers || 0}</td>
                                                </tr>
                                                <tr className="highlight-row">
                                                    <td><strong>New Sign-ups (This Month)</strong></td>
                                                    <td className="metric-value primary">{stats.newSignupsThisMonth || 0}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="stats-right-column">
                                {/* Bar Chart - Age Group Distribution */}
                                <div className="chart-card">
                                    <h3>Age Group Distribution</h3>
                                    <div className="chart-container">
                                        {stats.ageGroupDistribution && (
                                            <Bar
                                                data={{
                                                    labels: Object.keys(stats.ageGroupDistribution),
                                                    datasets: [{
                                                        label: 'Number of Users',
                                                        data: Object.values(stats.ageGroupDistribution),
                                                        backgroundColor: '#667eea',
                                                        borderColor: '#5568d3',
                                                        borderWidth: 1
                                                    }]
                                                }}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: true,
                                                    scales: {
                                                        y: {
                                                            beginAtZero: true,
                                                            ticks: {
                                                                stepSize: 1
                                                            }
                                                        }
                                                    },
                                                    plugins: {
                                                        legend: {
                                                            display: false
                                                        }
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Bar Chart - Experience Level Distribution */}
                                <div className="chart-card">
                                    <h3>Experience Level Distribution</h3>
                                    <div className="chart-container">
                                        {stats.experienceLevelDistribution && (
                                            <Bar
                                                data={{
                                                    labels: Object.keys(stats.experienceLevelDistribution),
                                                    datasets: [{
                                                        label: 'Number of Users',
                                                        data: Object.values(stats.experienceLevelDistribution),
                                                        backgroundColor: '#f093fb',
                                                        borderColor: '#e066f0',
                                                        borderWidth: 1
                                                    }]
                                                }}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: true,
                                                    indexAxis: 'y',
                                                    scales: {
                                                        x: {
                                                            beginAtZero: true,
                                                            ticks: {
                                                                stepSize: 1
                                                            }
                                                        }
                                                    },
                                                    plugins: {
                                                        legend: {
                                                            display: false
                                                        }
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Stats Table */}
                        <div className="additional-stats">
                            <h3>Product Statistics</h3>
                            <div className="stats-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Metric</th>
                                            <th>Count</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="metric-name">Total Products</td>
                                            <td className="metric-value">{stats.totalProducts || 0}</td>
                                            <td className="metric-desc">Products available in inventory</td>
                                        </tr>
                                        <tr className="warning-row">
                                            <td className="metric-name">Low Stock Products</td>
                                            <td className="metric-value warning">{stats.lowStockProducts || 0}</td>
                                            <td className="metric-desc">Products with stock below 10 units</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
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
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Experience</th>
                                            <th>Age Group</th>
                                            <th>Created At</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u._id}>
                                                <td>{u.first_name || u.last_name ? `${u.first_name} ${u.last_name}` : '-'}</td>
                                                <td>{u.email}</td>
                                                <td>
                                                    <span className={`role-badge ${u.role}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    {u._id !== user._id ? (
                                                        <label className="toggle-switch">
                                                            <input
                                                                type="checkbox"
                                                                checked={u.isActive}
                                                                onChange={() => handleToggleStatus(u._id, u.isActive)}
                                                            />
                                                            <span className="toggle-slider"></span>
                                                        </label>
                                                    ) : (
                                                        <span className={`status-badge ${u.isActive ? 'active' : 'inactive'}`}>
                                                            {u.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>{u.experienceLevel || 'Not specified'}</td>
                                                <td>{u.ageGroup || 'Not specified'}</td>
                                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                                <td className="action-buttons">
                                                    {u._id !== user._id ? (
                                                        <>
                                                            <button
                                                                className="btn-edit"
                                                                onClick={() => handleEditUser(u)}
                                                                title="Edit User"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn-reset"
                                                                onClick={() => handleResetPassword(u._id, u.email)}
                                                                title="Reset Password"
                                                            >
                                                                Reset
                                                            </button>
                                                            <button
                                                                className="btn-delete"
                                                                onClick={() => handleDeleteUser(u._id)}
                                                                title="Delete User"
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="current-user-badge">You</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Edit User Modal */}
                        {showEditModal && (
                            <div className="modal-overlay" onClick={handleCloseEditModal}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <h2>Edit User</h2>
                                        <button className="modal-close" onClick={handleCloseEditModal}>×</button>
                                    </div>
                                    <form onSubmit={handleUserSubmit} className="modal-form">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Email *</label>
                                                <input
                                                    type="email"
                                                    value={userForm.email}
                                                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>First Name</label>
                                                <input
                                                    type="text"
                                                    value={userForm.first_name}
                                                    onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Last Name</label>
                                                <input
                                                    type="text"
                                                    value={userForm.last_name}
                                                    onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Role *</label>
                                                <select
                                                    value={userForm.role}
                                                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                                    disabled={editingUser?._id === user._id}
                                                >
                                                    <option value="customer">Customer</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Status *</label>
                                                <select
                                                    value={userForm.isActive}
                                                    onChange={(e) => setUserForm({ ...userForm, isActive: e.target.value === 'true' })}
                                                    disabled={editingUser?._id === user._id}
                                                >
                                                    <option value="true">Active</option>
                                                    <option value="false">Inactive</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Age Group</label>
                                                <select
                                                    value={userForm.ageGroup}
                                                    onChange={(e) => setUserForm({ ...userForm, ageGroup: e.target.value })}
                                                >
                                                    <option value="Not specified">Not specified</option>
                                                    <option value="18-24">18-24</option>
                                                    <option value="25-34">25-34</option>
                                                    <option value="35-44">35-44</option>
                                                    <option value="45-54">45-54</option>
                                                    <option value="55+">55+</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Experience Level</label>
                                                <select
                                                    value={userForm.experienceLevel}
                                                    onChange={(e) => setUserForm({ ...userForm, experienceLevel: e.target.value })}
                                                >
                                                    <option value="Not specified">Not specified</option>
                                                    <option value="Beginner">Beginner</option>
                                                    <option value="Intermediate">Intermediate</option>
                                                    <option value="Expert">Expert</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="modal-actions">
                                            <button type="button" className="btn-secondary" onClick={handleCloseEditModal}>
                                                Cancel
                                            </button>
                                            <button type="submit" className="btn-primary" disabled={loading}>
                                                {loading ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
