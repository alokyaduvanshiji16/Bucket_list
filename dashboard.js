// Global variables
let currentUser = null;
let goals = [];
let currentFilter = 'all';
let currentSearchTerm = '';

// Initialize dashboard
function initializeDashboard() {
    currentUser = getCurrentUser();
    
    if (!currentUser) {
        // Redirect to login if not authenticated
        window.location.href = 'index.html';
        return;
    }
    
    // Load user data and goals
    loadUserData();
    loadGoals();
    
    // Initialize all components
    initializeDarkMode();
    initializeEventListeners();
    updateUI();
}

// User management functions
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('bucketlist_currentUser') || 'null');
}

function loadUserData() {
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('welcomeMessage').textContent = `Welcome back, ${currentUser.name}!`;
}

// Dark mode functionality
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;
    
    // Check for saved dark mode preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        html.classList.add('dark');
    }
    
    darkModeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        localStorage.setItem('darkMode', html.classList.contains('dark'));
    });
}

// Goals management
function loadGoals() {
    const userGoals = localStorage.getItem(`bucketlist_goals_${currentUser.id}`);
    goals = userGoals ? JSON.parse(userGoals) : [];
}

function saveGoals() {
    localStorage.setItem(`bucketlist_goals_${currentUser.id}`, JSON.stringify(goals));
}

function addGoal(goalData) {
    const newGoal = {
        id: Date.now().toString(),
        title: goalData.title,
        category: goalData.category,
        deadline: goalData.deadline || null,
        notes: goalData.notes || '',
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };
    
    goals.unshift(newGoal); // Add to beginning of array
    saveGoals();
    updateUI();
    showSuccessModal('Goal added successfully!');
}

function toggleGoal(goalId) {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
        goal.completed = !goal.completed;
        goal.completedAt = goal.completed ? new Date().toISOString() : null;
        saveGoals();
        updateUI();
        
        if (goal.completed) {
            showSuccessModal('Congratulations! Goal completed! 🎉');
        }
    }
}

function deleteGoal(goalId) {
    if (confirm('Are you sure you want to delete this goal?')) {
        goals = goals.filter(g => g.id !== goalId);
        saveGoals();
        updateUI();
        showSuccessModal('Goal deleted successfully.');
    }
}

