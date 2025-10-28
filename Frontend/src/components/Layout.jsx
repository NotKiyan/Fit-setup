import React, { useRef, useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

// --- START: ICON COMPONENTS ---
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
// --- END: ICON COMPONENTS ---


// --- START: USER DROPDOWN (FROM FILE 2) ---
// This version includes the Admin Dashboard link
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
            <div className="user-dropdown-header-info">
            <span>Hi, {capitalizedUsername}</span>
            </div>
            </div>
            <ul className="user-dropdown-list">
            {/* --- ADDED ADMIN LINK LOGIC (FROM FILE 2) --- */}
            {user.role === 'admin' && (
                <li><Link to="/admin" style={{ fontWeight: 'bold', color: '#007bff' }}>Admin Dashboard</Link></li>
            )}
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
// --- END: USER DROPDOWN ---


// --- START: MAIN LAYOUT COMPONENT ---
export default function Layout({ user, setUser }) {
    const headerRef = useRef(null);

    // Updated handleLogout (from file 2)
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole'); // Added this line
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
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/equipments" className="nav-link">Equipments</Link>
        <Link to="/apparels" className="nav-link">Apparels</Link>
        {/* Updated Blog link (from file 2) */}
        <Link to="/blog" className="nav-link">Blog</Link>
        </div>
        <div className="nav-actions">
        {user ? (
            <UserDropdown user={user} onLogout={handleLogout} />
        ) : (
            <Link to="/login" className="nav-link">Sign In</Link>
        )}
        {/* Kept conditional cart link (from file 1) */}
        {user && <Link to="/cart" className="nav-link"><CartIcon /></Link>}
        </div>
        </nav>
        </header>

        <main className="main-content">
        <Outlet />
        </main>

        {/* --- START: OUR SERVICES SECTION (FROM FILE 1) --- */}
        <section className="services-section container">
        <h2 className="services-title">OUR SERVICES</h2>
        <div className="services-grid">

        <div className="service-card">
        <img src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170" alt="World Class Equipment" />
        <h3>World Class Equipment</h3>
        <p>Get hooked on to the complete range of internationally reputed fitness branded products. We will guide you through products that are fit for your requirement and space.</p>
        </div>

        <div className="service-card">
        <img src="https://images.unsplash.com/photo-1649068618811-9f3547ef98fc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170" alt="Installation Services" />
        <h3>Installation Services</h3>
        <p>We shoulder your entire set-up process from delivery to installations of equipments, saving your valuable time and money.</p>
        </div>

        <div className="service-card">
        <img src="https://images.unsplash.com/photo-1637666067348-7303e7007363?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070" alt="Interior Design Solutions" />
        <h3>Interior Design Solutions</h3>
        <p>Complete Interior Design Solutions from concept to completion. We turn your space into a world class fitness zone which is functional and aesthetically pleasing.</p>
        </div>

        <div className="service-card">
        <img src="https://images.unsplash.com/photo-1674834727206-4bc272bfd8da?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687" alt="Flooring" />
        <h3>Flooring</h3>
        <p>Our service offering includes the installation of premier rubber tiles for your space. Now avoid slipping due to wet floors or the lack of grip during intense workouts.</p>
        </div>

        </div>
        </section>
        {/* --- END: OUR SERVICES SECTION --- */}


        {/* --- START: FOOTER CODE (FROM FILE 1) --- */}
        <footer className="footer">
        <div className="footer-content container">

        {/* Column 1: Contact Us */}
        <div className="footer-column">
        <h4>Contact Us</h4>
        <p>123 Gym Street, Fitness City, 12345</p>
        <p>Email: info@gymstore.com</p>
        <p>Phone: (123) 456-7890</p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-column">
        <h4>Quick Links</h4>
        <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/equipments">Equipments</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/profile">My Profile</Link></li>
        </ul>
        </div>

        {/* Column 3: Brands We Handle */}
        <div className="footer-column">
        <h4>Brands We Handle</h4>
        <ul>
        <li>Lifefitness</li>
        <li>Precor</li>
        <li>Cybex</li>
        <li>Bowflex</li>
        <li>Nordic Track</li>
        <li>Welcare</li>
        <li>True</li>
        <li>TotalGym</li>
        </ul>
        </div>

        {/* Column 4: Follow Us */}
        <div className="footer-column">
        <h4>Follow Us</h4>
        <div className="social-links">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        <FaFacebookF />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
        <FaTwitter />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <FaInstagram />
        </a>
        </div>
        </div>

        </div>
        <div className="footer-bottom">
        <p>&copy; 2025 Gym E-Commerce. All Rights Reserved.</p>
        </div>
        </footer>
        {/* --- END: FOOTER CODE --- */}
        </>
    );
}
