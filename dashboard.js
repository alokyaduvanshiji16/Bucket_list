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

// User Management (shared with auth.js)
class UserManager {
    static getCurrentUser() {
        const user = localStorage.getItem('bucketlist_currentUser');
        return user ? JSON.parse(user) : null;
    }

    static logout() {
        localStorage.removeItem('bucketlist_currentUser');
    }
}

// Goal Management
class GoalManager {
    static saveGoal(goalData, userId) {
        const goals = this.getGoals(userId);
        const newGoal = {
            id: Date.now().toString(),
            ...goalData,
            completed: false,
            createdAt: new Date().toISOString()
        };
        goals.push(newGoal);
        localStorage.setItem(`bucketlist_goals_${userId}`, JSON.stringify(goals));
        return newGoal;
    }

    static getGoals(userId) {
        const goals = localStorage.getItem(`bucketlist_goals_${userId}`);
        return goals ? JSON.parse(goals) : [];
    }

    static updateGoal(goalId, updates, userId) {
        const goals = this.getGoals(userId);
        const goalIndex = goals.findIndex(goal => goal.id === goalId);
        if (goalIndex !== -1) {
            goals[goalIndex] = { ...goals[goalIndex], ...updates };
            localStorage.setItem(`bucketlist_goals_${userId}`, JSON.stringify(goals));
            return goals[goalIndex];
        }
        return null;
    }

    static deleteGoal(goalId, userId) {
        const goals = this.getGoals(userId);
        const filteredGoals = goals.filter(goal => goal.id !== goalId);
        localStorage.setItem(`bucketlist_goals_${userId}`, JSON.stringify(filteredGoals));
        return filteredGoals;
    }

    static toggleGoalCompletion(goalId, userId) {
        const goals = this.getGoals(userId);
        const goal = goals.find(g => g.id === goalId);
        if (goal) {
            goal.completed = !goal.completed;
            goal.completedAt = goal.completed ? new Date().toISOString() : null;
            localStorage.setItem(`bucketlist_goals_${userId}`, JSON.stringify(goals));
            return goal;
        }
        return null;
    }

    static getProgress(userId) {
        const goals = this.getGoals(userId);
        if (goals.length === 0) return 0;
        const completedGoals = goals.filter(goal => goal.completed).length;
        return Math.round((completedGoals / goals.length) * 100);
    }
}

// Toast Notification System
class ToastManager {
    static show(message, type = 'success', duration = 3000) {
        const toast = document.getElementById('successToast');
        const messageElement = document.getElementById('toastMessage');
        
        messageElement.textContent = message;
        
        // Update toast style based on type
        toast.className = toast.className.replace(/bg-\w+-500/, `bg-${type === 'success' ? 'green' : 'red'}-500`);
        
        // Show toast
        toast.style.transform = 'translateY(0)';
        
        // Hide after duration
        setTimeout(() => {
            toast.style.transform = 'translateY(100%)';
        }, duration);
    }
}

// Main Dashboard Controller
class DashboardController {
    constructor() {
        this.currentUser = null;
        this.goals = [];
        this.filteredGoals = [];
        this.searchQuery = '';
        
        this.init();
    }

    init() {
        // Check authentication
        this.currentUser = UserManager.getCurrentUser();
        if (!this.currentUser) {
            window.location.href = 'index.html';
            return;
        }

        // Initialize UI
        this.setupUserInterface();
        this.setupEventListeners();
        this.loadGoals();
        this.updateProgress();
    }

    setupUserInterface() {
        // Set user name in header
        const userName = document.getElementById('userName');
        const welcomeMessage = document.getElementById('welcomeMessage');
        
        userName.textContent = this.currentUser.name;
        welcomeMessage.textContent = `Welcome back, ${this.currentUser.name}!`;

        // Set minimum date for deadline to today
        const deadlineInput = document.getElementById('goalDeadline');
        const today = new Date().toISOString().split('T')[0];
        deadlineInput.min = today;
    }

