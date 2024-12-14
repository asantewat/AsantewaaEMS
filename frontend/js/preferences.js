document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Load user preferences
    try {
        const response = await fetch('http://localhost:5000/api/users/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const user = await response.json();
            // Set checkboxes based on user preferences
            user.preferences.forEach(pref => {
                const checkbox = document.getElementById(pref);
                if (checkbox) checkbox.checked = true;
            });
        }
    } catch (error) {
        console.error('Error loading preferences:', error);
    }
});

// Handle form submission
document.getElementById('preferencesForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const checkboxes = document.querySelectorAll('input[name="preferences"]:checked');
    const preferences = Array.from(checkboxes).map(cb => cb.value);

    try {
        const response = await fetch('http://localhost:5000/api/users/preferences', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ preferences })
        });

        if (response.ok) {
            alert('Preferences saved successfully!');
        } else {
            throw new Error('Failed to save preferences');
        }
    } catch (error) {
        console.error('Error saving preferences:', error);
        alert('Failed to save preferences. Please try again.');
    }
}); 