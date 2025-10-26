import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout'; // Make sure this exists
import HomePage from './pages/HomePage.jsx';
import UserProfile from './components/UserProfile';
import CartPage from './pages/CartPage.jsx';
// No need to import LoginPage here anymore, Layout handles it
import RequireAuth from './components/RequireAuth'; // Make sure this exists

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
    <Routes>
    <Route element={<Layout user={user} setUser={setUser} />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/cart" element={<CartPage />} />

    {/* This line is now removed, as Layout.jsx handles the modal */}
    {/* <Route path="/login" element={<LoginPage setUser={setUser} />} /> */}

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
    </Router>
  );
}
