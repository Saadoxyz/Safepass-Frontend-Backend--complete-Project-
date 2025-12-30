# SafePass - Secure Visitor & Access Management System

![SafePass](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

## 🎯 Project Overview

**SafePass** is a comprehensive, enterprise-grade visitor and access management system designed to streamline the visitor check-in process while maintaining the highest security standards. The system provides real-time dashboards for hosts and security personnel, automated gate pass generation with QR codes, and complete audit trails for compliance.

### Key Objectives
- **Simplify visitor check-in** with an intuitive, self-service registration process
- **Enhance security** through pre-authorization and access control
- **Provide real-time visibility** with live dashboards for hosts and security teams
- **Maintain compliance** with comprehensive logging and reporting features
- **Streamline operations** with automated gate pass management

---

## ✨ Core Features

### 👥 Visitor Registration
- Self-service visitor pre-registration portal
- Intuitive form-based registration process
- Host notification and approval workflow
- Email confirmation and updates

### 🎫 Gate Pass Management
- Automatic QR code generation for each gate pass
- Digital and printable pass options
- Pass validation at entry/exit points
- Real-time pass status tracking

### 📊 Dashboards
- **Host Dashboard**: Approve/reject visits, manage visitors, view visit history
- **Security Dashboard**: Monitor real-time access, verify QR codes, manage check-ins
- **Admin Dashboard**: User management, settings, system configuration
- **Reports Dashboard**: Generate comprehensive audit logs and analytics

### 🔐 Security Features
- JWT-based authentication
- Role-based access control (RBAC)
- Secure password hashing
- QR code verification
- Complete audit logging

### 📈 Reporting & Analytics
- Comprehensive visit logs
- Access history by visitor, host, or date range
- Security audit trails
- Operational insights and statistics

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14+ (React)
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React Icons
- **State Management**: React Context API
- **Features**: 
  - SSR/SSG with Next.js
  - Responsive design
  - Real-time notifications
  - QR code generation

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Class Validator, Class Transformer
- **Email Service**: Email notification system
- **WebSocket**: Real-time communication via Socket.io
- **File Upload**: Multer for profile uploads

### Database
- **Primary DB**: MongoDB
- **Schema Design**:
  - **Users**: Admin, Host, Security personnel accounts
  - **Visitors**: Visitor information and registration
  - **GatePasses**: Digital passes with QR codes
  - **Visits**: Check-in/check-out logs
  - **Departments**: Organization structure
  - **Notifications**: Real-time notifications
  - **Settings**: System configuration

### DevOps & Tools
- **Version Control**: Git
- **Build Tool**: npm/yarn
- **Testing**: Jest
- **Linting**: ESLint
- **Package Manager**: npm

---

## 📁 Project Structure

```
safepass-project/
├── backend/                          # NestJS Backend Application
│   ├── src/
│   │   ├── app.controller.ts        # Main app controller
│   │   ├── app.service.ts           # Main app service
│   │   ├── app.module.ts            # Root module
│   │   ├── main.ts                  # Application entry point
│   │   │
│   │   ├── common/                  # Shared utilities
│   │   │   ├── decorators/          # Custom decorators (@Roles, etc)
│   │   │   ├── guards/              # Auth and role guards
│   │   │   └── interfaces/          # TypeScript interfaces
│   │   │
│   │   ├── config/                  # Configuration files
│   │   │   └── database.config.ts   # MongoDB configuration
│   │   │
│   │   ├── modules/                 # Feature modules
│   │   │   ├── auth/                # Authentication (JWT, Login, Register)
│   │   │   ├── users/               # User management
│   │   │   ├── visitors/            # Visitor management
│   │   │   ├── gate-passes/         # Gate pass generation & management
│   │   │   ├── departments/         # Department management
│   │   │   ├── email/               # Email service
│   │   │   ├── settings/            # System settings
│   │   │   ├── notifications/       # Real-time notifications via WebSocket
│   │   │   ├── reports/             # Reporting & analytics
│   │   │   ├── upload/              # File upload handling
│   │   │   └── websocket/           # WebSocket configuration
│   │   │
│   │   ├── migrations/              # Database migrations
│   │   ├── seed/                    # Database seeding
│   │   └── types/                   # TypeScript type definitions
│   │
│   ├── test/                        # E2E tests
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
├── frontend/                         # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                     # Next.js app directory
│   │   │   ├── layout.js            # Root layout
│   │   │   ├── page.js              # Home page
│   │   │   ├── globals.css          # Global styles
│   │   │   ├── about/               # About page
│   │   │   ├── contact/             # Contact page
│   │   │   ├── login/               # Login page
│   │   │   ├── register/            # Registration page
│   │   │   ├── admin/               # Admin dashboard
│   │   │   ├── host/                # Host dashboard
│   │   │   ├── security/            # Security dashboard
│   │   │   ├── visitor/             # Visitor dashboard
│   │   │   ├── gate-pass/           # Gate pass pages
│   │   │   └── forgot-password/     # Password reset
│   │   │
│   │   ├── components/              # Reusable React components
│   │   │   ├── Navbar.js           # Navigation bar
│   │   │   ├── Sidebar.js          # Sidebar navigation
│   │   │   ├── ProtectedRoute.js   # Route protection
│   │   │   ├── ProfileUpload.js    # Profile image upload
│   │   │   └── QRCodeGenerator.js  # QR code component
│   │   │
│   │   ├── contexts/                # React Context providers
│   │   │   ├── AuthContext.js       # Authentication state
│   │   │   └── ProfileContext.js    # Profile state
│   │   │
│   │   ├── Services/                # API service layer
│   │   │   ├── authService.js       # Auth API calls
│   │   │   ├── userService.js       # User API calls
│   │   │   ├── visitorService.js    # Visitor API calls
│   │   │   ├── gatePassService.js   # Gate pass API calls
│   │   │   ├── reportService.js     # Report API calls
│   │   │   ├── settingsService.js   # Settings API calls
│   │   │   └── uploadService.js     # File upload API calls
│   │   │
│   │   ├── lib/                     # Utility functions
│   │   │   ├── api.js               # API client setup
│   │   │   └── utils.js             # Helper functions
│   │   │
│   │   └── utils/                   # Custom utilities
│   │       └── roleRedirect.js      # Role-based routing
│   │
│   ├── public/                      # Static assets
│   ├── package.json
│   ├── next.config.mjs
│   ├── tailwind.config.js
│   └── jsconfig.json
│
└── package.json                     # Root package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v16.0.0 or higher
- **npm** or **yarn**: Package manager
- **MongoDB**: v4.4+ (Local or Cloud - MongoDB Atlas)
- **Git**: Version control

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the `backend` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/safepass
   
   # JWT
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRATION=7d
   
   # Email Service
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   
   # Server
   PORT=3001
   NODE_ENV=development
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

4. **Run database migrations**
   ```bash
   npm run typeorm migration:run
   ```

5. **Seed database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the backend server**
   ```bash
   npm run start:dev
   ```
   The API will be available at `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_APP_NAME=SafePass
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

### Database Setup

**Using MongoDB Locally:**
```bash
mongod
```

**Using MongoDB Atlas (Cloud):**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to `.env` as `MONGODB_URI`

---

## 📖 Available Scripts

### Backend Scripts
```bash
# Development mode with hot reload
npm run start:dev

# Production build
npm run build

# Start production server
npm run start:prod

# Run tests
npm run test

# Run end-to-end tests
npm run test:e2e

# Lint code
npm run lint

# Run database migrations
npm run typeorm migration:run

# Seed database
npm run seed
```

### Frontend Scripts
```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Run tests
npm run test
```

---

## 🔌 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/refresh           - Refresh JWT token
POST   /api/auth/logout            - Logout user
```

### User Endpoints
```
GET    /api/users                  - Get all users
GET    /api/users/:id              - Get user by ID
POST   /api/users                  - Create new user
PUT    /api/users/:id              - Update user
DELETE /api/users/:id              - Delete user
```

### Visitor Endpoints
```
GET    /api/visitors               - Get all visitors
GET    /api/visitors/:id           - Get visitor by ID
POST   /api/visitors               - Register new visitor
PUT    /api/visitors/:id           - Update visitor
DELETE /api/visitors/:id           - Delete visitor
GET    /api/visitors/status/:id    - Get visitor status
```

### Gate Pass Endpoints
```
GET    /api/gate-passes            - Get all gate passes
GET    /api/gate-passes/:id        - Get gate pass by ID
POST   /api/gate-passes            - Generate new gate pass
PUT    /api/gate-passes/:id        - Update gate pass
DELETE /api/gate-passes/:id        - Delete gate pass
POST   /api/gate-passes/verify/:qr - Verify QR code
```

### Reports Endpoints
```
GET    /api/reports/visits         - Get visit reports
GET    /api/reports/access-logs    - Get access logs
GET    /api/reports/statistics     - Get statistics
```

For complete API documentation, see the Backend API Docs section or use Swagger (if integrated).

---

## 🗄️ Database Schema

### Collections Overview

**Users Collection**
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: String (ADMIN, HOST, SECURITY, VISITOR),
  department: ObjectId (ref: Department),
  profileImage: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Visitors Collection**
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  company: String,
  purpose: String,
  hostId: ObjectId (ref: User),
  departmentId: ObjectId (ref: Department),
  visaStatus: String,
  licenseNumber: String,
  expectedCheckIn: Date,
  expectedCheckOut: Date,
  status: String (REGISTERED, APPROVED, REJECTED, VISITED),
  createdAt: Date,
  updatedAt: Date
}
```

**GatePasses Collection**
```javascript
{
  _id: ObjectId,
  visitorId: ObjectId (ref: Visitor),
  passNumber: String (unique),
  qrCode: String,
  status: String (ACTIVE, USED, EXPIRED, REVOKED),
  issuedAt: Date,
  expiresAt: Date,
  checkedInAt: Date,
  checkedOutAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Visits Collection**
```javascript
{
  _id: ObjectId,
  visitorId: ObjectId (ref: Visitor),
  gatePassId: ObjectId (ref: GatePass),
  hostId: ObjectId (ref: User),
  departmentId: ObjectId (ref: Department),
  checkInTime: Date,
  checkOutTime: Date,
  location: String,
  purpose: String,
  securityNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Departments Collection**
```javascript
{
  _id: ObjectId,
  name: String (unique),
  description: String,
  location: String,
  hostIds: [ObjectId] (ref: User),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Authentication & Authorization

### User Roles
- **ADMIN**: Full system access, user management, system settings
- **HOST**: Can approve visits, manage their visitors
- **SECURITY**: Can verify gate passes, monitor access
- **VISITOR**: Can register, view their visits and passes

### JWT Token Structure
```javascript
{
  iss: 'SafePass',
  sub: userId,
  role: userRole,
  email: userEmail,
  iat: issuedAt,
  exp: expirationTime
}
```

### Protected Routes
- All API endpoints require valid JWT token in `Authorization` header
- Format: `Authorization: Bearer <token>`
- Role-based access enforced via guards

---

## 📊 WebSocket Events

Real-time notifications are powered by Socket.io:

### Client Events
```javascript
// Connection
socket.on('connect', () => {})

// Visitor Notifications
socket.on('visitorRegistered', (data) => {})
socket.on('gatePassGenerated', (data) => {})
socket.on('visitorCheckedIn', (data) => {})
socket.on('visitorCheckedOut', (data) => {})

// Host Notifications
socket.on('approvalRequired', (data) => {})
socket.on('visitApproved', (data) => {})
socket.on('visitRejected', (data) => {})

// Security Notifications
socket.on('suspiciousActivity', (data) => {})
socket.on('accessDenied', (data) => {})
```

---

## 🧪 Testing

### Backend Testing
```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Testing
```bash
# Run tests
npm run test

# Test with coverage
npm run test:coverage
```

---

## 📝 Development Guidelines

### Code Style
- **Backend**: Follow NestJS conventions, use TypeScript strict mode
- **Frontend**: Follow React best practices, use functional components
- **Database**: Follow MongoDB schema design best practices

### Commit Convention
```
type(scope): subject

body

footer
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(auth): add email verification

Add email verification on user registration
with confirmation link sent to registered email.

Closes #123
```

### Branch Naming
- `feature/feature-name`
- `bugfix/bug-name`
- `hotfix/issue-name`
- `release/version-number`

---

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas, whitelist your IP address

**JWT Token Invalid**
- Ensure `JWT_SECRET` is set in `.env`
- Check token expiration
- Verify token is being sent in `Authorization` header

**CORS Issues**
- Verify `FRONTEND_URL` in backend `.env`
- Ensure frontend is making requests to correct API URL
- Check CORS configuration in `app.module.ts`

**Port Already in Use**
- Change `PORT` in `.env` (default: 3001 for backend, 3000 for frontend)
- Or kill existing process on that port

---

## 📦 Deployment

### Backend Deployment (Heroku/Railway)
```bash
# Build
npm run build

# Set environment variables in platform
# Deploy
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy to Vercel
vercel deploy --prod
```

### Database Deployment
- Use MongoDB Atlas for managed cloud database
- Configure connection string in production `.env`

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support & Contact

For support, email support@safepass.com or open an issue in the repository.

### Project Maintainers
- **Frontend Lead**: [Your Name]
- **Backend Lead**: [Your Name]
- **DevOps/Infrastructure**: [Your Name]

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Backend framework
- [Next.js](https://nextjs.org/) - Frontend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Icon library

---

## 📊 Project Statistics

- **Total Commits**: 136+
- **Lines of Code**: 15,000+
- **Test Coverage**: 80%+
- **Active Contributors**: 3+

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Active Development

---

## 🔗 Quick Links

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [API Documentation](./DOCS.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)

---

**Made with ❤️ by the SafePass Team**