// UI rendering
function renderGoals() {
    const container = document.getElementById('goalsContainer');
    const emptyState = document.getElementById('emptyState');
    
    // Filter goals based on current filter and search term
    const filteredGoals = goals.filter(goal => {
        const matchesFilter = currentFilter === 'all' || 
                            (currentFilter === 'completed' && goal.completed) ||
                            (currentFilter === 'pending' && !goal.completed);
        
        const matchesSearch = currentSearchTerm === '' || 
                            goal.title.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
                            goal.category.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
                            goal.notes.toLowerCase().includes(currentSearchTerm.toLowerCase());
        
        return matchesFilter && matchesSearch;
    });
    
    if (filteredGoals.length === 0) {
        emptyState.style.display = 'block';
        // Update empty state message based on filter/search
        const emptyTitle = emptyState.querySelector('h3');
        const emptyDesc = emptyState.querySelector('p');
        
        if (currentSearchTerm) {
            emptyTitle.textContent = 'No matching goals';
            emptyDesc.textContent = 'Try adjusting your search term or filters.';
        } else if (currentFilter === 'completed') {
            emptyTitle.textContent = 'No completed goals';
            emptyDesc.textContent = 'Complete some goals to see them here!';
        } else if (currentFilter === 'pending') {
            emptyTitle.textContent = 'No pending goals';
            emptyDesc.textContent = 'All your goals are completed! Add more goals to continue.';
        } else {
            emptyTitle.textContent = 'No goals yet';
            emptyDesc.textContent = 'Get started by adding your first bucket list goal!';
        }
        return;
    }
    
    emptyState.style.display = 'none';
    
    const goalsHTML = filteredGoals.map(goal => {
        const categoryEmoji = getCategoryEmoji(goal.category);
        const deadlineText = goal.deadline ? formatDate(goal.deadline) : '';
        const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && !goal.completed;
        
        return `
            <div class="goal-card bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:shadow-md animate-slide-up ${goal.completed ? 'opacity-75' : ''}" data-goal-id="${goal.id}">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-2">
                            <button class="goal-toggle w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                                goal.completed 
                                    ? 'bg-green-500 border-green-500 text-white' 
                                    : 'border-gray-300 dark:border-gray-500 hover:border-green-400'
                            }" onclick="toggleGoal('${goal.id}')">
                                ${goal.completed ? '✓' : ''}
                            </button>
                            <h4 class="font-medium text-gray-900 dark:text-white ${goal.completed ? 'line-through' : ''}">${goal.title}</h4>
                        </div>
                        
                        <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span class="flex items-center">
                                ${categoryEmoji} ${goal.category}
                            </span>
                            ${deadlineText ? `
                                <span class="flex items-center ${isOverdue ? 'text-red-500' : ''}">
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    ${deadlineText} ${isOverdue ? '(Overdue)' : ''}
                                </span>
                            ` : ''}
                        </div>
                        
                        ${goal.notes ? `
                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">${goal.notes}</p>
                        ` : ''}
                    </div>
                    
                    <button class="delete-goal ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-all duration-200" onclick="deleteGoal('${goal.id}')">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Create a temporary container to hold the goals HTML
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = goalsHTML;
    
    // Clear the container and append new goals
    while (container.firstChild && container.firstChild !== emptyState) {
        container.removeChild(container.firstChild);
    }
    
    // Insert goals before empty state
    while (tempContainer.firstChild) {
        container.insertBefore(tempContainer.firstChild, emptyState);
    }
}

function getCategoryEmoji(category) {
    const emojis = {
        'Travel': '🌍',
        'Career': '💼',
        'Health': '💪',
        'Learning': '📚',
        'Adventure': '🏔️',
        'Creative': '🎨',
        'Social': '👥',
        'Personal': '🧘',
        'Other': '📝'
    };
    return emojis[category] || '📝';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Progress tracking
function updateProgress() {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.completed).length;
    const progressPercentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
    
    document.getElementById('progressText').textContent = `${progressPercentage}%`;
    document.getElementById('progressBar').style.width = `${progressPercentage}%`;
}

function updateGoalCount() {
    document.getElementById('goalCount').textContent = goals.length;
}

// Event listeners
function initializeEventListeners() {
    // Goal form submission
    document.getElementById('goalForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('goalTitle').value.trim(),
            category: document.getElementById('goalCategory').value,
            deadline: document.getElementById('goalDeadline').value,
            notes: document.getElementById('goalNotes').value.trim()
        };
        
        if (!formData.title) {
            alert('Please enter a goal title');
            return;
        }
        
        addGoal(formData);
        
        // Reset form
        document.getElementById('goalForm').reset();
    });
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('bucketlist_currentUser');
            window.location.href = 'index.html';
        }
    });
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', (e) => {
        currentSearchTerm = e.target.value;
        renderGoals();
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active', 'bg-blue-500', 'text-white', 'border-blue-500');
                b.classList.add('text-gray-700', 'dark:text-gray-300', 'border-gray-300', 'dark:border-gray-600', 'hover:bg-gray-50', 'dark:hover:bg-gray-700');
            });
            
            // Add active class to clicked button
            e.target.classList.add('active', 'bg-blue-500', 'text-white', 'border-blue-500');
            e.target.classList.remove('text-gray-700', 'dark:text-gray-300', 'border-gray-300', 'dark:border-gray-600', 'hover:bg-gray-50', 'dark:hover:bg-gray-700');
            
            currentFilter = e.target.dataset.filter;
            renderGoals();
        });
    });
    
    // Modal close
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('successModal').classList.add('hidden');
    });
    
    // Close modal when clicking outside
    document.getElementById('successModal').addEventListener('click', (e) => {
        if (e.target.id === 'successModal') {
            document.getElementById('successModal').classList.add('hidden');
        }
    });
}

// Modal functions
function showSuccessModal(message) {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successModal').classList.remove('hidden');
    
    // Auto close after 3 seconds
    setTimeout(() => {
        document.getElementById('successModal').classList.add('hidden');
    }, 3000);
}

// Update UI
function updateUI() {
    renderGoals();
    updateProgress();
    updateGoalCount();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeDashboard);