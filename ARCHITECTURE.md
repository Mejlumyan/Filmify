# Filmify Frontend - Architecture Documentation

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Filmify Frontend                  │
├─────────────────────────────────────────────────────┤
│  React 19.2.0  │  Vite 7.2.4  │  TypeScript 5.6   │
├─────────────────────────────────────────────────────┤
│                    UI Components                     │
│  (Pages, Components, Layouts, Modals)               │
├─────────────────────────────────────────────────────┤
│              React Router (Navigation)               │
├─────────────────────────────────────────────────────┤
│            Services Layer (API Integration)          │
│  (Auth, Movies, Cinema, Payments)                   │
├─────────────────────────────────────────────────────┤
│              Axios + Interceptors                    │
├─────────────────────────────────────────────────────┤
│          Backend API (Node.js + Express)            │
└─────────────────────────────────────────────────────┘
```

## 🏗️ Project Structure

### `/src` Directory Breakdown

```
src/
├── pages/                          # Route components
│   ├── menu/                       # User pages
│   │   ├── Home.jsx               # Movie listing
│   │   ├── movie/                 
│   │   │   ├── Movie.jsx          # Detail view
│   │   │   ├── Booking.jsx        # Booking interface
│   │   │   └── Payment.jsx        # History
│   │   └── Discover.jsx           # Browse movies
│   ├── admin/                      # Admin pages
│   │   ├── Admin.jsx              # Main dashboard
│   │   ├── add-movie.jsx          # Movie form
│   │   ├── AddCinema.jsx          # Cinema form
│   │   ├── MovieList.jsx          # Movie CRUD
│   │   ├── AllUsersList.jsx       # User management
│   │   └── MovieCalendar.jsx      # Showtime calendar
│   ├── auth/                       # Authentication
│   │   ├── login/
│   │   ├── register/
│   │   ├── ForgotPassword/
│   │   └── ChangePassword/
│   ├── 404/NotFound.jsx
│   └── CinemaLayout.jsx           # Main layout wrapper
│
├── components/                     # Reusable UI components
│   ├── Footer.jsx                 # Footer
│   ├── ScrollToTop.jsx            # Scroll behavior
│   ├── Card.jsx                   # Movie card
│   ├── StripePaymentForm.jsx      # Payment form
│   └── CustomIcons.jsx            # Icon wrapper
│
├── services/                       # API service layers
│   ├── authService.js             # Auth endpoints
│   ├── movieService.js            # Movie CRUD
│   ├── cinemaService.js           # Cinema CRUD
│   ├── paymentService.js          # Payment operations
│   └── adminService.js            # Admin operations
│
├── config/                         # Configuration
│   ├── axios.js                   # HTTP client setup
│   └── react-router.jsx           # Route definitions
│
├── hooks/                          # Custom React hooks
│   └── useDeleteMovie.js
│
├── utils/                          # Helper functions
│   └── utils.js
│
├── types/                          # Type definitions
│   └── type.js
│
├── main.jsx                        # Entry point
├── App.jsx                         # Root component
└── index.css                       # Global styles
```

## 🔄 Data Flow

### User Authentication Flow
```
Login Form
    ↓
authService.login()
    ↓
Backend API (/auth/login)
    ↓
JWT Token + User Data
    ↓
localStorage.setItem('accessToken')
    ↓
Redirect to Home
    ↓
Protected Routes Check
```

### Movie Booking Flow
```
Browse Movies (Home)
    ↓
Select Movie → Movie Detail Page
    ↓
Click "Book Now" → Booking Page
    ↓
Select Seats → Available Seats API
    ↓
Review Order → Payment Form
    ↓
Stripe Payment → Payment API
    ↓
Ticket Confirmation
```

## 🔌 Service Layer

### API Service Architecture

**File: `services/movieService.js`**
```javascript
export const movieService = {
  // Read operations
  getAllMovies: () => axios.get('/movies'),
  getMovieById: (id) => axios.get(`/movies/${id}`),
  
  // Write operations
  addMovie: (data) => axios.post('/movies', data),
  updateMovie: (id, data) => axios.put(`/movies/${id}`, data),
  deleteMovie: (id) => axios.delete(`/movies/${id}`),
};
```

### Service Usage in Components
```jsx
import { movieService } from '../services/movieService';

const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    movieService.getAllMovies()
      .then(res => setMovies(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return <div>{/* render movies */}</div>;
};
```

## 🛣️ Routing Architecture

### Route Configuration
```javascript
// config/react-router.jsx
export const routes = [
  {
    element: <PublicRoute />,  // Login, Register
    children: [...]
  },
  {
    element: <ProtectedRoute />,  // Requires auth
    children: [
      {
        path: "/",
        element: <CinemaLayout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "movie/:id", element: <Movie /> },
          { path: "admin/*", element: <Admin /> },
        ]
      }
    ]
  }
];
```

### Protected Route Implementation
```jsx
const ProtectedRoute = () => {
  const token = localStorage.getItem("accessToken");
  return token ? <Outlet /> : <Navigate to="/login" />;
};
```

## 🎨 Styling Architecture

### SCSS Organization
```
styles/
├── variables.scss        # Colors, fonts, sizes
├── mixins.scss          # Reusable mixins
├── global.scss          # Global styles
├── components/
│   ├── Button.scss
│   ├── Form.scss
│   └── Card.scss
└── pages/
    ├── Home.scss
    ├── Admin.scss
    └── Booking.scss
