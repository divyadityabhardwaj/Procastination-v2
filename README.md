# Procastination V2

A modern web application designed to help users overcome procrastination by providing AI-powered video summarization, note-taking, and learning session management.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Now-brightgreen)](https://procastination-v2.netlify.app/)

## 🚀 Features

### Core Features

- **AI Video Summarization**: Extract key points from YouTube videos using Google Gemini AI
- **Smart Note-taking**: Rich text editor with markdown support for organized note-taking
- **AI Chat Assistant**: Interactive chat with AI about video content for deeper understanding
- **Session Management**: Organize learning sessions and track progress
- **Playlist Support**: Add entire YouTube playlists to sessions

### User Experience

- **Modern Dark Theme**: Beautiful gradient design with glassmorphism effects
- **Responsive Layout**: Fully responsive design that works on all devices
- **Resizable Interface**: Customizable layout with drag-to-resize panels
- **Collapsible Sidebar**: Minimizable notes sidebar for focused learning
- **Tab-based Navigation**: Switch between notes, AI chat, video player, and video list

### Authentication & Security

- **User Authentication**: Secure signup and login with Supabase Auth
- **Demo Account**: Quick access with demo credentials (demo@example.com / 123456)
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Session Persistence**: Maintains login state across browser sessions

### Advanced Features

- **Real-time Updates**: Live updates for notes and session data
- **Video Integration**: Direct YouTube video embedding with player controls
- **Note Organization**: Separate title and content fields for better organization
- **Cross-session Navigation**: Easy navigation between dashboard and sessions
- **Global Navigation**: Header with profile management and home navigation

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Components**: Material-UI (MUI) with custom theming
- **Styling**: Tailwind CSS, Emotion, custom gradients and animations
- **Backend**: Next.js API Routes with Supabase integration
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **AI**: Google Gemini API for video summarization and chat
- **State Management**: React Query for server state, React hooks for local state
- **Animations**: Framer Motion for smooth transitions and interactions
- **Deployment**: Netlify with automatic deployments

## 🎨 UI/UX Features

- **Dark Gradient Theme**: Modern dark theme with yellow accent colors
- **Glassmorphism Effects**: Translucent cards and modals with backdrop blur
- **Smooth Animations**: Page transitions and hover effects
- **Interactive Particles**: Animated background particles on landing page
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Loading States**: Skeleton loaders and progress indicators
- **Toast Notifications**: User feedback for actions and errors

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account
- Google Gemini API key

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/divyadityabhardwaj/Procastination-v2.git
   cd Procastination-v2
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory and add:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_AI_KEY=your_google_gemini_api_key
   ```

4. Run the development server

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Account

For quick testing, use the demo account:

- **Email**: demo@example.com
- **Password**: 123456

## 📱 Usage Guide

### Getting Started

1. **Sign Up/Login**: Create an account or use the demo credentials
2. **Create a Session**: Start a new learning session from the dashboard
3. **Add Videos**: Add YouTube videos or playlists to your session
4. **Take Notes**: Use the rich text editor to capture your thoughts
5. **Chat with AI**: Ask questions about video content using the AI chat
6. **Customize Layout**: Resize panels and toggle sidebar as needed

### Features Overview

- **Dashboard**: View all your learning sessions
- **Session View**: Interactive workspace with notes, video, and AI chat
- **Video Player**: Embedded YouTube player with AI-generated summaries
- **Notes Editor**: Rich text editor with markdown support
- **AI Chat**: Contextual chat about video content
- **Video List**: Manage multiple videos in a session

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

- Follow TypeScript best practices
- Use Material-UI components consistently
- Maintain the dark theme design system
- Add proper error handling and loading states
- Test responsive design across devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Live Demo

Check out the live demo: [Procastination V2](https://procastination-v2.netlify.app/)

## 🔮 Future Enhancements

- [ ] Video timestamp linking with notes
- [ ] Export notes to PDF/Markdown
- [ ] Collaborative sessions
- [ ] Advanced AI features (translation, code explanation)
- [ ] Mobile app version
- [ ] Offline support
- [ ] Integration with learning platforms
