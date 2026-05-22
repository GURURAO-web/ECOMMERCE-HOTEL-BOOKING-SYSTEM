// script.js - Updated for backend integration

// Login function for backend authentication
async function login(event) {
    event.preventDefault(); // Prevent form from auto-submitting

    // Get form data
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    try {
        const response = await fetch("http://localhost:4000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Save token and username
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);
            
            alert('✅ Login successful!');
            window.location.href = 'reservation.html';
        } else {
            alert('❌ ' + data.message);
        }
    } catch (err) {
        alert('Error connecting to server. Please try again later.');
    }
}

// Registration function for new users
async function register(event) {
    event.preventDefault(); // Prevent form from auto-submitting

    // Get form data
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (!fullName || !email || !username || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    try {
        const response = await fetch("http://localhost:4000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, email, username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('✅ Registration successful! You can now login.');
            window.location.href = 'login.html';
        } else {
            alert('❌ ' + data.message);
        }
    } catch (err) {
        alert('Error connecting to server. Please try again later.');
    }
}

// Check if user is logged in (for protecting pages)
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You need to login first.');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

// Display username on pages
function displayUsername() {
    const username = localStorage.getItem('username');
    if (username) {
        const userElement = document.getElementById('display-username');
        if (userElement) {
            userElement.textContent = username;
        }
    }
}

// Initialize page functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    displayUsername();
    
    // Add event listeners to forms if they exist
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }
    
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', register);
    }
    
    // Check authentication for protected pages
    const protectedPages = ['reservation.html', 'welcome.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        checkAuth();
    }
});