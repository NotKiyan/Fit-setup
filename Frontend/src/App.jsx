import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './App.css'; //
import Layout from './components/Layout'; //
import HomePage from './pages/HomePage.jsx'; //
import UserProfile from './pages/UserProfile';
import CartPage from './pages/CartPage.jsx'; //
import BlogPage from './pages/BlogPage.jsx'; // Added
import LoginPage from './components/LoginPage'; //
import RequireAuth from './components/RequireAuth'; //
import AdminDashboard from './components/AdminDashboard'; // Added
import EquipmentsPage from './pages/EquipmentsPage'; //
import AccessoriesPage from './pages/AccessoriesPage'; //
import ProductPage from './pages/ProductPage';
import FavoritesPage from './pages/FavoritesPage';
/**
 * This component contains the routing logic and location-based effects.
 * It's wrapped by <Router> in the App component.
 */
function AppContent({ user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate(); // Hook used for profile page

  // Combined useEffect: Checks for user role (from file 2) and handles auto-logout (from file 1)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole'); // From file 2

    if (token && userEmail && !user) {
      // Set user with role
      setUser({ email: userEmail, token, role: userRole || 'customer' });
    } else if (!token && user) {
      // Auto-logout if token disappears
      setUser(null);
    }
  }, [location, user, setUser]); // Dependencies cover all cases

  return (
    <Routes>
    {/* Routes WITH Layout */}
    <Route element={<Layout user={user} setUser={setUser} />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/favorites" element={<FavoritesPage />} />
    <Route path="/equipments" element={<EquipmentsPage />} />
    <Route path="/accessories" element={<AccessoriesPage />} />
    <Route path="/blog" element={<BlogPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
    <Route path="/product/:id" element={<ProductPage />} />
    </Route>

    {/* Routes WITHOUT Layout */}
    <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage setUser={setUser} />} />

    <Route
    path="/profile"
    element={
      <RequireAuth user={user}>
      {/* Using file 1's logic to allow "back" navigation */}
      <UserProfile user={user} setIsProfileVisible={() => navigate(-1)} />
      </RequireAuth>
    }
    />

    <Route
    path="/admin" // Added from file 2
    element={
      <RequireAuth user={user}>
      {/* Logic from file 2 to check admin role */}
      {user && user.role === 'admin' ? (
        <AdminDashboard user={user} />
      ) : (
        <Navigate to="/" replace />
      )}
      </RequireAuth>
    }
    />
    </Routes>
  );
}

/**
 * Main App component. Sets up the Router and global user state.
 */
export default function App() {
  const [user, setUser] = useState(null);

  // Initial check for user token on app load (from file 2, includes role)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    if (token && userEmail) {
      setUser({ email: userEmail, token, role: userRole || 'customer' });
    }
  }, []); // Runs only once on mount

  return (
    <Router>
    <AppContent user={user} setUser={setUser} />
    </Router>
  );
}