    setupEventListeners() {
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            UserManager.logout();
            window.location.href = 'index.html';
        });

        // Goal form submission
        document.getElementById('goalForm').addEventListener('submit', (e) => {
            this.handleAddGoal(e);
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
    }

    handleAddGoal(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const goalData = {
            title: formData.get('title').trim(),
            category: formData.get('category'),
            deadline: formData.get('deadline'),
            notes: formData.get('notes').trim()
        };

        if (!goalData.title) {
            ToastManager.show('Goal title is required', 'error');
            return;
        }

        const newGoal = GoalManager.saveGoal(goalData, this.currentUser.id);
        this.goals.push(newGoal);
        
        // Reset form
        e.target.reset();
        
        // Update UI
        this.renderGoals();
        this.updateProgress();
        
        ToastManager.show('Goal added successfully!');
    }

    loadGoals() {
        this.goals = GoalManager.getGoals(this.currentUser.id);
        this.filteredGoals = [...this.goals];
        this.renderGoals();
    }

    handleSearch(query) {
        this.searchQuery = query.toLowerCase();
        this.filteredGoals = this.goals.filter(goal => 
            goal.title.toLowerCase().includes(this.searchQuery) ||
            goal.category.toLowerCase().includes(this.searchQuery) ||
            (goal.notes && goal.notes.toLowerCase().includes(this.searchQuery))
        );
        this.renderGoals();
    }

    renderGoals() {
        const container = document.getElementById('goalsContainer');
        const emptyState = document.getElementById('emptyState');
        const noResults = document.getElementById('noResults');

        // Clear container
        container.innerHTML = '';

        // Show appropriate state
        if (this.goals.length === 0) {
            emptyState.classList.remove('hidden');
            noResults.classList.add('hidden');
            return;
        } else {
            emptyState.classList.add('hidden');
        }

        if (this.filteredGoals.length === 0 && this.searchQuery) {
            noResults.classList.remove('hidden');
            return;
        } else {
            noResults.classList.add('hidden');
        }

        // Render goals
        this.filteredGoals.forEach(goal => {
            const goalCard = this.createGoalCard(goal);
            container.appendChild(goalCard);
        });
    }

    createGoalCard(goal) {
        const card = document.createElement('div');
        card.className = `bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 ${goal.completed ? 'opacity-75' : ''}`;
        
        const categoryEmoji = this.getCategoryEmoji(goal.category);
        const deadlineText = goal.deadline ? this.formatDeadline(goal.deadline) : '';
        const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && !goal.completed;

        card.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center mb-2">
                        <span class="text-lg mr-2">${categoryEmoji}</span>
                        <span class="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            ${goal.category}
                        </span>
                        ${isOverdue ? '<span class="ml-2 text-xs font-medium text-red-500 bg-red-100 dark:bg-red-900 px-2 py-1 rounded-full">Overdue</span>' : ''}
                    </div>
                    
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 ${goal.completed ? 'line-through' : ''}">
                        ${goal.title}
                    </h4>
                    
                    ${goal.notes ? `<p class="text-gray-600 dark:text-gray-400 mb-3">${goal.notes}</p>` : ''}
                    
                    <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        ${deadlineText ? `
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            ${deadlineText}
                        ` : ''}
                        ${goal.completed ? `
                            <span class="ml-auto text-green-600 dark:text-green-400 font-medium">
                                ✅ Completed ${this.formatDate(goal.completedAt)}
                            </span>
                        ` : ''}
                    </div>
                </div>
                
                <div class="flex items-center space-x-2 ml-4">
                    <button onclick="dashboardController.toggleGoalCompletion('${goal.id}')" 
                            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                            title="${goal.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                        ${goal.completed ? 
                            '<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>' :
                            '<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
                        }
                    </button>
                    
                    <button onclick="dashboardController.deleteGoal('${goal.id}')" 
                            class="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
                            title="Delete goal">
                        <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    getCategoryEmoji(category) {
        const emojiMap = {
            'Travel': '🌍',
            'Career': '💼',
            'Health': '💪',
            'Education': '📚',
            'Adventure': '🎯',
            'Creative': '🎨',
            'Personal': '👤',
            'Financial': '💰',
            'Social': '👥',
            'Other': '📝'
        };
        return emojiMap[category] || '📝';
    }

    formatDeadline(deadline) {
        const date = new Date(deadline);
        const now = new Date();
        const timeDiff = date.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysDiff < 0) {
            return `${Math.abs(daysDiff)} days ago`;
        } else if (daysDiff === 0) {
            return 'Today';
        } else if (daysDiff === 1) {
            return 'Tomorrow';
        } else if (daysDiff <= 7) {
            return `${daysDiff} days left`;
        } else {
            return date.toLocaleDateString();
        }
    }

    formatDate(dateString) {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    }

    toggleGoalCompletion(goalId) {
        const updatedGoal = GoalManager.toggleGoalCompletion(goalId, this.currentUser.id);
        if (updatedGoal) {
            // Update local goals array
            const goalIndex = this.goals.findIndex(g => g.id === goalId);
            if (goalIndex !== -1) {
                this.goals[goalIndex] = updatedGoal;
            }

            // Update filtered goals array
            const filteredIndex = this.filteredGoals.findIndex(g => g.id === goalId);
            if (filteredIndex !== -1) {
                this.filteredGoals[filteredIndex] = updatedGoal;
            }

            this.renderGoals();
            this.updateProgress();
            
            ToastManager.show(
                updatedGoal.completed ? 'Goal completed! 🎉' : 'Goal marked as incomplete',
                'success'
            );
        }
    }

    deleteGoal(goalId) {
        if (confirm('Are you sure you want to delete this goal?')) {
            GoalManager.deleteGoal(goalId, this.currentUser.id);
            
            // Update local arrays
            this.goals = this.goals.filter(g => g.id !== goalId);
            this.filteredGoals = this.filteredGoals.filter(g => g.id !== goalId);
            
            this.renderGoals();
            this.updateProgress();
            
            ToastManager.show('Goal deleted successfully');
        }
    }

    updateProgress() {
        const progress = GoalManager.getProgress(this.currentUser.id);
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}% complete`;
    }
}

// Initialize when DOM is loaded
let dashboardController;

document.addEventListener('DOMContentLoaded', () => {
    new DarkModeManager();
    dashboardController = new DashboardController();
});