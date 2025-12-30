# SafePass - Visitor & Gate Pass Management System

A modern, full-featured visitor and gate pass management system built with Next.js. SafePass provides a comprehensive solution for organizations to manage visitor access, gate passes, and security through an intuitive web interface.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Authentication & Authorization](#authentication--authorization)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

## Features

- **User Authentication**: Secure login, registration, and password recovery
- **Role-Based Access Control**: Admin, Host, and Visitor roles with different permissions
- **Gate Pass Management**: Create, approve, and manage visitor gate passes
- **Visitor Management**: Track and manage visitor information and access history
- **Department Management**: Organize hosts and departments within the organization
- **QR Code Generation**: Generate QR codes for gate passes for easy verification
- **Real-time Notifications**: WebSocket-based notifications for gate pass updates
- **Reports**: Generate comprehensive access and visitor reports
- **User Profiles**: Manage user profiles with image uploads
- **Responsive Design**: Mobile-friendly interface using TailwindCSS

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React-based framework)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **State Management**: React Context API
- **HTTP Client**: Custom API service wrapper
- **Code Quality**: ESLint
- **Authentication**: JWT-based (managed by backend)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v16.0.0 or higher
- **npm** or **yarn**: Package manager
- **Backend Server**: SafePass backend API running (default: http://localhost:3001)

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd safepass-project/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

## Configuration

Create a `.env.local` file in the frontend directory with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=SafePass
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `SafePass` |

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000). The page auto-updates as you edit files.

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── layout.js             # Root layout
│   ├── page.js               # Home page
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   ├── admin/                # Admin dashboard
│   ├── host/                 # Host dashboard
│   ├── visitor/              # Visitor dashboard
│   ├── gate-pass/            # Gate pass management
│   ├── about/                # About page
│   └── ...other pages
├── components/               # Reusable React components
│   ├── Navbar.js             # Navigation bar
│   ├── Sidebar.js            # Sidebar navigation
│   ├── ProfileUpload.js       # Profile image upload
│   ├── QRCodeGenerator.js     # QR code generation
│   ├── ProtectedRoute.js      # Role-based route protection
│   └── ...other components
├── contexts/                 # React Context providers
│   ├── AuthContext.js         # Authentication context
│   └── ProfileContext.js      # User profile context
├── Services/                 # API service wrappers
│   ├── authService.js         # Authentication API calls
│   ├── gatePassService.js     # Gate pass API calls
│   ├── visitorService.js      # Visitor API calls
│   ├── dashboardService.js    # Dashboard data API calls
│   └── ...other services
├── lib/                      # Utility libraries
│   ├── api.js                # Axios API instance
│   └── utils.js              # Helper utilities
└── styles/                   # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Authentication & Authorization

SafePass implements JWT-based authentication with role-based access control:

### User Roles

1. **Admin**: Full system access, user management, reports
2. **Host**: Manage gate passes, view visitor information
3. **Visitor**: View own gate passes and information

### Protected Routes

The application uses `ProtectedRoute.js` component to restrict access based on user roles. Route protection is configured per page and checks user authentication status and role.

### Auth Flow

1. User logs in with credentials
2. Backend returns JWT token
3. Token stored in localStorage
4. Requests include Authorization header with token
5. Automatic logout on token expiration

## Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

The application will be optimized and ready for deployment.

## Troubleshooting

### Connection Errors
- Ensure the backend API is running on the configured `NEXT_PUBLIC_API_URL`
- Check network connectivity and firewall settings
- Verify `.env.local` configuration

### Authentication Issues
- Clear browser localStorage and cookies
- Verify JWT token validity
- Check backend authentication service

### Styling Issues
- Run `npm install` to ensure TailwindCSS dependencies are installed
- Clear `.next` build cache: `rm -rf .next`
- Rebuild the application

### Port Already in Use
```bash
# Change port
npm run dev -- -p 3001
```

## Contributing

When adding new features:

1. Create feature branches from `main`
2. Follow existing code structure and naming conventions
3. Test thoroughly before submitting pull requests
4. Update documentation as needed

## License

SafePass - Visitor & Gate Pass Management System

---

**For Backend Documentation**: See [backend README](../backend/README.md)
