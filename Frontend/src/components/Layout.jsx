// src/components/Layout.jsx
import React, { useRef, useEffect } from 'react';
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
        <a href="#equipment" className="nav-link">Equipment</a>
        <a href="#Functional" className="nav-link">Functional</a>
        <a href="#blog" className="nav-link">Blog</a>
        </div>
        <div className="nav-actions">
        {user ? (
            <div className="user-menu">
            <Link to="/profile" className="nav-link"><UserIcon /></Link>
            <span className="user-email">{user.email}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
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
