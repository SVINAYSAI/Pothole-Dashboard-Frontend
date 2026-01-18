# Pothole Detection System - Frontend

A modern, production-ready React web application for managing real-time pothole detection using computer vision and GPS tracking. Built with React 19, Vite, Bootstrap, and advanced data visualization tools.

## Features

### Core User Features
- **Real-time Detection**: Live video feed processing with pothole detection
- **GPS Tracking**: Automatic location tracking for detected potholes
- **Video Analysis**: Support for uploaded videos and RTSP streams
- **Interactive Dashboard**: Real-time analytics with charts and maps
- **Session Management**: Track detection sessions with detailed statistics
- **Report Generation**: Comprehensive detection reports with CSV export
- **Video Downloads**: Download processed videos with annotated detections

### Admin Features
- **User Management**: View, manage, and control user accounts
- **Admin Dashboard**: Statistics on users, sessions, and system activity
- **Profile Management**: Manage admin user profile and settings
- **Pothole Thresholds**: Configure detection thresholds and sensitivity
- **User Status Control**: Activate/deactivate user accounts
- **Analytics Overview**: View system-wide analytics and metrics

### User Interface
- **Modern Bootstrap Design**: Clean, responsive UI using React Bootstrap
- **Mobile Responsive**: Fully optimized for mobile and tablet devices
- **Icon Library**: Modern icons via Lucide React and FontAwesome
- **Accessible**: Keyboard navigation support with proper semantic HTML
- **User Avatar Menu**: Quick access to profile and settings

### Technical Features
- **Modular Architecture**: Well-organized code with clear separation of concerns
- **API Integration**: Centralized API service layer with request/response interceptors
- **State Management**: React hooks-based state management (useState, useEffect)
- **Authentication**: JWT-based token authentication with localStorage
- **Real-time Updates**: Polling mechanisms for live data updates
- **Error Handling**: Comprehensive error boundaries and user feedback via toast notifications
- **Route Protection**: Private routes with role-based access control (User/Admin)

## Tech Stack

### Frontend Framework
- **React 19.1.0** - Modern UI library
- **React DOM 19.1.0** - DOM rendering
- **React Router DOM 7.6.0** - Client-side routing
- **Vite 6.3.5** - Fast build tool with HMR

### UI & Styling
- **React Bootstrap 2.10.10** - Bootstrap components for React
- **Bootstrap 5.3.8** - CSS framework
- **Lucide React 0.509.0** - Modern icon library
- **FontAwesome 6.7.2** - Additional icons
- **Framer Motion 12.12.2** - Animation library

### Data Visualization
- **Recharts 2.15.3** - React charts and graphs
- **ApexCharts 5.3.5** - Advanced charting
- **React ApexCharts 1.8.0** - ApexCharts React wrapper
- **Chart.js 4.4.9** - Canvas-based charting
- **React ChartJS 2 5.3.0** - Chart.js React wrapper
- **Google Maps API** - Interactive mapping via @react-google-maps/api 2.20.6

### HTTP & Data
- **Axios 1.9.0** - HTTP client with interceptors
- **PapaParse 5.5.3** - CSV parsing and generation

### Notifications
- **React Toastify 11.0.5** - Toast notifications

### Development
- **ESLint 9.25.0** - Code linting
- **@vitejs/plugin-react-swc 3.9.0** - SWC-based React compilation
- **TypeScript Definitions** - Type support for development

## Project Structure

