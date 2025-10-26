import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage.jsx';
import UserProfile from './components/UserProfile';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './components/LoginPage';
import RequireAuth from './components/RequireAuth';

function AppContent({ user, setUser }) {
  const location = useLocation();

  // Re-check user on location change
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    if (token && userEmail && !user) {
      setUser({ email: userEmail, token });
    }
  }, [location, user, setUser]);

  return (
    <Routes>
      <Route element={<Layout user={user} setUser={setUser} />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage setUser={setUser} />} />
        <Route
          path="/profile"
          element={
            <RequireAuth user={user}>
              <UserProfile user={user} />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    if (token && userEmail) {
      setUser({ email: userEmail, token });
    }
  }, []);

  return (
    <Router>
      <AppContent user={user} setUser={setUser} />
    </Router>
  );
}