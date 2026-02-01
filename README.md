# TaskSphere Frontend

A modern, minimalistic React frontend for the TaskSphere task management application.

## Features

✨ **Task Management**

- Create, edit, and delete tasks
- Set priorities, due dates, and reminders
- Recurring tasks support
- Subtasks with progress tracking
- Categories and tags for organization

🎮 **Gamification**

- Karma points system
- Achievement badges
- Streak tracking
- Leaderboard

🎨 **Modern UI/UX**

- Clean, minimalistic design
- Smooth animations with Framer Motion
- Responsive layout
- Interactive components

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Framer Motion** for animations
- **React Icons** for icons
- **date-fns** for date formatting

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── TaskCard.tsx
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── pages/              # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   └── ...
├── services/           # API service layer
│   ├── api.ts
│   ├── auth.service.ts
│   ├── task.service.ts
│   └── ...
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main app component with routing
└── main.tsx            # Entry point
```

## API Integration

The app connects to the TaskSphere backend API at:

```
https://tasksphere-production-090a.up.railway.app/api
```

Authentication uses JWT tokens stored in localStorage.

## Available Pages

- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password reset
- `/dashboard` - Main task dashboard
- `/tasks/create` - Create new task
- `/tasks/:id` - Task detail view
- `/categories` - Manage categories
- `/tags` - Manage tags
- `/profile` - User profile with stats
- `/badges` - View and track badges
- `/leaderboard` - Karma leaderboard

## License

MIT
