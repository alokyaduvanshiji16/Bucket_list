// Dark Mode Management
class DarkModeManager {
    constructor() {
        this.darkModeToggle = document.getElementById('darkModeToggle');
        this.init();
    }

    init() {
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            this.enableDarkMode();
        }

        this.darkModeToggle.addEventListener('click', () => this.toggle());
    }

    enableDarkMode() {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }

    disableDarkMode() {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }

    toggle() {
        if (document.documentElement.classList.contains('dark')) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }
}

// Form Validation Utilities
class FormValidator {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePassword(password) {
        return password.length >= 6;
    }

    static validateRequired(value) {
        return value.trim() !== '';
    }

    static showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }

    static hideError(elementId) {
        const errorElement = document.getElementById(elementId);
        errorElement.classList.add('hidden');
    }

    static clearAllErrors() {
        const errorElements = document.querySelectorAll('[id$="Error"]');
        errorElements.forEach(element => element.classList.add('hidden'));
    }
}

// User Management
class UserManager {
    static saveUser(userData) {
        const users = this.getUsers();
        users.push({
            id: Date.now().toString(),
            ...userData,
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('bucketlist_users', JSON.stringify(users));
    }

    static getUsers() {
        const users = localStorage.getItem('bucketlist_users');
        return users ? JSON.parse(users) : [];
    }

    static findUser(email, password) {
        const users = this.getUsers();
        return users.find(user => user.email === email && user.password === password);
    }

    static userExists(email) {
        const users = this.getUsers();
        return users.some(user => user.email === email);
    }

    static setCurrentUser(user) {
        localStorage.setItem('bucketlist_currentUser', JSON.stringify(user));
    }

    static getCurrentUser() {
        const user = localStorage.getItem('bucketlist_currentUser');
        return user ? JSON.parse(user) : null;
    }

    static logout() {
        localStorage.removeItem('bucketlist_currentUser');
    }
}

// Authentication Handler
class AuthHandler {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.signupForm = document.getElementById('signupForm');
        this.loginFormElement = document.getElementById('loginFormElement');
        this.signupFormElement = document.getElementById('signupFormElement');
        this.showSignupBtn = document.getElementById('showSignup');
        this.showLoginBtn = document.getElementById('showLogin');
        
        this.init();
    }

    init() {
        // Check if user is already logged in
        const currentUser = UserManager.getCurrentUser();
        if (currentUser) {
            window.location.href = 'dashboard.html';
            return;
        }

        // Form toggle events
        this.showSignupBtn.addEventListener('click', () => this.showSignupForm());
        this.showLoginBtn.addEventListener('click', () => this.showLoginForm());

        // Form submission events
        this.loginFormElement.addEventListener('submit', (e) => this.handleLogin(e));
        this.signupFormElement.addEventListener('submit', (e) => this.handleSignup(e));

        // Real-time validation
        this.setupRealTimeValidation();
    }

    showSignupForm() {
        this.loginForm.classList.add('hidden');
        this.signupForm.classList.remove('hidden');
        FormValidator.clearAllErrors();
    }

    showLoginForm() {
        this.signupForm.classList.add('hidden');
        this.loginForm.classList.remove('hidden');
        FormValidator.clearAllErrors();
    }

    setupRealTimeValidation() {
        // Login form validation
        const loginEmail = document.getElementById('loginEmail');
        const loginPassword = document.getElementById('loginPassword');

        loginEmail.addEventListener('blur', () => {
            if (!FormValidator.validateRequired(loginEmail.value)) {
                FormValidator.showError('loginEmailError', 'Email is required');
            } else if (!FormValidator.validateEmail(loginEmail.value)) {
                FormValidator.showError('loginEmailError', 'Please enter a valid email');
            } else {
                FormValidator.hideError('loginEmailError');
            }
        });

        loginPassword.addEventListener('blur', () => {
            if (!FormValidator.validateRequired(loginPassword.value)) {
                FormValidator.showError('loginPasswordError', 'Password is required');
            } else {
                FormValidator.hideError('loginPasswordError');
            }
        });

        // Signup form validation
        const signupName = document.getElementById('signupName');
        const signupEmail = document.getElementById('signupEmail');
        const signupPassword = document.getElementById('signupPassword');
        const confirmPassword = document.getElementById('confirmPassword');

        signupName.addEventListener('blur', () => {
            if (!FormValidator.validateRequired(signupName.value)) {
                FormValidator.showError('signupNameError', 'Name is required');
            } else {
                FormValidator.hideError('signupNameError');
            }
        });

        signupEmail.addEventListener('blur', () => {
            if (!FormValidator.validateRequired(signupEmail.value)) {
                FormValidator.showError('signupEmailError', 'Email is required');
            } else if (!FormValidator.validateEmail(signupEmail.value)) {
                FormValidator.showError('signupEmailError', 'Please enter a valid email');
            } else if (UserManager.userExists(signupEmail.value)) {
                FormValidator.showError('signupEmailError', 'An account with this email already exists');
            } else {
                FormValidator.hideError('signupEmailError');
            }
        });

        signupPassword.addEventListener('blur', () => {
            if (!FormValidator.validateRequired(signupPassword.value)) {
                FormValidator.showError('signupPasswordError', 'Password is required');
            } else if (!FormValidator.validatePassword(signupPassword.value)) {
                FormValidator.showError('signupPasswordError', 'Password must be at least 6 characters');
            } else {
                FormValidator.hideError('signupPasswordError');
            }
        });

        confirmPassword.addEventListener('blur', () => {
            if (!FormValidator.validateRequired(confirmPassword.value)) {
                FormValidator.showError('confirmPasswordError', 'Please confirm your password');
            } else if (confirmPassword.value !== signupPassword.value) {
                FormValidator.showError('confirmPasswordError', 'Passwords do not match');
            } else {
                FormValidator.hideError('confirmPasswordError');
            }
        });
    }

    handleLogin(e) {
        e.preventDefault();
        FormValidator.clearAllErrors();

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        // Validate fields
        let hasErrors = false;

        if (!FormValidator.validateRequired(email)) {
            FormValidator.showError('loginEmailError', 'Email is required');
            hasErrors = true;
        } else if (!FormValidator.validateEmail(email)) {
            FormValidator.showError('loginEmailError', 'Please enter a valid email');
            hasErrors = true;
        }

        if (!FormValidator.validateRequired(password)) {
            FormValidator.showError('loginPasswordError', 'Password is required');
            hasErrors = true;
        }

        if (hasErrors) return;

        // Check credentials
        const user = UserManager.findUser(email, password);
        if (user) {
            UserManager.setCurrentUser(user);
            window.location.href = 'dashboard.html';
        } else {
            FormValidator.showError('loginPasswordError', 'Invalid email or password');
        }
    }

    handleSignup(e) {
        e.preventDefault();
        FormValidator.clearAllErrors();

        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        // Validate fields
        let hasErrors = false;

        if (!FormValidator.validateRequired(name)) {
            FormValidator.showError('signupNameError', 'Name is required');
            hasErrors = true;
        }

        if (!FormValidator.validateRequired(email)) {
            FormValidator.showError('signupEmailError', 'Email is required');
            hasErrors = true;
        } else if (!FormValidator.validateEmail(email)) {
            FormValidator.showError('signupEmailError', 'Please enter a valid email');
            hasErrors = true;
        } else if (UserManager.userExists(email)) {
            FormValidator.showError('signupEmailError', 'An account with this email already exists');
            hasErrors = true;
        }

        if (!FormValidator.validateRequired(password)) {
            FormValidator.showError('signupPasswordError', 'Password is required');
            hasErrors = true;
        } else if (!FormValidator.validatePassword(password)) {
            FormValidator.showError('signupPasswordError', 'Password must be at least 6 characters');
            hasErrors = true;
        }

        if (!FormValidator.validateRequired(confirmPassword)) {
            FormValidator.showError('confirmPasswordError', 'Please confirm your password');
            hasErrors = true;
        } else if (password !== confirmPassword) {
            FormValidator.showError('confirmPasswordError', 'Passwords do not match');
            hasErrors = true;
        }

        if (hasErrors) return;

        // Create user
        UserManager.saveUser({ name, email, password });
        
        // Log in the new user
        const newUser = UserManager.findUser(email, password);
        UserManager.setCurrentUser(newUser);
        
        window.location.href = 'dashboard.html';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DarkModeManager();
    new AuthHandler();
});