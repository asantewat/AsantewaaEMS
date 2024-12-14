import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: '',
    capacity: '',
    isPrivate: false,
    registrationDeadline: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        alert('Event created successfully!');
        navigate('/events');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event');
    }
  };

  return (
    <div className="create-event-container">
      <div className="page-header">
        <h1>Create New Event</h1>
        <p>Add a new event to the campus calendar</p>
      </div>

      <div className="content-container">
        <div className="form-container">
          <form className="event-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Event Title*</label>
                <input 
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Event Date*</label>
                <input 
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Event Time*</label>
                <input 
                  type="time"
                  name="time"
                  value={eventData.time}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Location*</label>
                <input 
                  type="text"
                  name="location"
                  value={eventData.location}
                  onChange={handleChange}
                  placeholder="Enter event location"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Category*</label>
                <select 
                  name="category"
                  value={eventData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="academic">Academic</option>
                  <option value="sports">Sports</option>
                  <option value="cultural">Cultural</option>
                  <option value="technology">Technology</option>
                  <option value="workshops">Workshops</option>
                  <option value="social">Social</option>
                </select>
              </div>

              <div className="form-group">
                <label>Capacity*</label>
                <input 
                  type="number"
                  name="capacity"
                  value={eventData.capacity}
                  onChange={handleChange}
                  placeholder="Maximum attendees"
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description*</label>
              <textarea 
                name="description"
                value={eventData.description}
                onChange={handleChange}
                placeholder="Enter event description"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  name="isPrivate"
                  checked={eventData.isPrivate}
                  onChange={handleChange}
                />
                <span>Private Event</span>
              </label>
              
              <div className="form-group">
                <label>Registration Deadline</label>
                <input 
                  type="datetime-local"
                  name="registrationDeadline"
                  value={eventData.registrationDeadline}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn primary">Create Event</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent; 