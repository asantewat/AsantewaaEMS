import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [userRsvps, setUserRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchUserRsvps();
  }, [user]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/events');
      const data = await response.json();
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const fetchUserRsvps = async () => {
    if (!user) return;
    try {
      const response = await fetch('http://localhost:5001/api/events/user-rsvps', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user RSVPs');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setUserRsvps(data.map(rsvp => rsvp.event_id));
      } else {
        console.error('Unexpected response format:', data);
        setUserRsvps([]);
      }
    } catch (error) {
      console.error('Error fetching user RSVPs:', error);
      setUserRsvps([]);
    }
  };

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded.userId;
  };

  const handleRSVP = async (eventId) => {
    try {
      if (!user) {
        alert('Please login to RSVP');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication token not found. Please login again.');
        return;
      }

      console.log('Attempting RSVP for event:', eventId);

      const response = await fetch(`http://localhost:5001/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('RSVP response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to RSVP');
      }

      // Update the events list with new available seats
      setEvents(events.map(event => 
        event._id === eventId 
          ? { ...event, availableSeats: data.event.availableSeats }
          : event
      ));
      
      // Add event to user's RSVPs
      setUserRsvps([...userRsvps, eventId]);
      alert('RSVP successful!');

    } catch (error) {
      console.error('RSVP error:', error);
      alert(error.message || 'Failed to RSVP. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Attempting to delete event:', eventId);
      const response = await fetch(`http://localhost:5001/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      // Log response details for debugging
      console.log('Delete response status:', response.status);
      
      // Get response as text first
      const text = await response.text();
      console.log('Raw response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete event');
      }

      // Remove the event from the state
      setEvents(events.filter(event => event._id !== eventId));
      alert('Event deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.message || 'Failed to delete event. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="events-page-container">
      <div className="page-header">
        <h1>Campus Events</h1>
        <p>Discover and join exciting events happening around campus</p>
      </div>

      <div className="content-container">
        <div className="events-filters">
          <select className="filter-select">
            <option value="">All Categories</option>
            <option value="academic">Academic</option>
            <option value="sports">Sports</option>
            <option value="cultural">Cultural</option>
            <option value="technology">Technology</option>
            <option value="workshops">Workshops</option>
            <option value="social">Social</option>
          </select>
        </div>
        
        <div className="events-grid">
          {events.map(event => (
            <div key={event._id} className="event-card">
              <div className="event-image">
                {event.imageUrl && <img src={event.imageUrl} alt={event.title} />}
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
                  {event.availableSeats} seats remaining
                </p>
                {user?.isAdmin && (
                  <div className="admin-controls">
                    <button 
                      className="btn secondary"
                      onClick={() => {
                        console.log('Editing event with ID:', event._id);
                        navigate(`/events/edit/${event._id}`);
                      }}
                      title="Edit Event"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn danger"
                      onClick={() => handleDeleteEvent(event._id)}
                      title="Delete Event"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
                <button 
                  onClick={() => handleRSVP(event._id)}
                  disabled={event.availableSeats === 0 || userRsvps.includes(event._id)}
                  className={`btn primary ${userRsvps.includes(event._id) ? 'rsvped' : ''}`}
                >
                  {userRsvps.includes(event._id) 
                    ? 'RSVP\'d' 
                    : event.availableSeats > 0 
                      ? 'RSVP Now' 
                      : 'RSVP'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
