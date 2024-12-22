// Define API base URL
const API_BASE_URL = 'https://camaraevents-backend.onrender.com/api';

// Common functions used across pages
function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// Add any other shared functions below 