```
pothole-detection-frontend/
├── src/
│   ├── admin/                           # Admin panel module
│   │   ├── AdminRegistration.jsx        # Admin registration page
│   │   ├── AdminRegistration.css        # Admin registration styles
│   │   ├── components/
│   │   │   ├── DeleteConfirmModal.jsx   # Confirmation dialog
│   │   │   └── UserModal.jsx            # User management modal
│   │   ├── layout/
│   │   │   ├── AdminLayout.jsx          # Admin layout wrapper
│   │   │   ├── AdminLayout.css          # Layout styles
│   │   │   ├── AdminHeader.jsx          # Admin header component
│   │   │   └── AdminSidebar.jsx         # Admin navigation sidebar
│   │   └── pages/
│   │       ├── AdminDashboard.jsx       # Admin dashboard
│   │       ├── AdminDashboard.css       # Dashboard styles
│   │       ├── AdminProfile.jsx         # Admin profile page
│   │       ├── AdminProfile.css         # Profile styles
│   │       ├── UsersManagement.jsx      # User management page
│   │       ├── UsersManagement.css      # Management styles
│   │       ├── PotholeThresholds.jsx    # Threshold configuration
│   │       └── PotholeThresholds.css    # Threshold styles
│   │
│   ├── auth/                            # Authentication module
│   │   ├── LoginSignup.jsx              # Login/Signup page
│   │   ├── LoginSignup.css              # Auth styles
│   │   ├── OTPVerification.jsx          # OTP verification page
│   │   ├── OTPVerification.css          # OTP styles
│   │   └── ForgotPasswordModal.jsx      # Password recovery
│   │
│   ├── components/                      # Shared components
│   │   ├── common/
│   │   │   └── ProcessingStatus.jsx     # Processing status indicator
│   │   ├── dashboard/                   # Dashboard-specific components
│   │   │   ├── AlertStatus.jsx          # Alert status display
│   │   │   ├── AlertStatus.css
│   │   │   ├── DetectionCharts.jsx      # Detection statistics charts
│   │   │   ├── DetectionCharts.css
│   │   │   ├── KPICards.jsx             # Key performance indicators
│   │   │   ├── KPICards.css
│   │   │   ├── MapStatistics.jsx        # Map with statistics
│   │   │   ├── MapStatistics.css
│   │   │   ├── PotholeMap.jsx           # Interactive pothole map
│   │   │   ├── PotholeMap.css
│   │   │   ├── SectionHeader.jsx        # Section header component
│   │   │   ├── SectionHeader.css
│   │   │   ├── TopDetections.jsx        # Top detections list
│   │   │   ├── TopDetections.css
│   │   │   ├── TrendChart.jsx           # Trend visualization
│   │   │   └── TrendChart.css
│   │   ├── AvatarMenu.jsx               # User avatar menu
│   │   ├── AvatarMenu.css
│   │   ├── Header.jsx                   # Main app header
│   │   ├── Header.css
│   │   ├── Sidebar.jsx                  # Main navigation sidebar
│   │   └── Sidebar.css
│   │
│   ├── config/
│   │   └── constants.js                 # App constants and config
│   │
│   ├── pages/                           # User pages
│   │   ├── AnalyticsDashboard.jsx       # Main analytics dashboard
│   │   ├── LiveDetectNew.jsx            # Live detection interface
│   │   ├── LiveDetectNew.css
│   │   ├── SessionHistory.jsx           # Session history list
│   │   ├── SessionHistory.css
│   │   ├── SessionDetails.jsx           # Session details view
│   │   ├── SessionDetails.css
│   │   ├── ContactUs.jsx                # Contact page
│   │   ├── UserProfile.jsx              # User profile page
│   │   └── UserProfile.css
│   │
│   ├── services/
│   │   ├── api.js                       # Centralized API service layer
│   │   └── dashboardService.js          # Dashboard-specific API calls
│   │
│   ├── styles/
│   │   └── AnalyticsDashboard.css       # Dashboard styles
│   │
│   ├── utils/
│   │   └── helpers.js                   # Utility helper functions
│   │
│   ├── assets/                          # Static assets
│   │   ├── react.svg
│   │   └── user-icon-svgrepo-com.svg
│   │
│   ├── App.jsx                          # Root app component
│   ├── App.css                          # App styles
│   ├── routes.jsx                       # Route definitions and setup
│   ├── main.jsx                         # Application entry point
│   ├── index.js                         # Index entry
│   └── index.css                        # Global styles
│
├── public/
│   ├── index.html                       # HTML template
│   └── vite.svg                         # Vite logo
│
├── package.json                         # npm dependencies and scripts
├── vite.config.js                       # Vite build configuration
├── eslint.config.js                     # ESLint configuration
└── README.md                            # This file
```

