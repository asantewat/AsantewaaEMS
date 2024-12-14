document.addEventListener('DOMContentLoaded', () => {
    // Check if user is admin
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (!token || !isAdmin) {
        window.location.href = 'login.html';
        return;
    }

    // Load initial data
    loadStats();
    loadRecentActivity();
    loadEventStatistics();
    loadRSVPDetails();
});

async function loadStats() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            
            // Update stats
            document.getElementById('totalEvents').textContent = data.totalEvents;
            document.getElementById('activeEvents').textContent = data.activeEvents;
            document.getElementById('totalUsers').textContent = data.totalUsers;
            document.getElementById('newUsers').textContent = data.newUsers;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadRecentActivity() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/admin/activity', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            
            // Separate handling for events and users
            const eventsList = document.getElementById('recentEvents');
            const usersList = document.getElementById('recentUsers');

            // Handle events
            eventsList.innerHTML = data.events.map(event => `
                <div class="activity-item">
                    <i class="fas fa-calendar"></i>
                    <span>New event created: ${event.name}</span>
                    <span class="activity-date">${new Date(event.createdAt).toLocaleDateString()}</span>
                </div>
            `).join('');

            // Handle users
            usersList.innerHTML = data.users.map(user => `
                <div class="activity-item">
                    <i class="fas fa-user"></i>
                    <span>New user joined: ${user.firstName} ${user.lastName}</span>
                    <span class="activity-date">${new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading activities:', error);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    window.location.href = 'login.html';
}

// Refresh dashboard data every 5 minutes
setInterval(async () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch('http://localhost:5000/api/admin/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const stats = await response.json();
                updateDashboardStats(stats);
            }
        } catch (error) {
            console.error('Error refreshing dashboard:', error);
        }
    }
}, 300000); 

async function loadEventStatistics() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/events/statistics', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const stats = await response.json();

        // Calculate total RSVPs across all events
        const totalRSVPs = stats.events.reduce((total, event) => {
            return total + (event.rsvps ? event.rsvps.length : 0);
        }, 0);

        document.getElementById('eventStats').innerHTML = `
            <div class="stat-item">
                <h3>Total Events</h3>
                <p>${stats.totalEvents}</p>
            </div>
            <div class="stat-item">
                <h3>Total RSVPs</h3>
                <p>${totalRSVPs}</p>
            </div>
            <div class="stat-item">
                <h3>Active Events</h3>
                <p>${stats.activeEvents}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
} 

// Add this function to load and display RSVP details
async function loadRSVPDetails() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/events/all-rsvps', {
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
            const response = await fetch(`http://localhost:5000/api/events/${eventId}/cancel-all-rsvps`, {
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
  