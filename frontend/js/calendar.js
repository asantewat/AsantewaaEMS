document.addEventListener('DOMContentLoaded', () => {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    // Load initial calendar
    generateCalendar(currentMonth, currentYear);
    loadEvents();

    // Previous month button
    document.querySelector('.previous').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
        loadEvents();
    });

    // Next month button
    document.querySelector('.next').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
        loadEvents();
    });

    // Add filter event listener
    document.getElementById('categoryFilter').addEventListener('change', () => {
        loadEvents();
    });
});

function generateCalendar(month, year) {
    // Create date object for current month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay(); // Day of week (0-6)
    const monthLength = lastDay.getDate(); // Last day of month

    // Create table body
    let html = '';
    let day = 1;

    // Create weeks
    for (let i = 0; i < 6; i++) {
        html += '<tr>';

        // Create days
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < startingDay) {
                // Empty cells before start of month
                html += '<td></td>';
            } else if (day > monthLength) {
                // Empty cells after end of month
                html += '<td></td>';
            } else {
                // Valid day cell
                const date = new Date(year, month, day);
                const dateString = date.toISOString().split('T')[0];
                html += `<td data-date="${dateString}">${day}</td>`;
                day++;
            }
        }

        html += '</tr>';

        // Stop if we've reached the end of the month
        if (day > monthLength) {
            break;
        }
    }

    // Update table body
    document.querySelector('.calendar tbody').innerHTML = html;
}

async function loadEvents() {
    try {
        const token = localStorage.getItem('token');
        const selectedCategory = document.getElementById('categoryFilter').value;
        
        const response = await fetch('http://localhost:5000/api/events', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const events = await response.json();

        // Clear existing event markers
        document.querySelectorAll('.event-marker').forEach(marker => marker.remove());
        
        // Filter and add event markers
        events.forEach(event => {
            if (!selectedCategory || selectedCategory === 'all' || event.type === selectedCategory) {
                const eventDate = new Date(event.date);
                const dateCell = document.querySelector(`td[data-date="${eventDate.toISOString().split('T')[0]}"]`);
                
                if (dateCell) {
                    const marker = document.createElement('div');
                    marker.className = 'event-marker';
                    marker.title = event.name;
                    marker.style.backgroundColor = getCategoryColor(event.type);
                    marker._event = event; // Store event data in the marker
                    dateCell.appendChild(marker);
                    
                    dateCell.addEventListener('click', () => showEventDetails(event));
                }
            }
        });
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

function getCategoryColor(category) {
    const colors = {
        'workshops': '#ffcc00',
        'seminars': '#ff6b6b',
        'sports': '#4ecdc4',
        'club-activities': '#45b7d1'
    };
    return colors[category.toLowerCase()] || '#ffcc00';
}

function showEventDetails(clickedEvent) {
    // Get all events for the same date
    const clickedDate = new Date(clickedEvent.date).toISOString().split('T')[0];
    const allEvents = Array.from(document.querySelectorAll('.event-marker'))
        .map(marker => marker.parentElement.dataset.date === clickedDate ? marker._event : null)
        .filter(event => event);

    // Remove any existing modal
    const existingModal = document.querySelector('.event-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'event-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Events on ${new Date(clickedDate).toLocaleDateString()}</h2>
            <div class="events-list">
                ${allEvents.map(event => `
                    <div class="event-item" style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #555;">
                        <h3 style="color: #ffcc00;">${event.name}</h3>
                        <div class="event-details">
                            <p><i class="fas fa-clock"></i> Time: ${event.time}</p>
                            <p><i class="fas fa-map-marker-alt"></i> Location: ${event.location}</p>
                            <p><i class="fas fa-info-circle"></i> Description: ${event.description}</p>
                            <p><i class="fas fa-users"></i> Available Seats: ${event.capacity - (event.rsvps ? event.rsvps.length : 0)}</p>
                            <p><i class="fas fa-tag"></i> Type: ${event.type}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="modal-buttons">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="close-btn">Close</button>
            </div>
        </div>
    `;

    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    // Add modal content styles
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: #333;
        padding: 30px;
        border-radius: 8px;
        min-width: 300px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        color: #ffcc00;
    `;

    // Style event details
    modal.querySelectorAll('.event-details').forEach(details => {
        details.style.cssText = `
            margin: 10px 0;
            line-height: 1.6;
            color: #fff;
        `;
    });

    // Style buttons
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.style.cssText = `
        background: #ffcc00;
        color: #333;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        margin-top: 20px;
    `;

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Add modal to page
    document.body.appendChild(modal);
}
