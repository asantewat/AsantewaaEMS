document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('.register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                preferences: Array.from(document.querySelectorAll('input[name="preferences[]"]:checked'))
                    .map(checkbox => checkbox.value)
            };

            try {
                const response = await fetch('http://localhost:5000/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Registration successful!');
                    window.location.href = 'login.html';
                } else {
                    alert(data.msg || 'Registration failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Registration failed. Please try again.');
            }
        });
    }
});