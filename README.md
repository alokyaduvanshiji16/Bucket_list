# 🎯 Bucket List App

A modern, responsive web application for managing your bucket list goals and dreams. Built with HTML, Tailwind CSS, and vanilla JavaScript.

## ✨ Features

### 🔐 Authentication
- **Landing Page** with clean login/signup interface
- **User Registration** with form validation
- **Secure Login** with email and password
- **Form Validation** for all required fields
- **Email Format Validation** and password confirmation
- **User Session Management** with localStorage

### 📝 Goal Management
- **Add New Goals** with title, category, deadline, and notes
- **9 Predefined Categories** with emojis (Travel 🌍, Career 💼, Health 💪, etc.)
- **Optional Deadlines** with date picker
- **Mark Goals as Complete** ✅ with satisfaction animations
- **Delete Goals** 🗑️ with confirmation
- **Goal Notes** for additional details

### 🌟 User Experience
- **Progress Tracking** with visual progress bar showing completion percentage
- **Real-time Search** to filter goals by title, category, or notes
- **Smart Filtering** by All, Pending, or Completed goals
- **Overdue Notifications** for goals past their deadline
- **Success Modals** for user feedback
- **Empty State Messages** with helpful guidance

### 🎨 Design & UI
- **Dark Mode Toggle** 🌙 with persistent preference
- **Responsive Design** for mobile, tablet, and desktop
- **Modern Gradient Design** with Tailwind CSS
- **Smooth Animations** and transitions
- **Clean Typography** and intuitive layouts
- **Accessibility Features** with proper contrast and focus states

### 💾 Data Persistence
- **localStorage Integration** for offline functionality
- **Per-user Data Isolation** - each user has separate goals
- **Session Persistence** - stay logged in between visits
- **Data Safety** with proper error handling

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required!

### Installation
1. **Download or clone** the project files
2. **Ensure all files** are in the same directory:
   ```
   bucket-list-app/
   ├── index.html          # Landing/Login page
   ├── dashboard.html      # Main dashboard
   ├── auth.js            # Authentication logic
   ├── dashboard.js       # Dashboard functionality
   └── README.md          # This file
   ```

3. **Open `index.html`** in your web browser

### Running the App
1. **Double-click** `index.html` or
2. **Right-click** → "Open with" → Your preferred browser
3. Or serve it using a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```

## 📱 How to Use

### First Time Setup
1. **Visit the landing page** (`index.html`)
2. **Click "Sign Up"** to create a new account
3. **Fill in your details**:
   - Full Name (minimum 2 characters)
   - Email Address (valid format required)
   - Password (minimum 6 characters)
   - Confirm Password (must match)
4. **Click "Create Account"** and you'll be redirected to the dashboard

### Using the Dashboard
1. **Add Your First Goal**:
   - Enter a descriptive title (e.g., "Visit Tokyo")
   - Choose a category from the dropdown
   - Optionally set a deadline
   - Add notes for additional context
   - Click "Add Goal"

2. **Manage Your Goals**:
   - **Complete a goal**: Click the circular checkbox ✅
   - **Delete a goal**: Click the red trash icon 🗑️
   - **Search goals**: Use the search bar to find specific goals
   - **Filter goals**: Use "All", "Pending", or "Completed" buttons

3. **Track Your Progress**:
   - View your completion percentage in the welcome banner
   - Watch the progress bar fill as you complete goals

### Additional Features
- **Toggle Dark Mode**: Click the moon/sun icon in the top-right
- **Logout**: Click the logout button to end your session
- **Responsive Usage**: The app works great on all device sizes

## 🎨 Categories Available

| Category | Emoji | Description |
|----------|-------|-------------|
| Travel | 🌍 | Places to visit, trips to take |
| Career | 💼 | Professional goals and achievements |
| Health & Fitness | 💪 | Physical and mental wellness goals |
| Learning | 📚 | Skills to learn, courses to take |
| Adventure | 🏔️ | Exciting experiences and challenges |
| Creative | 🎨 | Artistic and creative pursuits |
| Social | 👥 | Relationships and social goals |
| Personal | 🧘 | Self-improvement and personal growth |
| Other | 📝 | Anything else you dream of doing |

## 💡 Tips for Best Experience

1. **Be Specific**: Write clear, actionable goal titles
2. **Set Realistic Deadlines**: Give yourself enough time to achieve your goals
3. **Use Notes**: Add context, plans, or inspiration to your goals
4. **Review Regularly**: Check your progress and celebrate completions
5. **Update Goals**: Don't hesitate to modify or delete goals as your priorities change

## 🔧 Technical Details

### Technologies Used
- **HTML5** for structure and semantics
- **Tailwind CSS** (via CDN) for styling and responsiveness
- **Vanilla JavaScript** for all functionality
- **localStorage** for data persistence
- **CSS Animations** for smooth user interactions

### Browser Compatibility
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Data Storage
- All data is stored locally in your browser
- No external servers or databases required
- Data persists between browser sessions
- Each user's data is completely separate

## 🔒 Privacy & Security

- **Local Storage Only**: All your data stays on your device
- **No External Requests**: No data is sent to external servers
- **User Isolation**: Each account's data is completely separate
- **No Analytics**: No tracking or data collection

## 🐛 Troubleshooting

### Common Issues
1. **Goals not saving**: Ensure localStorage is enabled in your browser
2. **Dark mode not persisting**: Check if your browser allows localStorage
3. **Layout issues**: Try refreshing the page or clearing browser cache
4. **Can't login**: Make sure you're using the correct email and password

### Browser Support
If you experience issues, try:
1. Using a different browser
2. Clearing browser cache and cookies
3. Ensuring JavaScript is enabled
4. Checking if localStorage is available

## 🤝 Contributing

This is a standalone project, but feel free to:
- Report bugs or suggest improvements
- Fork the project for your own modifications
- Share your experience using the app

## 📄 License

This project is open source and available under the MIT License.

---

**Start building your bucket list today and turn your dreams into achievable goals!** 🎯✨