document.addEventListener('DOMContentLoaded', () => {
    // Check if user is admin
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (!token || !isAdmin) {
        window.location.href = 'login.html';
        return;
    }

    // Load initial data
    loadRSVPDetails();
});

async function loadRSVPDetails() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/events/all-rsvps`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const events = await response.json();

        const rsvpTableContainer = document.getElementById('rsvpDetailsTable');
        if (events.length === 0) {
            rsvpTableContainer.innerHTML = '<p class="no-rsvps">No RSVPs yet</p>';
        } else {
            rsvpTableContainer.innerHTML = `
                <table class="rsvp-table">
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Location</th>
                            <th>Total RSVPs</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${events.map(event => `
                            <tr>
                                <td>${event.name}</td>
                                <td>${new Date(event.date).toLocaleDateString()}</td>
                                <td>${event.time}</td>
                                <td>${event.location}</td>
                                <td>${event.rsvps ? event.rsvps.length : 0}/${event.capacity}</td>
                                <td>
                                    <button onclick="cancelAllRSVPs('${event._id}')" class="cancel-all-btn">
                                        Cancel All
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
    } catch (error) {
        console.error('Error loading RSVP details:', error);
    }
}

// Function to cancel all RSVPs for an event
async function cancelAllRSVPs(eventId) {
    if (confirm('Are you sure you want to cancel all RSVPs for this event?')) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/events/${eventId}/cancel-all-rsvps`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('All RSVPs cancelled successfully');
                loadRSVPDetails(); // Refresh the table
            }
        } catch (error) {
            console.error('Error cancelling all RSVPs:', error);
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    window.location.href = 'login.html';
}
  