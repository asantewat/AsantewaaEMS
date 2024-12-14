import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [preferences] = useState([
    'academic', 'sports', 'cultural', 'technology', 'workshops', 'social'
  ]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const parseDateTime = (dateStr, timeStr) => {
    try {
      // Ensure date is in correct format (YYYY-MM-DD)
      const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10));
      
      // Ensure time is in correct format (HH:MM:SS or HH:MM)
      let [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
      if (isNaN(hours)) hours = 0;
      if (isNaN(minutes)) minutes = 0;

      // Create new date object
      const date = new Date(year, month - 1, day, hours, minutes);
      return date;
    } catch (error) {
      console.error('Error parsing date/time:', error);
      return new Date(); // Return current date as fallback
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/events');
      const data = await response.json();
      
      console.log('Raw event data:', data);

      const formattedEvents = data.map(event => {
        // Parse start date and time
        const startDate = parseDateTime(event.date, event.time);
        
        // Create end date (2 hours after start)
        const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000));

        return {
          id: event.id,
          title: event.name,
          start: startDate,
          end: endDate,
          category: event.category?.toLowerCase() || 'uncategorized',
          location: event.location,
          seats_available: event.seats_available,
          allDay: false,
          resource: {
            seats: event.seats_available,
            location: event.location
          }
        };
      });

      console.log('Formatted events:', formattedEvents);
      setEvents(formattedEvents);
      setFilteredEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleFilterChange = (pref) => {
    let newPreferences;
    if (selectedPreferences.includes(pref)) {
      newPreferences = selectedPreferences.filter(p => p !== pref);
    } else {
      newPreferences = [...selectedPreferences, pref];
    }
    setSelectedPreferences(newPreferences);

    if (newPreferences.length === 0) {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event => 
        newPreferences.includes(event.category)
      );
      setFilteredEvents(filtered);
    }
  };

  const EventComponent = ({ event }) => (
    <div className="calendar-event" title={`
      ${event.title}
      Location: ${event.location}
      Available Seats: ${event.seats_available}
    `}>
      <strong>{event.title}</strong>
    </div>
  );

  return (
    <div className="calendar-container">
      <div className="page-header">
        <h1>Event Calendar</h1>
        <p>View all upcoming events in calendar format</p>
      </div>

      <div className="content-container">
        <div className="preference-filters">
          {preferences.map(pref => (
            <label key={pref} className="checkbox-label">
              <input 
                type="checkbox"
                checked={selectedPreferences.includes(pref)}
                onChange={() => handleFilterChange(pref)}
              />
              <span className="capitalize">{pref}</span>
            </label>
          ))}
        </div>

        <div className="calendar-grid">
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600, margin: '20px' }}
            views={['month', 'week', 'day']}
            defaultView="month"
            components={{
              event: EventComponent
            }}
            popup
            tooltipAccessor={null}
            onSelectEvent={(event) => {
              console.log('Selected event:', event);
              alert(`
                Event: ${event.title}
                Location: ${event.location}
                Available Seats: ${event.seats_available}
              `);
            }}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: '#ff69b4',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                padding: '2px 5px'
              }
            })}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarView; 