import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserHomePage.css';

const UserHomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('login');
    navigate('/login');
  };

  return (
    <div className="user-homepage">
      <header className="user-header">
        <h2>🎓 Alumni Portal</h2>
        <nav>
          <button onClick={() => navigate('/user-home')}>HOME</button>
          <button onClick={() => navigate('/user-dashboard')}>DASHBOARD</button>
          <button onClick={handleLogout}>LOGOUT</button>
        </nav>
      </header>

      <main>
        <h3>Welcome to the Alumni Portal</h3>
        <p>You are now logged in. Use the navigation buttons to explore the portal.</p>
      </main>
    </div>
  );
};

export default UserHomePage;
