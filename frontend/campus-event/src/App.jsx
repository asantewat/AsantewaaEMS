cdimport React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/loginpage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import CreateEvent from './pages/CreateEvent';
import CalendarView from './pages/CalendarView';
import ProfilePage from './pages/ProfilePage';
import EditEvent from './pages/EditEvent';
import './styles/global.css';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log('Current user:', user);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-logo">
          Camara Campus Event Manager
        </Link>
        <div className="nav-links">
          <Link to="/events">Events</Link>
          <Link to="/calendar">Calendar</Link>
          {user?.isAdmin && (
            <Link to="/create-event" className="admin-link">Create Event</Link>
          )}
          {!user ? (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          ) : (
            <>
              <Link to="/profile">Profile</Link>
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

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/events/edit/:eventId" element={<EditEvent />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
