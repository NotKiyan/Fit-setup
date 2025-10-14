import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import LoginPage from './components/LoginPage.jsx';
import homeGymVideo from './assets/homegymvid.mp4';
import kellebell from './assets/kellebell.jpg'

// --- Helper Components (SVG Icons) ---
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <circle cx="9" cy="21" r="1"></circle>
  <circle cx="20" cy="21" r="1"></circle>
  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);


// --- Main App Component ---
export default function App() {
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [user, setUser] = useState(null); // Track logged-in user
  const sectionsRef = useRef([]);
  const headerRef = useRef(null);

  // Check for existing user on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');

    if (token && userEmail) {
      setUser({ email: userEmail, token });
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setUser(null);
  };

  // --- Intersection Observer for Scroll Animations ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    const currentSections = sectionsRef.current;

    currentSections.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 50) {
          headerRef.current.classList.add('header-scrolled');
        } else {
          headerRef.current.classList.remove('header-scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      currentSections.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  // --- Mock Data ---
  const featuredProducts = [
    { id: 1, name: 'Pro-Grade Dumbbell Set', price: '$249.99', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 2, name: 'Adjustable Workout Bench', price: '$189.99', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 3, name: 'CardioMax Treadmill', price: '$899.99', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 4, name: 'Kettlebell Pro', price: '$79.99', image: kellebell },
  ];

  const categories = [
    { name: 'Strength', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Cardio', image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Apparel', image: 'https://images.unsplash.com/photo-1606902965552-d74a1c0d11b8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  ];

  const testimonials = [
    { quote: "The quality from Fitsetup is unmatched. My home gym has never been better.", author: "Alex R." },
    { quote: "Fast shipping and incredible customer service. They helped me choose the perfect rack.", author: "Maria S." },
    { quote: "I've recommended Fitsetup to all my friends. The equipment is built to last.", author: "James L." },
  ];


  return (
    <>
    {isLoginVisible && <LoginPage setIsLoginVisible={setIsLoginVisible} setUser={setUser} />}

    <header className="header" ref={headerRef}>
    <nav className="nav container">
    <a href="#home" className="nav-logo">Fitsetup<span>.</span></a>
    <div className="nav-links">
    <a href="#home" className="nav-link">Home</a>
    <a href="#equipment" className="nav-link">Equipment</a>
    <a href="#apparel" className="nav-link">Apparel</a>
    <a href="#blog" className="nav-link">Blog</a>
    </div>
    <div className="nav-actions">
    {user ? (
      <div className="user-menu">
      <span className="user-email">{user.email}</span>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    ) : (
      <a onClick={() => setIsLoginVisible(true)} className="nav-link">Sign In</a>
    )}
    <a href="#cart" className="nav-link"><CartIcon /></a>
    </div>
    </nav>
    </header>

    <main>
    <section id="home" className="hero">
    <video className="hero-video" autoPlay loop muted playsInline>
    <source src={homeGymVideo} type="video/mp4" />
    </video>
    <div className="hero-overlay"></div>
    <div className="hero-content container">
    <h1 ref={addToRefs} className="fade-in-section">ENGINEER YOUR EVOLUTION.</h1>
    <p ref={addToRefs} className="fade-in-section" style={{transitionDelay: '0.2s'}}>Premium equipment for the dedicated athlete. Built for performance, designed for results.</p>
    <div ref={addToRefs} className="fade-in-section" style={{transitionDelay: '0.4s'}}>
    <a href="#equipment" className="btn btn-primary">Shop All Equipment</a>
    </div>
    </div>
    </section>

    <section id="categories" className="section container">
    <div ref={addToRefs} className="fade-in-section section-header">
    <h2>Shop by Category</h2>
    <p>From heavy lifting to high-intensity training, find exactly what you need to crush your goals.</p>
    </div>
    <div className="category-grid">
    {categories.map((cat, index) => (
      <div key={cat.name} ref={addToRefs} className="fade-in-section category-card" style={{transitionDelay: `${index * 0.1}s`}}>
      <img src={cat.image} alt={cat.name} />
      <h3>{cat.name}</h3>
      </div>
    ))}
    </div>
    </section>

    <section id="equipment" className="section container">
    <div ref={addToRefs} className="fade-in-section section-header">
    <h2>Best Sellers</h2>
    <p>Discover our most popular items, trusted by thousands of athletes to deliver peak performance.</p>
    </div>
    <div ref={addToRefs} className="fade-in-section product-carousel">
    {featuredProducts.map(product => (
      <div key={product.id} className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
      <h3 className="product-name">{product.name}</h3>

      </div>
      </div>
    ))}
    </div>
    </section>

    <section id="testimonials" className="section container">
    <div ref={addToRefs} className="fade-in-section section-header">
    <h2>What Our Members Say</h2>
    <p>Real stories from the people who use our gear to push their limits every day.</p>
    </div>
    <div className="testimonials-grid">
    {testimonials.map((t, index) => (
      <div key={index} ref={addToRefs} className="fade-in-section testimonial-card" style={{transitionDelay: `${index * 0.1}s`}}>
      <p className="testimonial-quote">"{t.quote}"</p>
      <p className="testimonial-author">- {t.author}</p>
      </div>
    ))}
    </div>
    </section>

    <section className="section container">
    <div ref={addToRefs} className="fade-in-section cta-section">
    <h2>Ready to Build Your Ultimate Gym?</h2>
    <p>Explore our full range of professional-grade equipment and start your journey today.</p>
    <a href="#equipment" className="btn btn-secondary">Explore Collection</a>
    </div>
    </section>

    </main>

    <footer className="footer">
    <div className="container">
    <div className="footer-grid">
    <div className="footer-about">
    <h4>Fitsetup<span>.</span></h4>
    <p>Providing top-tier gym equipment to help you achieve your fitness goals. We believe in quality, durability, and performance.</p>
    </div>
    <div className="footer-links">
    <h5>Shop</h5>
    <ul>
    <li><a href="#">Strength</a></li>
    <li><a href="#">Cardio</a></li>
    <li><a href="#">Apparel</a></li>
    <li><a href="#">Accessories</a></li>
    </ul>
    </div>
    <div className="footer-links">
    <h5>Support</h5>
    <ul>
    <li><a href="#">Contact Us</a></li>
    <li><a href="#">FAQ</a></li>
    <li><a href="#">Shipping</a></li>
    <li><a href="#">Returns</a></li>
    </ul>
    </div>
    <div className="footer-links">
    <h5>Company</h5>
    <ul>
    <li><a href="#">About Us</a></li>
    <li><a href="#">Blog</a></li>
    <li><a href="#">Careers</a></li>
    </ul>
    </div>
    </div>
    <div className="footer-bottom">
    <p>&copy; 2025 Fitsetup. All Rights Reserved.</p>
    </div>
    </div>
    </footer>
    </>
  );
}
