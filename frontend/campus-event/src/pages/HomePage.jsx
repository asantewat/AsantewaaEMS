import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/HomePage.css';

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/events');
      const data = await response.json();
      // Get the 3 most recent events
      setFeaturedEvents(data.slice(0, 3));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId) => {
    try {
        if (!user) {
            alert('Please login to RSVP');
            navigate('/login');
            return;
        }

        // Debug logs
        console.log('Current user:', user);
        
        const token = localStorage.getItem('token');
        console.log('Token exists:', !!token);
        
        if (!token) {
            alert('No authentication token found. Please login again.');
            navigate('/login');
            return;
        }

        // Log the request details
        console.log('Making RSVP request:', {
            url: `http://localhost:5001/api/events/${eventId}/rsvp`,
            eventId,
            hasToken: !!token
        });

        const response = await fetch(`http://localhost:5001/api/events/${eventId}/rsvp`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });

        console.log('Response received:', {
            status: response.status,
            ok: response.ok
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to RSVP');
        }

        const data = await response.json();
        console.log('Success response:', data);
        
        setFeaturedEvents(prevEvents => prevEvents.map(event => 
            event._id === eventId 
                ? { ...event, availableSeats: event.availableSeats - 1 }
                : event
        ));
        
        alert('Successfully RSVP\'d to the event!');

    } catch (error) {
        console.error('RSVP error details:', {
            message: error.message,
            user: user,
            eventId: eventId,
            hasToken: !!localStorage.getItem('token')
        });
        alert(`RSVP failed: ${error.message}`);
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Camara</h1>
          <p>Discover, Join, and Experience Amazing Campus Events</p>
          <div className="cta-buttons">
            <Link to="/events" className="btn primary">View Events</Link>
            {!user && <Link to="/register" className="btn secondary">Sign Up Now</Link>}
          </div>
        </div>
      </div>
      
      <div className="upcoming-events">
        <h2>Featured Events</h2>
        {loading ? (
          <div className="loading">Loading events...</div>
        ) : (
          <div className="events-grid">
            {featuredEvents.map(event => (
              <div key={event._id} className="event-card">
                <div className="event-image">
                  {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} />
                  ) : (
                    <div className="placeholder-image" />
                  )}
                  <div className="event-date">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div className="event-details">
                  <h3>{event.title}</h3>
                  <p className="event-info">
                    <span>📍 {event.location}</span>
                    <span>⏰ {event.time}</span>
                  </p>
                  <p className="seats-left">
                    {event.capacity - (event.registeredUsers?.length || 0)} seats remaining
                  </p>
                  <button 
                    className="btn primary"
                    onClick={() => handleRSVP(event._id)}
                    disabled={event.registeredUsers?.length >= event.capacity}
                  >
                    {event.registeredUsers?.length >= event.capacity 
                      ? 'RSVP Now' 
                      : 'RSVP Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="mobile-menu-btn">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  );
};

export default HomePage; 