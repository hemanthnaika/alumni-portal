import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import AdminFooter from '../components/AdminFooter';
import './HomePage.css';

const HomePage = () => {
  const [adminName, setAdminName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminName === 'uttam' && password === 'uttam@123') {
      alert('✅ Login successful');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('login', 1);
      navigate('/dashboard');
    } else {
      alert('❌ Invalid credentials');
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/dashboard');
    }

    // Prevent back navigation
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  return (
    <>
      <AdminHeader />
      <main className="home-content">
        <div className="welcome-section">
          <h1>🎓 Welcome to the Alumni Portal</h1>
          <p>Connect • Share • Grow with our Alumni Network</p>
        </div>

        <div className="login-card">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <label htmlFor="adminName">Admin Name</label>
            <input
              type="text"
              id="adminName"
              placeholder="Enter admin name"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>
        </div>
      </main>
      <AdminFooter />
    </>
  );
};

export default HomePage;
