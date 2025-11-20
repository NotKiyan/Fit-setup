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

// Read API base URL from Vite env (must start with VITE_)
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '/api/admin');

const AdminDashboard = ({ user }) => {
    const [activeTab, setActiveTab] = useState('stats');
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Product form state (brand removed as requested)
    const [productForm, setProductForm] = useState({
        name: '',
        sku: '',
        description: '',
        shortDesc: '',
        price: '',
        discount: 0,
        category: 'Strength',
        subCategory: '',
        stock: '',
        images: [], // new File objects
        existingImageUrls: [], // existing URLs when editing
        specs: {}, // optional object for flexible specs
        featured: false
    });

    const [editingProduct, setEditingProduct] = useState(null);
    const [specsInput, setSpecsInput] = useState('{}'); // Raw string input for specs

    // User edit modal state (omitted for brevity)
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

    // Placeholder user handlers (if you have real implementations, keep them)
    const handleToggleStatus = (id, current) => {
        // implement or call your existing handler
        console.log('toggle status', id, current);
    };
    const handleEditUser = (u) => {
        setEditingUser(u);
        setUserForm({
            email: u.email || '',
            first_name: u.first_name || '',
            last_name: u.last_name || '',
            role: u.role || 'customer',
            isActive: !!u.isActive,
            ageGroup: u.ageGroup || 'Not specified',
            experienceLevel: u.experienceLevel || 'Not specified'
        });
        setShowEditModal(true);
    };
    const handleResetPassword = (id, email) => {
        console.log('reset password for', id, email);
    };
    const handleDeleteUser = (id) => {
        console.log('delete user', id);
    };
    const handleUserSubmit = (e) => {
        e.preventDefault();
        console.log('submit user form', userForm);
        setShowEditModal(false);
    };
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingUser(null);
    };

    // --- FETCH FUNCTIONS ---
    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/stats`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (!response.ok) {
                const txt = await response.text();
                throw new Error(`HTTP ${response.status}: ${txt}`);
            }
            const data = await response.json();
            setStats(data);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError('Failed to fetch stats');
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (!response.ok) {
                const txt = await response.text();
                throw new Error(`HTTP ${response.status}: ${txt}`);
            }
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to fetch products');
        }
        setLoading(false);
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (!response.ok) {
                const txt = await response.text();
                throw new Error(`HTTP ${response.status}: ${txt}`);
            }
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users');
        }
        setLoading(false);
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (!response.ok) {
                const txt = await response.text();
                throw new Error(`HTTP ${response.status}: ${txt}`);
            }
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to fetch orders');
        }
        setLoading(false);
    };

    const handleUpdateOrderStatus = async (orderId, orderStatus, paymentStatus) => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ orderStatus, paymentStatus })
            });

            if (response.ok) {
                setSuccess('Order status updated successfully!');
                fetchOrders(); // Refresh orders list
            } else {
                const data = await response.json();
                setError(data.msg || 'Failed to update order status');
            }
        } catch (err) {
            console.error('Error updating order status:', err);
            setError('Failed to update order status');
        }
    };

    // --- PRODUCT SUBMIT HANDLER (UPDATED FOR FILES + new fields) ---
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const formData = new FormData();

        // Append text fields
        formData.append('name', productForm.name);
        formData.append('description', productForm.description);
        formData.append('shortDesc', productForm.shortDesc || '');
        formData.append('price', productForm.price);
        formData.append('discount', productForm.discount);
        formData.append('category', productForm.category);
        formData.append('subCategory', productForm.subCategory || '');
        formData.append('stock', productForm.stock);
        formData.append('sku', productForm.sku || '');
        // Parse specs from input string
        try {
            const specsObj = specsInput ? JSON.parse(specsInput) : {};
            formData.append('specs', JSON.stringify(specsObj));
        } catch (err) {
            formData.append('specs', JSON.stringify({}));
        }
        formData.append('featured', productForm.featured ? 'true' : 'false');

        // Append new image files (if any)
        (productForm.images || []).forEach((image) => {
            formData.append('images', image);
        });

        // When editing, send the kept existing image URLs from productForm
        if (editingProduct) {
            formData.append('existingImageUrls', JSON.stringify(productForm.existingImageUrls || []));
        }

        try {
            const url = editingProduct
            ? `${API_BASE_URL}/products/${editingProduct._id}`
            : `${API_BASE_URL}/products`;

            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');

                // Reset form state
                setProductForm({
                    name: '',
                    sku: '',
                    description: '',
                    shortDesc: '',
                    price: '',
                    discount: 0,
                    category: 'Strength',
                    subCategory: '',
                    stock: '',
                    images: [],
                    existingImageUrls: [],
                    specs: {},
                    featured: false
                });
                setSpecsInput('{}');
                setEditingProduct(null);
                fetchProducts();
            } else {
                setError(data.msg || 'Failed to save product');
            }
        } catch (err) {
            console.error('Product save error:', err);
            setError('Server error. Please try again.');
        }
        setLoading(false);
    };

    // --- DELETE PRODUCT ---
    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user.token}` }
            });

            if (response.ok) {
                setSuccess('Product deleted successfully!');
                fetchProducts();
            } else {
                const txt = await response.text();
                console.error('Delete failed:', response.status, txt);
                setError('Failed to delete product');
            }
        } catch (err) {
            console.error('Delete product error:', err);
            setError('Server error. Please try again.');
        }
    };

    // --- EDIT PRODUCT HANDLER ---
    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name || '',
            sku: product.sku || '',
            description: product.description || '',
            shortDesc: product.shortDesc || '',
            price: product.price || '',
            discount: product.discount || 0,
            category: product.category || 'Strength',
            subCategory: product.subCategory || '',
            stock: product.stock || '',
            images: [], // new files
            existingImageUrls: product.images ? [...product.images] : [],
            specs: product.specs || {},
            featured: !!product.featured
        });
        setSpecsInput(JSON.stringify(product.specs || {}, null, 2));
        setActiveTab('products');
    };

    // --- CANCEL EDIT HANDLER ---
    const handleCancelEdit = () => {
        setEditingProduct(null);
        setProductForm({
            name: '',
            sku: '',
            description: '',
            shortDesc: '',
            price: '',
            discount: 0,
            category: 'Strength',
            subCategory: '',
            stock: '',
            images: [],
            existingImageUrls: [],
            specs: {},
            featured: false
        });
        setSpecsInput('{}');
    };

    // Load data when tab changes
    useEffect(() => {
        if (activeTab === 'stats') {
            fetchStats();
        } else if (activeTab === 'products') {
            fetchProducts();
        } else if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'orders') {
            fetchOrders();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>
        Statistics
        </button>
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
        Products
        </button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
        Orders
        </button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
        Users
        </button>
        </div>

        <div className="admin-content">
        {/* STATISTICS TAB */}
        {activeTab === 'stats' && (
            <div className="stats-container">
                <h2>Dashboard Overview</h2>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Users</h3>
                        <p className="stat-number">{stats.totalUsers || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Products</h3>
                        <p className="stat-number">{stats.totalProducts || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Orders</h3>
                        <p className="stat-number">{stats.totalOrders || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Revenue</h3>
                        <p className="stat-number">₹{(stats.totalRevenue || 0).toLocaleString()}</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="charts-section">
                    {/* Category Distribution */}
                    {stats.categoryDistribution && stats.categoryDistribution.length > 0 && (
                        <div className="chart-container">
                            <h3>Products by Category</h3>
                            <Pie
                                data={{
                                    labels: stats.categoryDistribution.map(item => item._id || 'Uncategorized'),
                                    datasets: [{
                                        data: stats.categoryDistribution.map(item => item.count),
                                        backgroundColor: [
                                            '#FF6384',
                                            '#36A2EB',
                                            '#FFCE56',
                                            '#4BC0C0',
                                            '#9966FF',
                                            '#FF9F40'
                                        ]
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                boxWidth: 15,
                                                padding: 10
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    )}

                    {/* Revenue by Category */}
                    {stats.revenueByCategory && stats.revenueByCategory.length > 0 && (
                        <div className="chart-container">
                            <h3>Revenue by Category</h3>
                            <Pie
                                data={{
                                    labels: stats.revenueByCategory.map(item => item._id || 'Other'),
                                    datasets: [{
                                        data: stats.revenueByCategory.map(item => item.revenue),
                                        backgroundColor: [
                                            '#FF6384',
                                            '#36A2EB',
                                            '#FFCE56',
                                            '#4BC0C0',
                                            '#9966FF',
                                            '#FF9F40'
                                        ]
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                boxWidth: 15,
                                                padding: 10
                                            }
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function(context) {
                                                    return context.label + ': ₹' + context.parsed.toLocaleString();
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    )}

                    {/* Subcategory Distribution */}
                    {stats.subcategoryDistribution && stats.subcategoryDistribution.length > 0 && (
                        <div className="chart-container">
                            <h3>Products by Subcategory</h3>
                            <Pie
                                data={{
                                    labels: stats.subcategoryDistribution.map(item => item._id),
                                    datasets: [{
                                        data: stats.subcategoryDistribution.map(item => item.count),
                                        backgroundColor: [
                                            '#FF6384',
                                            '#36A2EB',
                                            '#FFCE56',
                                            '#4BC0C0',
                                            '#9966FF',
                                            '#FF9F40',
                                            '#E74C3C',
                                            '#3498DB',
                                            '#F39C12',
                                            '#1ABC9C',
                                            '#9B59B6',
                                            '#E67E22',
                                            '#2ECC71'
                                        ]
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                boxWidth: 15,
                                                padding: 8,
                                                font: {
                                                    size: 11
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    )}

                    {/* Order Status Distribution */}
                    {stats.totalOrders > 0 && (
                        <div className="chart-container">
                            <h3>Total Orders: {stats.totalOrders}</h3>
                            <Bar
                                data={{
                                    labels: stats.orderStatusDistribution && stats.orderStatusDistribution.length > 0
                                        ? stats.orderStatusDistribution.map(item => item._id || 'Unknown')
                                        : ['No Orders'],
                                    datasets: [{
                                        label: 'Number of Orders',
                                        data: stats.orderStatusDistribution && stats.orderStatusDistribution.length > 0
                                            ? stats.orderStatusDistribution.map(item => item.count)
                                            : [0],
                                        backgroundColor: '#36A2EB'
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false
                                        },
                                        title: {
                                            display: true,
                                            text: 'Order Status Breakdown'
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                stepSize: 1
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Additional Stats */}
                <div className="additional-stats">
                    <div className="stat-row">
                        <span>Low Stock Products:</span>
                        <strong>{stats.lowStockCount || 0}</strong>
                    </div>
                    <div className="stat-row">
                        <span>Out of Stock Products:</span>
                        <strong>{stats.outOfStockCount || 0}</strong>
                    </div>
                    <div className="stat-row">
                        <span>Pending Orders:</span>
                        <strong>{stats.pendingOrdersCount || 0}</strong>
                    </div>
                    <div className="stat-row">
                        <span>Active Users:</span>
                        <strong>{stats.activeUsersCount || 0}</strong>
                    </div>
                </div>
            </div>
        )}

        {/* PRODUCTS TAB (FORM UPDATED) */}
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

            {/* SKU */}
            <div className="form-group">
            <label>SKU</label>
            <input
            type="text"
            value={productForm.sku}
            onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
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
            <label>Short Description</label>
            <input
            type="text"
            maxLength={200}
            value={productForm.shortDesc}
            onChange={(e) => setProductForm({ ...productForm, shortDesc: e.target.value })}
            />
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
            <label>Sub-category *</label>
            <select
            value={productForm.subCategory}
            onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })}
            required
            >
            <option value="">Select Sub-category</option>

            {/* Cardio */}
            <optgroup label="Cardio">
            <option value="Bikes">Bikes</option>
            <option value="Elliptical">Elliptical</option>
            <option value="Stair Climber">Stair Climber</option>
            <option value="Treadmill">Treadmill</option>
            </optgroup>

            {/* Strength */}
            <optgroup label="Strength">
            <option value="Benches and Rack">Benches and Rack</option>
            <option value="CrossFit">CrossFit</option>
            <option value="MultiGym">MultiGym</option>
            <option value="Power Rack">Power Rack</option>
            </optgroup>

            {/* Accessories */}
            <optgroup label="Accessories">
            <option value="Dumbbells">Dumbbells</option>
            <option value="Plates and Weights">Plates and Weights</option>
            <option value="Ropes and Bands">Ropes and Bands</option>
            <option value="Kettlebell">Kettlebell</option>
            <option value="Mats">Mats</option>
            </optgroup>
            </select>
            </div>

            {/* Specs (JSON) */}
            <div className="form-group">
            <label>Specs (JSON)</label>
            <textarea
            rows={3}
            value={specsInput}
            onChange={(e) => setSpecsInput(e.target.value)}
            placeholder='{"weight":"10kg","material":"steel"}'
            />
            <small>Enter specs as JSON object. Format will be validated on submit.</small>
            </div>

            {/* --- FILE INPUT --- */}
            <div className="form-group">
            <label>Product Images</label>
            <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setProductForm({ ...productForm, images: Array.from(e.target.files) })}
            />

            {/* Existing images (editable) */}
            {(productForm.existingImageUrls || []).length > 0 && (
                <div className="image-preview-section">
                <p className="image-note">Current Images ({(productForm.existingImageUrls || []).length}):</p>
                <div className="current-images-container">
                {(productForm.existingImageUrls || []).map((url, index) => (
                    <div key={index} style={{ display: 'inline-block', textAlign: 'center', margin: 6 }}>
                    <img
                    src={url}
                    alt={`Current Product Image ${index + 1}`}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', border: '1px solid #ccc', display: 'block' }}
                    />
                    <button
                    type="button"
                    onClick={() => {
                        const updated = (productForm.existingImageUrls || []).filter((u) => u !== url);
                        setProductForm({ ...productForm, existingImageUrls: updated });
                    }}
                    style={{ marginTop: 4 }}
                    >
                    Remove
                    </button>
                    </div>
                ))}
                </div>
                <p className="image-note">Uploading new files will <strong>ADD</strong> to the existing gallery.</p>
                </div>
            )}
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
            {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
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
                <th>Image</th>
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
                {products.map((product) => (
                    <tr key={product._id}>
                    <td>
                    {product.images && product.images.length > 0 && (
                        <img
                        src={product.images[0]}
                        alt={product.name}
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                    )}
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td>{product.discount}%</td>
                    <td>${Number(product.finalPrice ?? product.price).toFixed(2)}</td>
                    <td className={product.stock < 10 ? 'low-stock' : ''}>{product.stock}</td>
                    <td>{product.featured ? 'Yes' : 'No'}</td>
                    <td className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEditProduct(product)}>
                    Edit
                    </button>
                    <button className="btn-delete" onClick={() => handleDeleteProduct(product._id)}>
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

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
            <div className="orders-container">
            <h2>All Orders</h2>
            {loading ? (
                <p>Loading...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="orders-table">
                <table>
                <thead>
                <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Payment Status</th>
                <th>Order Status</th>
                <th>Date</th>
                <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order._id}>
                    <td className="order-id">{order._id.slice(-8)}</td>
                    <td>
                        {order.userId?.first_name || order.userId?.last_name
                            ? `${order.userId.first_name} ${order.userId.last_name}`
                            : order.userId?.email || 'N/A'}
                    </td>
                    <td>{order.items.length} item(s)</td>
                    <td>₹{order.totalAmount.toLocaleString()}</td>
                    <td>
                        <select
                            value={order.paymentStatus}
                            onChange={(e) => handleUpdateOrderStatus(order._id, order.orderStatus, e.target.value)}
                            className={`status-select payment-${order.paymentStatus}`}
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                        </select>
                    </td>
                    <td>
                        <select
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value, order.paymentStatus)}
                            className={`status-select order-${order.orderStatus}`}
                        >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="order-details">
                        <details>
                            <summary>View Details</summary>
                            <div className="order-items-list">
                                <h4>Items:</h4>
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="order-item">
                                        <span>{item.name}</span>
                                        <span>Qty: {item.quantity}</span>
                                        <span>₹{item.price}</span>
                                    </div>
                                ))}
                                <h4>Shipping Address:</h4>
                                <p>
                                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                                </p>
                                {order.deliveredAt && (
                                    <>
                                        <h4>Delivered At:</h4>
                                        <p>{new Date(order.deliveredAt).toLocaleString()}</p>
                                    </>
                                )}
                            </div>
                        </details>
                    </td>
                    </tr>
                ))}
                </tbody>
                </table>
                </div>
            )}
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
                {users.map((u) => (
                    <tr key={u._id}>
                    <td>{u.first_name || u.last_name ? `${u.first_name} ${u.last_name}` : '-'}</td>
                    <td>{u.email}</td>
                    <td>
                    <span className={`role-badge ${u.role}`}>{u.role}</span>
                    </td>
                    <td>
                    {u._id !== user._id ? (
                        <label className="toggle-switch">
                        <input type="checkbox" checked={u.isActive} onChange={() => handleToggleStatus(u._id, u.isActive)} />
                        <span className="toggle-slider"></span>
                        </label>
                    ) : (
                        <span className={`status-badge ${u.isActive ? 'active' : 'inactive'}`}>{u.isActive ? 'Active' : 'Inactive'}</span>
                    )}
                    </td>
                    <td>{u.experienceLevel || 'Not specified'}</td>
                    <td>{u.ageGroup || 'Not specified'}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="action-buttons">
                    {u._id !== user._id ? (
                        <>
                        <button className="btn-edit" onClick={() => handleEditUser(u)} title="Edit User">
                        Edit
                        </button>
                        <button className="btn-reset" onClick={() => handleResetPassword(u._id, u.email)} title="Reset Password">
                        Reset
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteUser(u._id)} title="Delete User">
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
                <button className="modal-close" onClick={handleCloseEditModal}>
                ×
                </button>
                </div>
                <form onSubmit={handleUserSubmit} className="modal-form">
                <div className="form-row">
                <div className="form-group">
                <label>Email *</label>
                <input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required />
                </div>
                </div>

                <div className="form-row">
                <div className="form-group">
                <label>First Name</label>
                <input type="text" value={userForm.first_name} onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })} />
                </div>
                <div className="form-group">
                <label>Last Name</label>
                <input type="text" value={userForm.last_name} onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })} />
                </div>
                </div>

                <div className="form-row">
                <div className="form-group">
                <label>Role *</label>
                <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} disabled={editingUser?._id === user._id}>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                </select>
                </div>
                <div className="form-group">
                <label>Status *</label>
                <select value={userForm.isActive} onChange={(e) => setUserForm({ ...userForm, isActive: e.target.value === 'true' })} disabled={editingUser?._id === user._id}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
                </select>
                </div>
                </div>

                <div className="form-row">
                <div className="form-group">
                <label>Age Group</label>
                <select value={userForm.ageGroup} onChange={(e) => setUserForm({ ...userForm, ageGroup: e.target.value })}>
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
                <select value={userForm.experienceLevel} onChange={(e) => setUserForm({ ...userForm, experienceLevel: e.target.value })}>
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
