# Filmify - Frontend

A modern, responsive React-based cinema ticketing platform with real-time seat booking, payment integration, and an intuitive admin dashboard.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎬 Overview

Filmify is a full-stack cinema management and ticketing platform. This repository contains the **frontend** application built with React, featuring a modern UI with dark mode support, real-time booking, and seamless payment processing.

**Key Highlights:**
- 🎭 Real-time movie booking with seat selection
- 💳 Stripe payment integration
- 🌙 Dark/Light mode toggle
- 👨‍💼 Admin dashboard for movie management
- 🔐 Secure authentication with JWT & Google OAuth
- 📱 Fully responsive design
- ⚡ Built with modern React hooks & Framer Motion animations

---

## 🚀 Features

### User Features
- **Browse Movies** - Discover latest movies with detailed information
- **Real-time Booking** - Select seats and book tickets instantly
- **Payment Gateway** - Secure payment via Stripe
- **Profile Management** - View booking history, manage account
- **Password Reset** - Email-based password recovery system
- **Theme Toggle** - Light/Dark mode support
- **Search & Filter** - Find movies by title, genre, cinema

### Admin Features
- **Movie Management** - Add, edit movies with posters, banners, and trailers
- **Cinema Management** - Manage cinema halls and seating
- **Showtime Schedule** - Calendar-based showtime management
- **User Management** - View and manage registered users
- **Payment Monitoring** - Track all transactions

### Technical Features
- 📊 Responsive grid layouts
- 🎨 Beautiful UI with custom scrollbars
- 🔄 Redux-free state management
- 📦 DatePicker with English calendar (localization support)
- 🎞️ Video trailer support
- 💾 LocalStorage caching
- 🛡️ Protected routes & role-based access

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React** | UI framework |
| **Vite** | Build tool & dev server |
| **Redux/Context** | State management (if needed) |
| **React Router DOM** | Client-side routing |
| **Framer Motion** | Animations & transitions |
| **Axios** | HTTP client |
| **Stripe** | Payment processing |
| **Lucide React** | Icon library |
| **SCSS/CSS** | Styling with dark mode |
| **React DatePicker** | Date/time selection |
| **JWT Decode** | Token handling |
| **QRCode** | Ticket QR codes |

---

## 📦 Installation

### Prerequisites
- Node.js >= 18.x
- npm or yarn
- Git

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/filmify.git
cd filmify/front
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

5. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:8888`

---

## 📚 Project Structure

```
src/
├── pages/                      # Page components
│   ├── menu/                   # User pages
│   │   ├── Home.jsx           # Homepage with movie listing
│   │   ├── movie/
│   │   │   ├── Movie.jsx      # Movie detail page
│   │   │   ├── Booking.jsx    # Seat booking interface
│   │   │   ├── Payment.jsx    # Payment history
│   │   │   └── Search.jsx     # Search component
│   │   └── ...
│   ├── admin/                  # Admin pages
│   │   ├── Admin.jsx          # Admin dashboard
│   │   ├── add-movie.jsx      # Add movie form
│   │   ├── AddCinema.jsx      # Add cinema hall
│   │   ├── MovieList.jsx      # Movies list management
│   │   ├── AllUsersList.jsx   # User management
│   │   └── MovieCalendar.jsx  # Showtime calendar
│   ├── auth/                   # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── ForgotPassword/
│   │   └── ChangePassword/
│   ├── 404/
│   │   └── NotFound.jsx
│   └── CinemaLayout.jsx        # Main layout component
│
├── components/                 # Reusable components
│   ├── Footer.jsx             # Footer with contact info
│   ├── ScrollToTop.jsx        # Auto scroll on navigation
│   ├── Card.jsx               # Movie card
│   ├── CreditCardForm.jsx     # Payment form
│   └── StripePaymentForm.jsx  # Stripe integration
│
├── services/                   # API service layers
│   ├── authService.js         # Auth APIs
│   ├── movieService.js        # Movie APIs
│   ├── cinemaService.js       # Cinema APIs
│   ├── paymentService.js      # Payment APIs
│   └── ...
│
├── config/
│   ├── axios.js               # Axios setup
│   ├── react-router.jsx       # Route definitions
│
├── utils/
│   └── utils.js               # Helper functions
│
├── types/
│   └── type.js                # TypeScript types (if used)
│
├── styles/
│   ├── App.css                # Global styles
│   ├── index.css              # Root styles
│   └── ...
│
├── main.jsx                    # Entry point
└── App.jsx                     # Root component
```

---

## 🎯 Available Scripts

### Development
```bash
npm run dev
```
Starts Vite dev server with hot module replacement

### Build
```bash
npm run build
```
Creates optimized production build in `dist/` folder

### Preview
```bash
npm run preview
```
Preview production build locally

### Lint
```bash
npm run lint
```
Check code with ESLint

### Type Check
```bash
npm run type-check
```
Validate TypeScript types

---

## 🔐 Authentication

### Login Flow
1. User enters credentials
2. Backend validates and returns JWT token
3. Token stored in localStorage
4. All API requests include token in headers

### Protected Routes
- User routes require valid JWT token
- Invalid/expired tokens redirect to login
- Admin routes require admin role

### Password Reset
1. User clicks "Forgot Password"
2. Enters email address
3. 6-digit code sent to email (30-min expiry)
4. User verifies code and sets new password

---

## 💳 Payment Integration

### Stripe Setup
1. Get Stripe keys from [Stripe Dashboard](https://dashboard.stripe.com)
2. Add public key to `.env`
3. Backend handles secret key securely

### Payment Flow
1. User selects movie & seats
2. Enters card details in secure Stripe form
3. Payment processed via backend
4. Ticket confirmation with QR code

---

## 🎨 Styling & Theming

### Dark Mode
- Automatically respects system preference
- Toggle in Settings drawer
- Persisted in localStorage
- Smooth transitions between themes

### Design System
- **Primary Color**: #f5f505 (Yellow accent)
- **Dark Background**: #020617, #0f172a
- **Light Background**: #ffffff, #f5f5f5
- **Font**: Inter, system-ui
- Custom scrollbars with gradient effects

### SCSS Variables
```scss
$accent: #f5f505;
$accent-dark: #c4c404;
$accent-shadow: rgba(245, 245, 5, 0.3);
```

---

## 📱 Responsive Design

- **Mobile** (< 640px): Single column, stacked layout
- **Tablet** (640px - 1024px): Two column grid
- **Desktop** (> 1024px): Multi-column layouts
- Touch-friendly buttons and spacing
- Optimized performance for all devices

---

## 🔄 API Integration

### Base URL
```javascript
const API_BASE = process.env.VITE_API_URL || 'http://localhost:5000'
```

### Authentication Header
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Example Service Call
```javascript
// Get all movies
const getMovies = async () => {
  const response = await axios.get(`${API_BASE}/movies`);
  return response.data;
};
```

---

## 🚨 Error Handling

- Try-catch blocks on all async operations
- User-friendly error messages via Toast notifications
- Automatic token refresh on 401 responses
- Network error fallbacks

---

## ⚡ Performance Optimizations

- Code splitting with React.lazy
- Image optimization & lazy loading
- Debounced search input
- Memoized components to prevent re-renders
- Efficient state management
- Production bundle size: ~250KB gzipped

---

## 🐛 Troubleshooting

### Common Issues

**Dev server not starting**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Styling not applying**
```bash
# SCSS compilation error - check SCSS syntax
npm run build
```

**API calls failing**
- Check if backend is running
- Verify `.env` configuration
- Check browser console for errors
- Inspect Network tab in DevTools

**Dark mode not working**
- Check localStorage: `localStorage.getItem('theme')`
- Clear browser cache
- Check if `dark` class is on `html` element

---

## 📖 Documentation

### User Guide
- [How to Book Tickets](./docs/USER_GUIDE.md)
- [Payment Methods](./docs/PAYMENT.md)
- [Account Management](./docs/ACCOUNT.md)

### Developer Guide
- [API Documentation](./docs/API.md)
- [Component Architecture](./docs/COMPONENTS.md)
- [State Management](./docs/STATE.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use ESLint for linting
- Follow React best practices
- Use functional components with hooks
- Add comments for complex logic
- Keep components small and focused

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Frontend Developer**: [Your Name]
- **Backend Developer**: [Team Member]
- **UI/UX Designer**: [Team Member]

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/filmify/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/filmify/discussions)
- **Email**: support@filmify.com

---

## 🙏 Acknowledgments

- React community for amazing libraries
- Framer Motion for beautiful animations
- Stripe for payment processing
- All contributors and supporters

---

**Made with ❤️ by the Filmify Team**

---

## Quick Links
- [Live Demo](https://filmify-demo.com)
- [Backend Repository](https://github.com/yourusername/filmify-backend)
- [API Documentation](./docs/API.md)
- [Contributing Guide](CONTRIBUTING.md)
