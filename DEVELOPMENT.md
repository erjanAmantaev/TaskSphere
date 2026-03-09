# Development Guide

## Project Overview

TaskSphere Frontend is a modern React application built with TypeScript, Vite, and Tailwind CSS. It follows best practices for code organization, component design, and API integration.

## Project Structure

```
frontendForTaskSphere2/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Modal.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── TaskCard.tsx
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── contexts/          # React Context providers
│   │   └── AuthContext.tsx
│   │
│   ├── pages/             # Page components (routes)
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Tasks.tsx
│   │   ├── CreateTask.tsx
│   │   ├── TaskDetail.tsx
│   │   ├── Categories.tsx
│   │   ├── Tags.tsx
│   │   ├── Profile.tsx
│   │   ├── Badges.tsx
│   │   └── Leaderboard.tsx
│   │
│   ├── services/          # API service layer
│   │   ├── api.ts         # Axios instance & interceptors
│   │   ├── auth.service.ts
│   │   ├── task.service.ts
│   │   ├── category-tag.service.ts
│   │   └── user.service.ts
│   │
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   │
│   ├── App.tsx            # Main app with routing
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles + Tailwind
│
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Component Architecture

### Atomic Design Principles

**Atoms** (Basic building blocks)

- Button
- Input
- Textarea
- LoadingSpinner

**Molecules** (Simple component combinations)

- Modal (combines backdrop + content)
- TaskCard (combines multiple atoms)

**Organisms** (Complex components)

- Navbar
- Forms (in pages)

**Templates/Pages**

- All pages in `/pages` directory

### Component Guidelines

1. **Functional Components**
   - Use functional components with hooks
   - TypeScript for type safety
   - Props interface for each component

2. **State Management**
   - Local state with `useState` for component-specific data
   - Context API for global state (auth)
   - No external state library needed for this size

3. **Styling**
   - Tailwind utility classes
   - Custom classes in index.css
   - Inline styles only when dynamic

## API Integration

### Service Layer Pattern

All API calls are abstracted into service files:

```typescript
// Example: task.service.ts
export const taskService = {
  getTasks: async (filters) => {
    /* ... */
  },
  createTask: async (data) => {
    /* ... */
  },
  // ...
};
```

### Axios Instance

Centralized API configuration in `services/api.ts`:

- Base URL configuration
- Request/response interceptors
- Automatic token injection
- Token refresh logic
- Error handling

### Error Handling

```typescript
try {
  const data = await taskService.getTasks();
  setTasks(data);
} catch (error: any) {
  console.error("Failed to load tasks:", error);
  setError(error.response?.data?.error || "An error occurred");
}
```

## Authentication Flow

1. **Login/Register**
   - User submits credentials
   - API returns tokens
   - Tokens stored in localStorage
   - User state updated in AuthContext
   - Redirect to dashboard

2. **Protected Routes**
   - ProtectedRoute wrapper checks authentication
   - Redirects to login if not authenticated
   - Shows loading spinner during check

3. **Token Refresh**
   - Axios interceptor catches 401 errors
   - Attempts token refresh
   - Retries original request
   - Logs out if refresh fails

## State Management

### AuthContext

Provides authentication state and methods:

```typescript
const { isAuthenticated, userId, login, register, logout } = useAuth();
```

### Local Component State

Each page/component manages its own state:

- Loading states
- Error messages
- Form data
- List data

## Styling Guidelines

### Tailwind Classes

**Preferred approach:**

```tsx
<button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
  Click Me
</button>
```

**Custom classes** (in index.css):

```css
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-all;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700;
}
```

### Responsive Design

Mobile-first approach:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* ... */}
</div>
```

## Animation Guidelines

### Framer Motion

Used for page and component animations:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
>
  {/* Content */}
</motion.div>
```

### CSS Transitions

For simple hover effects:

```css
.card {
  @apply transition-all duration-200;
}

.card:hover {
  @apply shadow-md;
}
```

## Form Handling

### Controlled Components

All form inputs are controlled:

```tsx
const [title, setTitle] = useState("");

<Input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  label="Title"
  required
/>;
```

### Validation

- Client-side validation before submission
- Server-side error display
- Field-level error messages

## Data Fetching Patterns

### Load on Mount

```tsx
useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  setLoading(true);
  try {
    const data = await service.getData();
    setData(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### Reload After Mutation

```tsx
const handleCreate = async () => {
  await service.create(data);
  await loadData(); // Refresh list
};
```

## TypeScript Best Practices

### Type Definitions

Centralized in `types/index.ts`:

```typescript
export interface Task {
  id: number;
  title: string;
  // ...
}
```

### Props Typing

```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ variant, loading, ...props }) => {
  // ...
};
```

## Performance Optimization

### Lazy Loading

Could be added for route-based code splitting:

```typescript
const Dashboard = lazy(() => import("./pages/Dashboard"));
```

### Memoization

For expensive computations:

```typescript
const filteredTasks = useMemo(
  () => tasks.filter((t) => t.status === "active"),
  [tasks],
);
```

### Callback Optimization

```typescript
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies]);
```

## Development Workflow

### Starting Development

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Type Checking

```bash
npx tsc --noEmit
```

## Environment Variables

Create `.env` file for different environments:

```env
VITE_API_BASE_URL=https://tasksphere-production-d461.up.railway.app/api
```

Usage:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

## Debugging Tips

### React DevTools

Install React Developer Tools browser extension

### Network Tab

Monitor API calls in browser DevTools

### Console Logging

Strategic console.log placement:

```typescript
console.log("Loading tasks...", filters);
```

### Error Boundaries

Could be added for better error handling:

```typescript
class ErrorBoundary extends React.Component {
  // ...
}
```

## Testing (Future Enhancement)

### Unit Tests (Vitest)

```bash
npm install -D vitest @testing-library/react
```

### E2E Tests (Playwright)

```bash
npm install -D @playwright/test
```

## Code Quality

### ESLint

Already configured via Vite template

### Prettier

Can be added:

```bash
npm install -D prettier
```

### Pre-commit Hooks

Can add with Husky:

```bash
npm install -D husky lint-staged
```

## Deployment

### Build

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

Drag `dist` folder to Netlify dashboard

## Common Issues & Solutions

### CORS Errors

Backend must allow frontend origin

### Token Expiry

Handled by axios interceptor - automatic refresh

### State Not Updating

Check if using immutable state updates

### Styles Not Applying

Ensure Tailwind is processing the file (check content array in config)

## Additional Resources

- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Vite Guide](https://vitejs.dev/guide/)

---

Happy coding! 🚀