## Installation

### Prerequisites
- **Node.js 18+** - JavaScript runtime
- **npm 9+** - Package manager
- **Backend API** - Running on `http://localhost:8000` (or configured URL)
- **Google Maps API Key** - For mapping features (optional)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pothole-detection-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables** (optional)
   
   Create a `.env` file in the root directory:
   ```env
   # API Configuration
   VITE_API_URL=http://localhost:8000
   
   # Google Maps API (if using map features)
   VITE_GOOGLE_MAPS_KEY=your_google_maps_api_key
   ```
   
   If `.env` is not provided, the app will use defaults from `src/config/constants.js`

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173` (or the next available port)

5. **Build for production**
   ```bash
   npm run build
   ```
   
   Output will be in the `dist/` directory

6. **Preview production build**
   ```bash
   npm run preview
   ```

7. **Run linting**
   ```bash
   npm run lint
   ```

## Usage

### Authentication & Access Control

The application uses JWT-based authentication with role-based access control (RBAC):

#### User Registration
1. Navigate to the login page (default route)
2. Click **"Sign Up"** if you don't have an account
3. Fill in required fields:
   - Email
   - Password & Confirm Password
   - Full Name
   - Country Code & Mobile Number
4. Complete OTP verification if enabled
5. Login with your credentials

#### Admin Registration
1. Navigate to `/admin_registration`
2. Admin registration requires special credentials or invitation
3. Verify admin credentials during registration
4. Access admin dashboard after successful login

#### User Roles
- **User**: Access to detection features and personal dashboard
- **Admin**: Full system management and user control

### User Dashboard & Features

#### Analytics Dashboard
- View real-time detection statistics
- Charts showing detection counts by type
- Trend analysis with line charts
- Interactive pothole map with markers
- Session-based analytics

#### Live Detection
1. Navigate to **Live Detect** page
2. Choose input method:
   - **Upload Video File**: Select a video file from your device
   - **RTSP Stream**: Enter stream URL (e.g., `rtsp://...`)
   - **Webcam**: Enter `0` or webcam identifier
3. Click **Start Detection** to begin processing
4. Monitor:
   - Real-time video feed with detection overlays
   - GPS tracking status
   - Detection count and severity
5. Download processed video when detection completes

#### Session Management
- **Session History**: View all past detection sessions
- **Session Details**: 
  - Detailed statistics for each session
  - Detection distribution charts
  - Severity analysis
  - Pothole location data
  - Export capabilities

#### User Profile
- View and update personal information
- Manage account settings
- View session history

#### Contact
- Submit support requests
- View contact information
- Access support channels

### Admin Panel Features

#### Admin Dashboard
- View system statistics:
  - Total users
  - Active/Inactive users
  - Admin count
  - Recent user activity
- Quick overview of system health

#### Users Management
- List all system users
- View user details (email, phone, role, status)
- Activate/Deactivate user accounts
- Delete user accounts
- Filter and search users
- User activity monitoring

#### Admin Profile
- View admin account details
- Update profile information
- Change password
- Access admin settings

#### Pothole Thresholds
- Configure detection thresholds
- Set sensitivity levels
- Adjust detection parameters
- Configure alert thresholds
- Save configuration changes

## API Integration

The frontend communicates with a backend API. Key endpoints:

### Authentication Endpoints
```
POST   /auth/signup              - User registration
POST   /auth/login               - User login
POST   /auth/logout              - User logout
POST   /auth/verify-otp          - OTP verification
POST   /auth/forgot-password      - Password reset
POST   /admin/register            - Admin registration
```

