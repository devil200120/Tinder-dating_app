# Amore Dating App 💕

A modern, full-featured dating app frontend built with React, Vite, and TailwindCSS.

## ✨ Features

### User Authentication
- Login and Signup pages with form validation
- Password visibility toggle
- Social login UI (Google, Facebook)
- Onboarding flow for new users

### Core Features
- **Swipe Discovery**: Tinder-style card swiping with animations
- **Matches Page**: View all your matches in a beautiful grid
- **Real-time Chat**: Send and receive messages with typing indicators
- **User Profiles**: View detailed profiles with photos, bio, and interests
- **Settings**: Customize preferences, notifications, and privacy

### UI/UX Highlights
- 🌓 Dark mode support with smooth transitions
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎨 Beautiful gradient backgrounds and animations
- ⚡ Smooth page transitions and micro-interactions
- 🎯 Intuitive navigation with bottom tab bar

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or extract the project**
   ```bash
   cd dating-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
dating-app/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and other assets
│   ├── components/        # Reusable components
│   │   ├── Avatar.jsx
│   │   ├── ChatBox.jsx
│   │   ├── ChatList.jsx
│   │   ├── MessageBubble.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProfileForm.jsx
│   │   ├── Sidebar.jsx
│   │   └── UserCard.jsx
│   ├── context/          # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── ChatContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useChat.js
│   │   └── useTheme.js
│   ├── pages/            # Page components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Onboarding.jsx
│   │   ├── Discover.jsx
│   │   ├── Matches.jsx
│   │   ├── Chats.jsx
│   │   ├── ChatRoom.jsx
│   │   ├── Profile.jsx
│   │   └── Settings.jsx
│   ├── utils/            # Utility functions and mock data
│   │   ├── mockData.js
│   │   └── helpers.js
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles with Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎯 Key Technologies

- **React 18**: Latest React features with hooks
- **Vite**: Lightning-fast development server
- **React Router v6**: Client-side routing
- **TailwindCSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Context API**: State management without external libraries

## 🔐 Demo Credentials

For testing purposes:
- **Email**: any valid email format
- **Password**: any password with 8+ characters

## 📱 Pages Overview

### Authentication
- **Login** (`/login`): User login with email and password
- **Signup** (`/signup`): New user registration
- **Onboarding** (`/onboarding`): 4-step onboarding for new users

### Main App
- **Discover** (`/discover`): Swipe through user profiles
- **Matches** (`/matches`): View all your matches
- **Chats** (`/chats`): List of all conversations
- **Chat Room** (`/chats/:userId`): Individual chat conversation
- **Profile** (`/profile`): View and edit your profile
- **Settings** (`/settings`): App settings and preferences

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  primary: {
    // Your custom colors
  }
}
```

### Dark Mode
Toggle dark mode using the theme switcher in the navbar or settings page.

## 🧪 Mock Data

The app uses mock data for demonstration:
- 8 sample user profiles with images from Unsplash
- Mock matches and chat messages
- Simulated real-time messaging (auto-replies)
- Mock authentication (no real backend)

## 🚧 Production Considerations

To make this production-ready, you would need to:

1. **Backend Integration**
   - Connect to a real API
   - Implement real authentication (JWT, OAuth)
   - Set up WebSocket for real-time messaging

2. **File Upload**
   - Implement image upload functionality
   - Add image optimization and validation

3. **Security**
   - Add HTTPS
   - Implement proper authentication tokens
   - Add rate limiting and validation

4. **Performance**
   - Add lazy loading for images
   - Implement infinite scroll
   - Add caching strategies

5. **Testing**
   - Add unit tests (Jest, React Testing Library)
   - Add E2E tests (Cypress, Playwright)

## 📄 License

This is a demo project for educational purposes.

## 🤝 Contributing

This is a demo project, but feel free to fork and modify for your own use!

## 💡 Tips

- All routes are protected except login/signup
- Swipe right to like, left to pass
- Click on user cards to view full profiles
- Dark mode persists across sessions
- Chat messages auto-reply for demo purposes

## 📞 Support

For questions or issues, please refer to the documentation or create an issue.

---

Made with ❤️ using React + Vite + TailwindCSS