```

### Dark Mode Implementation
```scss
// Define colors with dark mode support
.dark & {
  background-color: #020617;
  color: #fff;
}

// In component
body.dark {
  --bg-primary: #020617;
  --text-primary: #ffffff;
}
```

### BEM Naming Convention
```scss
.button {                      // Block
  padding: 0.5rem;
  
  &__icon {                    // Element
    margin-right: 0.5rem;
  }
  
  &--primary {                 // Modifier
    background: $accent;
  }
  
  &:hover {                    // Pseudo-class
    opacity: 0.8;
  }
}
```

## 🔐 Authentication & Security

### JWT Token Management
```javascript
// axios.js - Interceptor for token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

### Password Security
1. Frontend validation (min 6 chars)
2. HTTPS transmission
3. Backend hashing with bcrypt
4. Email verification for reset (6-digit code)

## 🎭 Component Architecture

### Container vs Presentational

**Container Component (Smart)**
```jsx
// Handles state, API calls, logic
export const MovieContainer = () => {
  const [movies, setMovies] = useState([]);
  
  useEffect(() => {
    fetchMovies();
  }, []);
  
  return <MovieList movies={movies} />;
};
```

**Presentational Component (Dumb)**
```jsx
// Only receives props, renders UI
export const MovieList = ({ movies }) => {
  return (
    <div className="movie-list">
      {movies.map(movie => <MovieCard key={movie.id} {...movie} />)}
    </div>
  );
};
```

### Component Best Practices
- Single Responsibility Principle
- Prop validation
- Default props
- Memoization for expensive renders

```jsx
export const Card = React.memo(({ title, description }) => {
  return <div>{title}</div>;
});

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string
};

Card.defaultProps = {
  description: "No description"
};
```

## 🔄 State Management

### LocalStorage Usage
```javascript
// Authentication
localStorage.setItem('accessToken', token);
localStorage.getItem('accessToken');

// User Data
localStorage.setItem('user', JSON.stringify(userData));
JSON.parse(localStorage.getItem('user'));

// Theme
localStorage.setItem('theme', isDark ? 'dark' : 'light');
```

### Component State Pattern
```jsx
const [formData, setFormData] = useState({
  email: '',
  password: '',
  rememberMe: false
});

// Update single field
setFormData(prev => ({
  ...prev,
  email: e.target.value
}));

// Update multiple fields
setFormData({
  ...formData,
  email: 'new@email.com'
});
```

## 🎬 Animation & Motion

### Framer Motion Usage
```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Page transition
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// Stagger animation
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map((item, i) => (
    <motion.div key={i} variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

## 📱 Responsive Design Pattern

### Mobile-First Approach
```scss
// Base: Mobile (< 640px)
.card {
  grid-column: 1;
  padding: 1rem;
}

// Tablet (640px - 1024px)
@media (min-width: 640px) {
  .card {
    grid-column: span 2;
  }
}

// Desktop (> 1024px)
@media (min-width: 1024px) {
  .card {
    grid-column: span 3;
  }
}
```

## 🚀 Performance Optimization

### Code Splitting
```jsx
import { lazy, Suspense } from 'react';

const Admin = lazy(() => import('./pages/admin/Admin'));

export const routes = [
  {
    path: '/admin',
    element: (
      <Suspense fallback={<Loading />}>
        <Admin />
      </Suspense>
    )
  }
];
```

### Memoization
```jsx
// Prevent unnecessary re-renders
const MovieCard = React.memo(({ movie }) => {
  return <div>{movie.title}</div>;
});

// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return calculateValue(data);
}, [data]);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething();
}, []);
```

## 🧪 Error Handling

### Try-Catch Pattern
```jsx
const handleSubmit = async (data) => {
  try {
    const response = await movieService.addMovie(data);
    showSuccessMessage('Movie added!');
  } catch (error) {
    const message = error.response?.data?.message || 'An error occurred';
    showErrorMessage(message);
  }
};
```

### Error Boundary
```jsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong!</div>;
    }
    return this.props.children;
  }
}
```

## 📦 Dependencies Overview

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.2.0 | UI framework |
| react-router-dom | 7.13.0 | Client routing |
| framer-motion | 12.29.2 | Animations |
| axios | - | HTTP client |
| @stripe/react-stripe-js | - | Payment widget |
| lucide-react | 0.563.0 | Icons |
| react-datepicker | Latest | Date selection |
| qrcode | 1.5.4 | QR generation |

## 🔍 Debugging Tips

### Chrome DevTools
- React Developer Tools extension
- Network tab for API calls
- Storage tab for localStorage
- Performance profiler

### Console Logging
```javascript
// Conditional logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug:', data);
}

// Structured logging
console.table(moviesList);
console.time('operation');
// ... code
console.timeEnd('operation');
```

---

**For questions about architecture, open a GitHub issue or contact the maintainers.**
