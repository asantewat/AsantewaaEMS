// Define API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Common functions used across pages
function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// Add any other shared functions below 