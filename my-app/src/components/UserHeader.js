// src/components/UserHeader.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserHeader.css';

const UserHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🔐 Clear user session data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('login');

    // ⛔ Prevent back navigation after logout
    window.history.pushState(null, '', window.location.href);
    const blockBackNavigation = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', blockBackNavigation);

    // 🔁 Redirect to login page
    navigate('/user');
  };

  return (
    <header className="user-header">
      <div className="logo">🎓 Alumni Portal</div>
      <nav>
        <button onClick={() => navigate('/user-home')}>HOME</button>
        <button onClick={() => navigate('/user-dashboard')}>DASHBOARD</button>
        {/* 🔴 EVENTS button removed as requested */}
        <button onClick={handleLogout}>LOGOUT</button>
      </nav>
    </header>
  );
};

export default UserHeader;