### User Management Endpoints
```
GET    /users                     - Get all users
GET    /users/:id                 - Get user by ID
PUT    /users/:id                 - Update user
DELETE /users/:id                 - Delete user
PUT    /users/:id/toggle-status   - Activate/Deactivate user
GET    /users/profile             - Get current user profile
PUT    /users/profile             - Update current user profile
```

### Detection/Session Endpoints
```
POST   /detection/start           - Start detection session
GET    /detection/status/:id      - Get processing status
POST   /detection/upload          - Upload video file
GET    /detection/final_counts/:id     - Get detection counts
GET    /detection/severity_distance/:id - Get severity data
GET    /detection/locations/:id         - Get pothole coordinates
GET    /detection/video/:id             - Stream video feed
GET    /detection/download/:id          - Download processed video
GET    /detection/csv/:id               - Export as CSV
```

### Dashboard Endpoints
```
GET    /dashboard/stats           - Get dashboard statistics
GET    /dashboard/sessions        - Get user sessions
GET    /dashboard/recent          - Get recent detections
```

### Configuration Endpoints
```
GET    /config/thresholds         - Get thresholds config
PUT    /config/thresholds         - Update thresholds
```

## Configuration

### API Configuration

Edit `src/config/constants.js`:

```javascript
// API Base URL
export const API_BASE_URL = 'http://localhost:8000';

// Google Maps API Key
export const GOOGLE_MAPS_API_KEY = 'your_api_key_here';

// Detection Class Names
export const CLASS_NAMES = [
  'Broken_guide_pole',
  'Debris',
  'Faded_lines',
  'Fatigue_crack',
  'Horizontal_crack',
  'Manhole',
  'Patches',
  'Pothole',
  'Road_kills',
  'Vertical_crack',
];

// Map Configuration
export const MAP_LIBRARIES = ['visualization'];

// Polling Intervals (in milliseconds)
export const POLLING_INTERVALS = {
  DATA_FETCH: 5000,      // 5 seconds
  STATUS_CHECK: 10000,   // 10 seconds
  GPS_UPDATE: 5000,      // 5 seconds
};
```

### Environment Variables

Create `.env` in project root:

```env
# Backend API URL
VITE_API_URL=http://localhost:8000

# Google Maps API Key
VITE_GOOGLE_MAPS_KEY=your_google_maps_api_key

# Optional: Feature flags
VITE_ENABLE_ADMIN=true
VITE_ENABLE_REPORTS=true
```

### Build Configuration

Edit `vite.config.js` for build optimizations:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
```

## Key Features & Architecture

### Authentication & Authorization
- JWT token-based authentication with automatic token refresh
- Role-based access control (RBAC) for User and Admin roles
- Automatic logout on token expiration
- Secure password hashing and validation
- OTP verification support

### State Management
- React Hooks for local component state (useState)
- Context for global state where needed
- LocalStorage for persistent authentication tokens
- Efficient re-render optimization

### API Service Architecture
- Centralized `axios` instance with base configuration
- Request interceptors for adding authentication tokens
- Response interceptors for error handling and token refresh
- Type-safe error responses
- Automatic error handling with toast notifications

### Component Architecture
- Modular component design with single responsibility principle
- Separated concerns: Presentational vs Container components
- Reusable component library in `components/common`
- Dashboard-specific components in `components/dashboard`
- Admin-specific components in `admin/components`

### Data Visualization
- Multiple charting libraries (Recharts, ApexCharts, Chart.js)
- Interactive Google Maps for location visualization
- Real-time data updates with polling
- Responsive charts that adapt to screen size

### Styling
- Bootstrap 5 for responsive layout
- Component-scoped CSS for styles
- Consistent color scheme and typography
- Mobile-first responsive design
- Smooth animations with Framer Motion

## Performance Optimizations

✅ **Code Splitting**: Lazy loading of routes with React Router
✅ **Optimization**: SWC-based compilation for faster builds
✅ **Minification**: Vite automatic minification for production
✅ **Caching**: HTTP caching with Axios interceptors
✅ **Component Optimization**: Prevention of unnecessary re-renders
✅ **Bundle Size**: Tree-shaking and dead code elimination
✅ **Image Optimization**: Optimized SVG assets

## Code Quality Standards

✅ **Linting**: ESLint with React plugins for code consistency
✅ **Naming Conventions**: Consistent camelCase for variables/functions, PascalCase for components
✅ **Code Organization**: Logical file structure and grouping
✅ **Documentation**: JSDoc comments for complex functions
✅ **Error Handling**: Try-catch blocks with proper error messages
✅ **Type Safety**: PropTypes definitions (can be upgraded to TypeScript)
✅ **Accessibility**: Semantic HTML and ARIA labels

## Browser Support

- **Chrome/Chromium**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions
- **Mobile Browsers**: iOS Safari 13+, Chrome Android 90+

## Development Guide

### Project Scripts

```bash
# Development
npm run dev          # Start dev server with HMR

