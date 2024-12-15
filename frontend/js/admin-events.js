document.addEventListener('DOMContentLoaded', () => {
    // Check if user is admin
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (!token || !isAdmin) {
        window.location.href = 'login.html';
        return;
    }

    // Load initial events
    loadEvents();
});

function openTab(tabName) {
    // Hide all tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show the selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    document.querySelector(`[onclick="openTab('${tabName}')"]`).classList.add('active');

    // If switching to existing events, reload the events list
    if (tabName === 'existingEvents') {
        loadEvents();
    }
}

async function loadEvents() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://eventicity-backend.onrender.com/api/events', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const events = await response.json();
            displayEvents(events);
        }
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

function displayEvents(events) {
    const eventsList = document.querySelector('.events-container');
    if (!events.length) {
        eventsList.innerHTML = '<p>No events found</p>';
        return;
    }

    eventsList.innerHTML = events.map(event => `
        <div class="event-card">
            <h3>${event.name}</h3>
            <p><i class="fas fa-calendar"></i> ${new Date(event.date).toLocaleDateString()}</p>
            <p><i class="fas fa-clock"></i> ${event.time}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            <p><i class="fas fa-users"></i> Capacity: ${event.capacity}</p>
            <p>${event.description}</p>
            <p class="event-type">${event.type}</p>
            <div class="event-actions">
                <button onclick="deleteEvent('${event._id}')" class="action-btn delete">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Add event form submission handler with null check
const createEventForm = document.getElementById('createEventForm');

if (createEventForm) {
    createEventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            const eventData = {
                name: document.getElementById('eventName')?.value,
                date: document.getElementById('eventDate')?.value,
                time: document.getElementById('eventTime')?.value,
                location: document.getElementById('eventLocation')?.value,
                description: document.getElementById('eventDescription')?.value,
                capacity: document.getElementById('eventCapacity')?.value,
                type: document.getElementById('eventType')?.value
            };

            const response = await fetch('https://eventicity-backend.onrender.com/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(eventData)
            });

            if (response.ok) {
                alert('Event created successfully!');
                createEventForm.reset();
                openTab('existingEvents');
            } else {
                throw new Error('Failed to create event');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create event. Please try again.');
        }
    });
}

// Function to delete an event
async function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://eventicity-backend.onrender.com/api/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('Event deleted successfully');
                loadEvents(); // Refresh the events list
            } else {
                alert('Failed to delete event');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting event');
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    window.location.href = 'login.html';
} 