// src/components/Layout.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

// User Dropdown Component
const UserDropdown = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const username = user.email.split('@')[0];
    const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="user-dropdown" ref={dropdownRef}>
            <button className="user-dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
                <UserIcon />
                <span className="user-greeting">Hi, {capitalizedUsername}</span>
                <ChevronDownIcon />
            </button>
            {isOpen && (
                <div className="user-dropdown-menu">
                    <div className="user-dropdown-header">
                        <UserIcon />
                        <span>Hi, {capitalizedUsername}</span>
                    </div>
                    <ul className="user-dropdown-list">
                        <li><Link to="/profile">Order History</Link></li>
                        <li><a href="#favorites">Favorites Lists</a></li>
                        <li><a href="#address">Address Book</a></li>
                        <li><a href="#communications">Communications</a></li>
                        <li><Link to="/profile">Account Information</Link></li>
                        <li><a href="#returns">Return Request</a></li>
                        <li><button onClick={onLogout} className="dropdown-signout">Sign Out</button></li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default function Layout({ user, setUser }) {
    const headerRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setUser(null);
    };

    useEffect(() => {
        const onScroll = () => {
            if (headerRef.current) {
                if (window.scrollY > 50) {
                    headerRef.current.classList.add('header-scrolled');
                } else {
                    headerRef.current.classList.remove('header-scrolled');
                }
            }
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
        <header className="header" ref={headerRef}>
        <nav className="nav container">
        <Link to="/" className="nav-logo">Fitsetup<span>.</span></Link>
        <div className="nav-links">
        <a href="#home" className="nav-link">Home</a>
        <a href="#equipments" className="nav-link">Equipments</a>
        <a href="#Apparels" className="nav-link">Apparels</a>
        <a href="#blog" className="nav-link">Blog</a>
        </div>
        <div className="nav-actions">
        {user ? (
            <UserDropdown user={user} onLogout={handleLogout} />
        ) : (
            <Link to="/login" className="nav-link">Sign In</Link>
        )}
        <Link to="/cart" className="nav-link"><CartIcon /></Link>
        </div>
        </nav>
        </header>

        <Outlet />

        <footer className="footer">
        {/* Your existing footer code */}
        </footer>
        </>
    );
}