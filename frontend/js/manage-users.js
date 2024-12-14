document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is admin
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (!token || !isAdmin) {
        window.location.href = 'login.html';
        return;
    }

    // Initial load
    loadUsers();

    // Search functionality
    document.getElementById('searchUsers').addEventListener('input', debounce(loadUsers, 300));
    
    // Filter functionality
    document.getElementById('filterUsers').addEventListener('change', loadUsers);
});

async function loadUsers(page = 1) {
    try {
        const token = localStorage.getItem('token');
        const searchTerm = document.getElementById('searchUsers').value;
        const filter = document.getElementById('filterUsers').value;

        const response = await fetch(`http://localhost:5000/api/admin/users?page=${page}&search=${searchTerm}&filter=${filter}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const { users, totalPages } = await response.json();
            displayUsers(users);
            updatePagination(page, totalPages);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.isAdmin ? 'Admin' : 'User'}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                <span class="status-badge ${user.active ? 'active' : 'inactive'}">
                    ${user.active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>
                <button onclick="viewUser('${user._id}')" class="action-btn small">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="editUser('${user._id}')" class="action-btn small">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="toggleUserStatus('${user._id}')" class="action-btn small">
                    <i class="fas fa-power-off"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function viewUser(userId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const user = await response.json();
            showUserModal(user);
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
    }
}

function showUserModal(user) {
    const modal = document.getElementById('userModal');
    const userDetails = document.getElementById('userDetails');
    
    userDetails.innerHTML = `
        <div class="user-detail-grid">
            <div class="detail-item">
                <label>Name:</label>
                <span>${user.firstName} ${user.lastName}</span>
            </div>
            <div class="detail-item">
                <label>Email:</label>
                <span>${user.email}</span>
            </div>
            <div class="detail-item">
                <label>Role:</label>
                <span>${user.isAdmin ? 'Admin' : 'User'}</span>
            </div>
            <div class="detail-item">
                <label>Joined:</label>
                <span>${new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="detail-item">
                <label>Preferences:</label>
                <span>${user.preferences.join(', ')}</span>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 