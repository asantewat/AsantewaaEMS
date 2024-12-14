document.addEventListener('DOMContentLoaded', async () => {
    try {
        const eventsContainer = document.querySelector('.events-container');
        if (!eventsContainer) {
            console.error('Events container not found');
            return;
        }

        const response = await fetch('http://localhost:5000/api/events');
        if (response.ok) {
            const events = await response.json();
            displayEvents(events);
        }
    } catch (error) {
        console.error('Error loading events:', error);
    }
});

function displayEvents(events) {
    const eventsContainer = document.querySelector('.events-container');
    
    if (!events.length) {
        eventsContainer.innerHTML = '<p>No events available.</p>';
        return;
    }

    eventsContainer.innerHTML = events.map(event => `
        <div class="event-card">
            <div class="event-date">
                <span class="day">${new Date(event.date).getDate()}</span>
                <span class="month">${new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div class="event-details">
                <h3>${event.name}</h3>
                <p class="event-time"><i class="fas fa-clock"></i> ${event.time}</p>
                <p class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                <p class="event-capacity">
                    <i class="fas fa-users"></i> 
                    Available Seats: ${event.capacity - (event.rsvps?.length || 0)}/${event.capacity}
                </p>
                <p class="event-description">${event.description}</p>
                <span class="event-type">${event.type}</span>
                ${localStorage.getItem('token') ? `
                    <button onclick="rsvpToEvent('${event._id}')" class="rsvp-btn">
                        RSVP
                    </button>
                ` : `
                    <a href="login.html" class="rsvp-btn">Login to RSVP</a>
                `}
            </div>
        </div>
    `).join('');
}

async function rsvpToEvent(eventId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`http://localhost:5000/api/events/${eventId}/rsvp`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert('Successfully RSVPed to event!');
            // Reload events to update capacity
            location.reload();
        } else {
            alert(data.msg || 'Failed to RSVP to event');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to RSVP to event. Please try again.');
    }
}