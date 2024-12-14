// Admin dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
    const createEventForm = document.getElementById('create-event-form');
    if (createEventForm) {
        createEventForm.addEventListener('submit', handleEventCreation);
    }
});

function handleEventCreation(e) {
    e.preventDefault();
    // Event creation logic will go here
} 


document.addEventListener('DOMContentLoaded', () => {
    // Initialize tabs
    const createEventForm = document.getElementById('create-event-form');
    if (createEventForm) {
        createEventForm.addEventListener('submit', handleEventCreation);
    }
    
    // Load existing events if on manage tab
    loadExistingEvents();
});

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'EventTab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

function handleEventCreation(e) {
    e.preventDefault();
    
    // Get form data
    const eventData = {
        name: document.getElementById('eventName').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value,
        capacity: document.getElementById('eventCapacity').value,
        type: document.getElementById('eventType').value,
        description: document.getElementById('eventDescription').value
    };
    
    // TODO: Send to backend
    console.log('Creating event:', eventData);
    
    // Clear form
    e.target.reset();
    
    // Show success message
    alert('Event created successfully!');
}

function loadExistingEvents() {
    // TODO: Fetch from backend
    const sampleEvents = [
        {
            id: 1,
            name: "Tech Workshop",
            date: "2024-03-15",
            location: "Main Hall",
            capacity: 50,
            rsvps: 23
        },
        // Add more sample events as needed
    ];
    
    const tableBody = document.getElementById('eventsTableBody');
    if (tableBody) {
        tableBody.innerHTML = sampleEvents.map(event => `
            <tr>
                <td>${event.name}</td>
                <td>${event.date}</td>
                <td>${event.location}</td>
                <td>${event.capacity}</td>
                <td>${event.rsvps}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-button edit-button" onclick="editEvent(${event.id})">Edit</button>
                        <button class="action-button delete-button" onclick="deleteEvent(${event.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

function editEvent(eventId) {
    // TODO: Implement edit functionality
    console.log('Editing event:', eventId);
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        // TODO: Implement delete functionality
        console.log('Deleting event:', eventId);
    }
}