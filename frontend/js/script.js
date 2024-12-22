// At the top of the file
// const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

// Common functionality across pages
document.addEventListener('DOMContentLoaded', () => {
    // Initialize any common elements
    initializeNavbar();
});

function initializeNavbar() {
    // Add active state to current page link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href').includes(currentPage)) {
            link.classList.add('active');
        }
    });
}

// Common utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Common validation functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
}

// Common alert/notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add to document
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Session management (will be expanded with backend integration)
function checkAuthStatus() {
    // This will be expanded when we add backend integration
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return Boolean(isLoggedIn);
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
} 


// Add this function to handle registration
async function handleRegistration(event) {
    event.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        preferences: Array.from(document.querySelectorAll('input[name="preferences[]"]:checked'))
            .map(checkbox => checkbox.value)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            // Registration successful
            localStorage.setItem('token', data.token);
            window.location.href = 'login.html'; // Redirect to login page
            alert('Registration successful! Please log in.');
        } else {
            // Registration failed
            alert(data.msg || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

// Add event listener to the registration form
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
});


function checkAuthAndExplore() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // User not logged in
        const wantToRegister = confirm('You need to be registered to explore events. Would you like to sign up?');
        if (wantToRegister) {
            window.location.href = 'register.html';
        }
    } else {
        // User is logged in, proceed to events page
        window.location.href = 'events.html';
    }
}