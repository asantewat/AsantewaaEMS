document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Fetch user data
        const response = await fetch('http://localhost:5000/api/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            document.getElementById('userName').textContent = userData.firstName;
            
            // Load user preferences
            if (userData.preferences) {
                const preferencesHtml = userData.preferences
                    .map(pref => `<div class="preference-item">${pref}</div>`)
                    .join('');
                document.getElementById('userPreferences').innerHTML = preferencesHtml;
            }

            // Load and display user's RSVPed events
            const eventsResponse = await fetch('http://localhost:5000/api/events/my-events', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const events = await eventsResponse.json();

            const rsvpedEventsTable = document.getElementById('rsvpedEventsTable');
            if (events.length === 0) {
                rsvpedEventsTable.innerHTML = '<p class="no-events">No RSVPed events yet</p>';
            } else {
                rsvpedEventsTable.innerHTML = `
                    <table class="events-table">
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${events.map(event => `
                                <tr>
                                    <td>${event.name}</td>
                                    <td>${new Date(event.date).toLocaleDateString()}</td>
                                    <td>${event.time}</td>
                                    <td>${event.location}</td>
                                    <td><span class="event-type">${event.type}</span></td>
                                    <td>
                                        <button onclick="cancelRSVP('${event._id}')" class="cancel-rsvp">
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            }

            // Load upcoming events
            loadUpcomingEvents();
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
});

async function loadUserEvents() {
    // Implement loading user's RSVPed events
}

async function loadUpcomingEvents() {
    // Implement loading upcoming events
}

function updatePreferences() {
    // Implement preferences update
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
}

async function cancelRSVP(eventId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/events/${eventId}/cancel-rsvp`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            // Refresh the page to update the table
            location.reload();
        } else {
            const data = await response.json();
            alert(data.msg || 'Failed to cancel RSVP');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to cancel RSVP');
    }
}