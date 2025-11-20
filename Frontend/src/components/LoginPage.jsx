import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ setUser }) => {
    const [activeTab, setActiveTab] = useState('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({ strength: '', percentage: 0 });
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmResetPassword, setConfirmResetPassword] = useState('');

    // API_BASE_URL from file 2
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
    const navigate = useNavigate();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const checkPasswordStrength = (password) => {
        let strength = 0;
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
        Object.values(requirements).forEach((met) => met && (strength += 20));

        let label = 'weak';
        if (strength > 40 && strength <= 80) label = 'medium';
        if (strength > 80) label = 'strong';

        return { strength: label, percentage: strength, requirements };
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setEmailError(value && !validateEmail(value) ? 'Please enter a valid email address' : '');
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        if (activeTab === 'register') {
            const strengthData = checkPasswordStrength(value);
            setPasswordStrength(strengthData);
            setPasswordError(strengthData.strength === 'weak' ? 'Password is too weak' : '');
        }
    };

    // handleSubmit from file 2 (includes role handling and admin redirect)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) return setError('Please enter a valid email address');
        if (!email || !password || (activeTab === 'register' && !confirmPassword))
            return setError('All fields are required.');

        if (activeTab === 'register') {
            const strengthData = checkPasswordStrength(password);
            if (strengthData.strength === 'weak')
                return setError('Password is too weak. Please meet all requirements.');
            if (password !== confirmPassword) return setError('Passwords do not match.');
        }

        const endpoint = activeTab === 'signin' ? '/api/auth/login' : '/api/auth/register';
        const body = { email, password };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (response.ok) {
                // Set token, email, and role in localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userRole', data.role || 'customer');
                // Store complete user object for cart functionality
                localStorage.setItem('user', JSON.stringify({ email, token: data.token, role: data.role || 'customer' }));

                // Set user state with role
                setUser({ email, token: data.token, role: data.role || 'customer' });

                // Redirect admin to admin dashboard, regular users to home
                if (data.role === 'admin') {
                    navigate('/admin', { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            } else {
                setError(data.msg || 'An unknown error occurred.');
            }
        } catch {
            setError('Could not connect to the server. Please check the backend service.');
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setError('');
        setSuccess('');
        setEmailError('');
        setPasswordError('');
        setPasswordStrength({ strength: '', percentage: 0 });
        setShowForgotPassword(false);
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateEmail(resetEmail)) {
            return setError('Please enter a valid email address');
        }

        const strengthData = checkPasswordStrength(newPassword);
        if (strengthData.strength === 'weak') {
            return setError('Password is too weak. Please meet all requirements.');
        }

        if (newPassword !== confirmResetPassword) {
            return setError('Passwords do not match.');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail, newPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess('Password reset successful! You can now sign in with your new password.');
                setShowForgotPassword(false);
                setResetEmail('');
                setNewPassword('');
                setConfirmResetPassword('');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.msg || 'Failed to reset password');
            }
        } catch {
            setError('Could not connect to the server. Please try again later.');
        }
    };

    return (
        <div className="login-page-container">
        <div className="login-card">
        <div className="login-tabs">
        <button
        className={`tab ${activeTab === 'signin' ? 'active' : ''}`}
        onClick={() => handleTabChange('signin')}
        >
        Sign In
        </button>
        <button
        className={`tab ${activeTab === 'register' ? 'active' : ''}`}
        onClick={() => handleTabChange('register')}
        >
        Register
        </button>
        </div>

        <div className="login-content">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {showForgotPassword ? (
            <form className="form-container" onSubmit={handleForgotPassword}>
            <h3>Reset Password</h3>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                Enter your email and new password to reset your account
            </p>
            <input
            type="email"
            placeholder="Email Address"
            className="form-input"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
            />

            <input
            type="password"
            placeholder="New Password"
            className="form-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            />

            <input
            type="password"
            placeholder="Confirm New Password"
            className="form-input"
            value={confirmResetPassword}
            onChange={(e) => setConfirmResetPassword(e.target.value)}
            required
            />

            <button className="btn btn-primary form-btn" type="submit">Reset Password</button>
            <button
            className="btn btn-secondary form-btn"
            type="button"
            onClick={() => setShowForgotPassword(false)}
            style={{ marginTop: '0.5rem' }}
            >
            Back to Sign In
            </button>
            </form>
        ) : activeTab === 'signin' ? (
            <form className="form-container" onSubmit={handleSubmit}>
            <h3>Welcome Back</h3>
            <input
            type="email"
            placeholder="Email Address"
            className={`form-input ${emailError ? 'error' : ''}`}
            value={email}
            onChange={handleEmailChange}
            required
            />
            {emailError && <span className="field-error">{emailError}</span>}

            <input
            type="password"
            placeholder="Password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />

            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
            <button
            type="button"
            className="forgot-password-link"
            onClick={() => setShowForgotPassword(true)}
            >
            Forgot Password?
            </button>
            </div>

            <button className="btn btn-primary form-btn" type="submit">Sign In</button>
            </form>
        ) : (
            <form className="form-container" onSubmit={handleSubmit}>
            <h3>Create Account</h3>
            <input
            type="email"
            placeholder="Email Address"
            className={`form-input ${emailError ? 'error' : ''}`}
            value={email}
            onChange={handleEmailChange}
            required
            />
            {emailError && <span className="field-error">{emailError}</span>}

            <input
            type="password"
            placeholder="Password"
            className={`form-input ${passwordError ? 'error' : ''}`}
            value={password}
            onChange={handlePasswordChange}
            required
            />

            {password && (
                <div className="password-strength-meter">
                <div className="strength-bar">
                <div
                className={`strength-bar-fill ${passwordStrength.strength}`}
                style={{ width: `${passwordStrength.percentage}%` }}
                ></div>
                </div>
                <p className={`strength-text ${passwordStrength.strength}`}>
                {passwordStrength.strength && `Password Strength: ${passwordStrength.strength.toUpperCase()}`}
                </p>
                </div>
            )}

            {passwordError && <span className="field-error">{passwordError}</span>}

            <input
            type="password"
            placeholder="Confirm Password"
            className="form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            />

            <button className="btn btn-primary form-btn" type="submit">Register</button>
            </form>
        )}
        </div>
        </div>
        </div>
    );
};

export default LoginPage;
