// src/components/AdminHeader.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminHeader.css';

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🔐 Clear session-related data
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('login');

    // ⛔ Prevent back navigation after logout
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', () => {
      window.history.pushState(null, '', window.location.href);
    });

    // 🔁 Redirect to login
    navigate('/');
  };

  return (
    <header className="admin-header">
      <div className="logo">Alumni Portal</div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>
    </header>
  );
};

export default AdminHeader;
