import React, { useRef, useEffect } from 'react';
import homeGymVideo from '../assets/homegymvid.mp4';
import kellebell from '../assets/kellebell.jpg';
import TrustedBy from '../components/TrustedBy';

const HomePage = () => {
  const sectionsRef = useRef([]);

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

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

    return () => {
      currentSections.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  const featuredProducts = [
    { id: 1, name: 'Pro-Grade Dumbbell Set', price: '$249.99', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 2, name: 'Adjustable Workout Bench', price: '$189.99', image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 3, name: 'CardioMax Treadmill', price: '$899.99', image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 4, name: 'Kettlebell Pro', price: '$79.99', image: kellebell },
  ];

  const categories = [
    { name: 'Strength', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Cardio', image: 'https://images.unsplash.com/photo-1723117418780-1b74b25af9bc?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170' },
    { name: 'Functional', image: 'https://plus.unsplash.com/premium_photo-1664299208816-ef56887db111?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171' },
  ];

  const testimonials = [
    { quote: "The quality from Fitsetup is unmatched. My home gym has never been better.", author: "Alex R." },
    { quote: "Fast shipping and incredible customer service. They helped me choose the perfect rack.", author: "Maria S." },
    { quote: "I've recommended Fitsetup to all my friends. The equipment is built to last.", author: "James L." },
  ];

  return (
    <main>
    <section id="home" className="hero">
    <video className="hero-video" autoPlay loop muted playsInline>
    <source src={homeGymVideo} type="video/mp4" />
    </video>
    <div className="hero-overlay"></div>
    <div className="hero-content container">
    <h1 ref={addToRefs} className="fade-in-section">ENGINEER YOUR EVOLUTION.</h1>
    <p ref={addToRefs} className="fade-in-section" style={{ transitionDelay: '0.2s' }}>Premium equipment for the dedicated athlete. Built for performance, designed for results.</p>
    <div ref={addToRefs} className="fade-in-section" style={{ transitionDelay: '0.4s' }}>
    <a href="#equipment" className="btn btn-primary">Shop All Equipment</a>
    </div>
    </div>
    </section>

    <TrustedBy />

    <section id="categories" className="section container">
    <div ref={addToRefs} className="fade-in-section section-header">
    <h2>Shop by Category</h2>
    <p>From heavy lifting to high-intensity training, find exactly what you need to crush your goals.</p>
    </div>
    <div className="home-category-grid">
    {categories.map((cat, index) => (
      // Removed comment from the previous line
      <div key={cat.name} ref={addToRefs} className="fade-in-section home-category-card" style={{ transitionDelay: `${index * 0.1}s` }}>
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
      <div key={index} ref={addToRefs} className="fade-in-section testimonial-card" style={{ transitionDelay: `${index * 0.1}s` }}>
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
  );
};

export default HomePage;
