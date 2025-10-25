import React, { useState } from 'react';
import './UserProfile.css';

// --- Helper Components (SVG Icons) ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const PackageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const DumbbellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.4 14.4 9.6 9.6M18 6l-6 6M6 18l6-6M12 12l6 6M12 12l-6-6M21 12h-2M5 12H3M12 21v-2M12 5V3"/></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

export default function ProfilePage({ user, setIsProfileVisible }) {
    const [activeSection, setActiveSection] = useState('details');
    const [successMessage, setSuccessMessage] = useState('');

    // Form states
    const [firstName, setFirstName] = useState('John');
    const [lastName, setLastName] = useState('Doe');
    const [phone, setPhone] = useState('+1 (555) 123-4567');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // Shipping address state
    const [address, setAddress] = useState({
        street: '123 Fitness Street',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001',
        country: 'United States'
    });

    // Mock order data
    const orders = [
        { id: '#ORD-2024-001', date: '2024-10-10', status: 'Delivered', total: '$249.99', items: 'Pro-Grade Dumbbell Set' },
        { id: '#ORD-2024-002', date: '2024-10-05', status: 'In Transit', total: '$189.99', items: 'Adjustable Workout Bench' },
        { id: '#ORD-2024-003', date: '2024-09-28', status: 'Delivered', total: '$79.99', items: 'Kettlebell Pro (16kg)' },
    ];

    // Mock wishlist data
    const wishlist = [
        { id: 1, name: 'CardioMax Treadmill', price: '$899.99' },
        { id: 2, name: 'Power Rack Pro', price: '$1,299.99' },
        { id: 3, name: 'Olympic Barbell Set', price: '$399.99' },
    ];

    // Mock workout plans
    const workoutPlans = [
        { id: 1, name: 'Beginner Full Body', duration: '4 weeks', exercises: 12 },
        { id: 2, name: 'Advanced Strength Training', duration: '8 weeks', exercises: 24 },
        { id: 3, name: 'HIIT Cardio Blast', duration: '6 weeks', exercises: 18 },
    ];

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleDetailsSubmit = (e) => {
        e.preventDefault();
        showSuccess('Account details updated successfully!');
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match!');
            return;
        }
        showSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        showSuccess('Shipping address updated successfully!');
    };

    // Get user initials for avatar
    const getInitials = () => {
        const names = `${firstName} ${lastName}`.trim().split(' ');
        return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const renderSection = () => {
        switch (activeSection) {
            case 'details':
                return (
                    <div className="profile-section">
                    <div className="section-header">
                    <h3>Account Details</h3>
                    <p>Manage your personal information and settings.</p>
                    </div>
                    <form className="profile-form" onSubmit={handleDetailsSubmit}>
                    <div className="form-row">
                    <div className="form-group">
                    <label>First Name</label>
                    <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    />
                    </div>
                    <div className="form-group">
                    <label>Last Name</label>
                    <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    />
                    </div>
                    </div>
                    <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" value={user.email} readOnly disabled />
                    <small className="form-hint">Email cannot be changed</small>
                    </div>
                    <div className="form-group">
                    <label>Phone Number</label>
                    <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    />
                    </div>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                    </form>
                    </div>
                );

            case 'orders':
                return (
                    <div className="profile-section">
                    <div className="section-header">
                    <h3>Order History</h3>
                    <p>Track and manage your past orders.</p>
                    </div>
                    <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                        <div className="order-header">
                        <div>
                        <h4>{order.id}</h4>
                        <p className="order-date">{order.date}</p>
                        </div>
                        <span className={`order-status ${order.status.toLowerCase().replace(' ', '-')}`}>
                        {order.status}
                        </span>
                        </div>
                        <p className="order-items">{order.items}</p>
                        <div className="order-footer">
                        <span className="order-total">Total: {order.total}</span>
                        <button className="btn-link">View Details</button>
                        </div>
                        </div>
                    ))}
                    </div>
                    </div>
                );

            case 'wishlist':
                return (
                    <div className="profile-section">
                    <div className="section-header">
                    <h3>My Wishlist</h3>
                    <p>Items you've saved for later.</p>
                    </div>
                    <div className="wishlist-grid">
                    {wishlist.map((item) => (
                        <div key={item.id} className="wishlist-card">
                        <div className="wishlist-placeholder">
                        <DumbbellIcon />
                        </div>
                        <h4>{item.name}</h4>
                        <p className="wishlist-price">{item.price}</p>
                        <div className="wishlist-actions">
                        <button className="btn btn-primary btn-sm">Add to Cart</button>
                        <button className="btn-icon">
                        <XIcon />
                        </button>
                        </div>
                        </div>
                    ))}
                    </div>
                    </div>
                );

            case 'plans':
                return (
                    <div className="profile-section">
                    <div className="section-header">
                    <h3>Workout Plans</h3>
                    <p>Your personalized fitness journey.</p>
                    </div>
                    <div className="plans-list">
                    {workoutPlans.map((plan) => (
                        <div key={plan.id} className="plan-card">
                        <div className="plan-icon">
                        <DumbbellIcon />
                        </div>
                        <div className="plan-info">
                        <h4>{plan.name}</h4>
                        <div className="plan-meta">
                        <span>📅 {plan.duration}</span>
                        <span>💪 {plan.exercises} exercises</span>
                        </div>
                        </div>
                        <button className="btn btn-secondary btn-sm">View Plan</button>
                        </div>
                    ))}
                    </div>
                    </div>
                );

            case 'shipping':
                return (
                    <div className="profile-section">
                    <div className="section-header">
                    <h3>Shipping Address</h3>
                    <p>Manage your delivery information.</p>
                    </div>
                    <form className="profile-form" onSubmit={handleAddressSubmit}>
                    <div className="form-group">
                    <label>Street Address</label>
                    <input
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({...address, street: e.target.value})}
                    required
                    />
                    </div>
                    <div className="form-row">
                    <div className="form-group">
                    <label>City</label>
                    <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({...address, city: e.target.value})}
                    required
                    />
                    </div>
                    <div className="form-group">
                    <label>State</label>
                    <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({...address, state: e.target.value})}
                    required
                    />
                    </div>
                    </div>
                    <div className="form-row">
                    <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                    type="text"
                    value={address.zip}
                    onChange={(e) => setAddress({...address, zip: e.target.value})}
                    required
                    />
                    </div>
                    <div className="form-group">
                    <label>Country</label>
                    <input
                    type="text"
                    value={address.country}
                    onChange={(e) => setAddress({...address, country: e.target.value})}
                    required
                    />
                    </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Update Address</button>
                    </form>
                    </div>
                );

                case 'security':
                    return (
                        <div className="profile-section">
                        <div className="section-header">
                        <h3>Security</h3>
                        <p>Change your password to keep your account secure.</p>
                        </div>
                        <form className="profile-form" onSubmit={handlePasswordSubmit}>
                        <div className="form-group">
                        <label>Current Password</label>
                        <input
                        type="password"
                        placeholder="••••••••"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        />
                        </div>
                        <div className="form-group">
                        <label>New Password</label>
                        <input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        />
                        <small className="form-hint">Must be at least 8 characters</small>
                        </div>
                        <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                        />
                        </div>
                        <button type="submit" className="btn btn-primary">Update Password</button>
                        </form>
                        </div>
                    );

                default:
                    return null;
        }
    };

    return (
        <div className="profile-overlay" onClick={() => setIsProfileVisible(false)}>
        <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn profile-close-btn" onClick={() => setIsProfileVisible(false)}>
        <XIcon/>
        </button>

        {successMessage && (
            <div className="success-toast">
            <CheckCircleIcon />
            <span>{successMessage}</span>
            </div>
        )}

        <div className="profile-sidebar">
        <div className="profile-user">
        <div className="profile-avatar">{getInitials()}</div>
        <h4>{firstName} {lastName}</h4>
        <p>{user.email}</p>
        </div>
        <nav className="profile-nav">
        <a className={activeSection === 'details' ? 'active' : ''} onClick={() => setActiveSection('details')}>
        <UserIcon /> <span>Account Details</span>
        </a>
        <a className={activeSection === 'orders' ? 'active' : ''} onClick={() => setActiveSection('orders')}>
        <PackageIcon/> <span>Order History</span>
        </a>
        <a className={activeSection === 'wishlist' ? 'active' : ''} onClick={() => setActiveSection('wishlist')}>
        <HeartIcon/> <span>My Wishlist</span>
        </a>
        <a className={activeSection === 'plans' ? 'active' : ''} onClick={() => setActiveSection('plans')}>
        <DumbbellIcon/> <span>Workout Plans</span>
        </a>
        <a className={activeSection === 'shipping' ? 'active' : ''} onClick={() => setActiveSection('shipping')}>
        <TruckIcon/> <span>Shipping</span>
        </a>
        <a className={activeSection === 'security' ? 'active' : ''} onClick={() => setActiveSection('security')}>
        <ShieldIcon/> <span>Security</span>
        </a>
        </nav>
        </div>

        <div className="profile-content">
        {renderSection()}
        </div>
        </div>
        </div>
    );
}
