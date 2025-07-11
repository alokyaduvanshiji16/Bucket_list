// Dark Mode functionality
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;
    
    // Check for saved dark mode preference or default to light mode
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        html.classList.add('dark');
    }
    
    darkModeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        localStorage.setItem('darkMode', html.classList.contains('dark'));
    });
}

// Form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateName(name) {
    return name.trim().length >= 2;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.classList.add('hidden');
}

function hideAllErrors() {
    const errorIds = ['loginEmailError', 'loginPasswordError', 'signupNameError', 'signupEmailError', 'signupPasswordError', 'confirmPasswordError'];
    errorIds.forEach(hideError);
}

function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `p-3 rounded-lg text-sm text-center ${
        type === 'success' 
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' 
            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
    }`;
    messageDiv.classList.remove('hidden');
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 5000);
}

// Tab switching functionality
function initializeTabs() {
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const messageDiv = document.getElementById('message');
    
    loginTab.addEventListener('click', () => {
        // Switch to login tab
        loginTab.className = 'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm';
        signupTab.className = 'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white';
        
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        messageDiv.classList.add('hidden');
        hideAllErrors();
    });
    
    signupTab.addEventListener('click', () => {
        // Switch to signup tab
        signupTab.className = 'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm';
        loginTab.className = 'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white';
        
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        messageDiv.classList.add('hidden');
        hideAllErrors();
    });
}

// User management functions
function saveUser(userData) {
    const users = JSON.parse(localStorage.getItem('bucketlist_users') || '[]');
    users.push(userData);
    localStorage.setItem('bucketlist_users', JSON.stringify(users));
}

function findUser(email) {
    const users = JSON.parse(localStorage.getItem('bucketlist_users') || '[]');
    return users.find(user => user.email === email);
}

function setCurrentUser(userData) {
    localStorage.setItem('bucketlist_currentUser', JSON.stringify(userData));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('bucketlist_currentUser') || 'null');
}

// Login form handling
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideAllErrors();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        let isValid = true;
        
        // Validate email
        if (!email) {
            showError('loginEmailError', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('loginEmailError', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate password
        if (!password) {
            showError('loginPasswordError', 'Password is required');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Check if user exists
        const user = findUser(email);
        if (!user) {
            showMessage('No account found with this email address. Please sign up first.', 'error');
            return;
        }
        
        // Check password
        if (user.password !== password) {
            showError('loginPasswordError', 'Invalid password');
            return;
        }
        
        // Successful login
        setCurrentUser(user);
        showMessage('Login successful! Redirecting to dashboard...', 'success');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    });
}

// Signup form handling
function initializeSignupForm() {
    const signupForm = document.getElementById('signupForm');
    
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideAllErrors();
        
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        let isValid = true;
        
        // Validate name
        if (!name) {
            showError('signupNameError', 'Name is required');
            isValid = false;
        } else if (!validateName(name)) {
            showError('signupNameError', 'Name must be at least 2 characters long');
            isValid = false;
        }
        
        // Validate email
        if (!email) {
            showError('signupEmailError', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('signupEmailError', 'Please enter a valid email address');
            isValid = false;
        } else if (findUser(email)) {
            showError('signupEmailError', 'An account with this email already exists');
            isValid = false;
        }
        
        // Validate password
        if (!password) {
            showError('signupPasswordError', 'Password is required');
            isValid = false;
        } else if (!validatePassword(password)) {
            showError('signupPasswordError', 'Password must be at least 6 characters long');
            isValid = false;
        }
        
        // Validate confirm password
        if (!confirmPassword) {
            showError('confirmPasswordError', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirmPasswordError', 'Passwords do not match');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };
        
        // Save user
        saveUser(newUser);
        setCurrentUser(newUser);
        
        showMessage('Account created successfully! Redirecting to dashboard...', 'success');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    });
}

// Check if user is already logged in
function checkAuthStatus() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        // User is already logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    initializeDarkMode();
    initializeTabs();
    initializeLoginForm();
    initializeSignupForm();
});