import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

// --- SVG Icons ---
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.028C18.343 21.128 22 16.991 22 12z" />
    </svg>
);

const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.76 2.8 1.91 3.56-.71 0-1.37-.22-1.95-.55v.05c0 2.08 1.48 3.82 3.44 4.21-.36.1-.74.15-1.14.15-.28 0-.55-.03-.81-.08.55 1.7 2.14 2.94 4.03 2.97-1.47 1.15-3.32 1.83-5.33 1.83-.35 0-.69-.02-1.03-.06 1.9 1.22 4.16 1.93 6.56 1.93 7.88 0 12.2-6.54 12.2-12.2 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
    </svg>
);

const LoginPage = ({ setUser, setIsLoginVisible }) => {
    const [activeTab, setActiveTab] = useState('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({ strength: '', percentage: 0 });

    const API_BASE_URL = 'http://localhost:5000';
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
                localStorage.setItem('token', data.token);
                localStorage.setItem('userEmail', email);
                setUser({ email, token: data.token });
                navigate('/');
                if (setIsLoginVisible) setIsLoginVisible(false);
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
        setEmailError('');
        setPasswordError('');
        setPasswordStrength({ strength: '', percentage: 0 });
    };

    return (
        <div className="login-overlay" onClick={() => setIsLoginVisible(false)}>
        <div className="login-modal" onClick={(e) => e.stopPropagation()}>
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

        {activeTab === 'signin' ? (
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

            <button className="form-btn" type="submit">Sign In</button>

            <div className="social-login">
            <div className="social-divider"><span>or</span></div>
            <div className="social-icons">
            <div className="social-btn"><GoogleIcon /></div>
            <div className="social-btn"><FacebookIcon /></div>
            <div className="social-btn"><TwitterIcon /></div>
            </div>
            </div>
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
                {passwordStrength.strength && passwordStrength.strength.toUpperCase()}
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

            <button className="form-btn" type="submit">Register</button>
            </form>
        )}
        </div>
        </div>
        </div>
    );
};

export default LoginPage;
