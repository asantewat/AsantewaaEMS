import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-logo">
          Camara Campus Event Manager
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation links */}
        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/events" onClick={() => setIsMobileMenuOpen(false)}>Events</Link>
          <Link to="/calendar" onClick={() => setIsMobileMenuOpen(false)}>Calendar</Link>
          {user?.isAdmin && (
            <Link to="/create-event" className="admin-link" onClick={() => setIsMobileMenuOpen(false)}>
              Create Event
            </Link>
          )}
          {!user ? (
            <>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
            </>
          ) : (
            <>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
              <span className="user-email">{user.email}</span>
              <button onClick={handleLogout} className="btn logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;