# Building
npm run build        # Create optimized production build
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint on all files
npm run lint --fix   # Fix linting issues automatically
```

### Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test**
   ```bash
   npm run dev
   npm run lint
   ```

3. **Build and verify**
   ```bash
   npm run build
   npm run preview
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: description of changes"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request** on GitHub

### Adding New Features

1. **Create component file** in appropriate directory
2. **Add styles** as separate `.css` file (component-scoped)
3. **Import and use** in parent components
4. **Add API calls** in `services/api.js` if needed
5. **Update routes** in `routes.jsx` if new page
6. **Test** with `npm run dev`
7. **Lint** with `npm run lint`

### API Service Usage

```javascript
// In components
import { userAPI, detectionAPI } from '../services/api';

// Making API calls
const handleLogin = async (credentials) => {
  try {
    const response = await authAPI.login(credentials);
    localStorage.setItem('token', response.data.token);
    // Handle success
  } catch (error) {
    console.error('Login failed:', error);
    // Handle error
  }
};
```

### Using Hooks for State Management

```javascript
// Function component with hooks
const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data on mount
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await someAPI.fetchData();
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // JSX here
  );
};
```

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 5173
# Windows PowerShell
Get-Process node | Stop-Process -Force
```

**Dependencies conflict**
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

**API connection error**
- Check backend is running on configured URL
- Verify `VITE_API_URL` in `.env` or `constants.js`
- Check CORS settings on backend

**Google Maps not loading**
- Verify API key is valid and enabled
- Check quota limits on Google Cloud Console
- Ensure API key has Maps JavaScript API enabled

**Build fails**
```bash
# Clear cache and rebuild
npm cache clean --force
npm run build
```

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Update README if adding new features
- Test thoroughly before submitting PR
- Ensure ESLint passes with no errors

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support & Contact

For support and inquiries:

- **Email**: support@potholedetection.com
- **Phone**: +91 8009 054294
- **Website**: https://potholedetection.com
- **GitHub Issues**: Report bugs and request features
- **Documentation**: See Wiki for detailed guides

## Project Team

Built with passion by the Pothole Detection Team

## Acknowledgments

- **React Team** - Excellent React library and ecosystem
- **Vite Team** - Fast build tool and great DX
- **React Bootstrap** - Bootstrap components for React
- **Recharts** - Powerful charting library
- **Google Maps API** - Mapping capabilities
- **FontAwesome & Lucide** - Icon libraries
- **Community** - For feedback and contributions

## Version History

### v1.0.0 (Current)
- Initial release with full feature set
- User authentication and authorization
- Admin panel with user management
- Real-time detection dashboard
- Live detection interface
- Session management
- Report generation
- Interactive mapping

---

**Built with ❤️ for safer roads**

For the latest updates, visit: [GitHub Repository](https://github.com/your-org/pothole-detection-frontend)
