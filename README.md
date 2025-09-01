# Gas Agency Management System

A modern, responsive web application for managing gas cylinder bookings, agencies, and user interactions. Built with Next.js, Prisma, and TailwindCSS.

![Gas Agency System](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)
![Prisma](https://img.shields.io/badge/Prisma-6.11.1-2D3748?style=for-the-badge&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

### 👥 For Users
- 📱 **User Registration & Profile Management** - Complete user onboarding with profile completion
- 🛒 **Gas Cylinder Booking** - Multiple payment options:
  - 💰 Cash on Delivery (COD)
  - 💳 Online Payment (Razorpay)
  - 📱 Paytm QR
- 📊 **Booking Tracking** - Real-time status updates and delivery tracking
- 🔔 **Smart Notifications** - Real-time notifications for booking updates
- 📋 **Booking History** - Complete history with remaining barrel quota
- 📱 **Responsive Design** - Works perfectly on all devices

### 🏢 For Agencies
- 🏢 **Agency Registration** - Complete agency onboarding process
- 📦 **Inventory Management** - Track cylinder deliveries and stock
- 👥 **Customer Management** - Manage customer bookings and history
- 📊 **Business Analytics** - Comprehensive dashboard with insights
- 🔄 **Status Management** - Update booking statuses in real-time

### 👨‍💼 For Administrators
- 👥 **User Management** - Block/unblock users, reset barrels, delete accounts
- 🏢 **Agency Oversight** - Manage and monitor all agencies
- 📢 **Notification System** - Send system-wide notifications
- 📈 **Analytics Dashboard** - System-wide analytics and monitoring
- ⚙️ **Configuration Management** - System settings and preferences

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TailwindCSS 4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Framer Motion** - Smooth animations and transitions

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Robust relational database
- **JWT Authentication** - Secure token-based auth

### Development Tools
- **ESLint** - Code linting and formatting
- **Jest** - Unit and integration testing
- **TypeScript** - Type safety (optional)
- **Husky** - Git hooks for code quality

## 📦 Installation

### Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Package managers
- **PostgreSQL** - Database server
- **Git** - Version control

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gas_agency.git
   cd gas_agency
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/gas_agency"
   
   # JWT Secret
   JWT_SECRET="your-super-secret-jwt-key"
   
   # Razorpay (for payments)
   RAZORPAY_KEY_ID="your-razorpay-key-id"
   RAZORPAY_KEY_SECRET="your-razorpay-secret"
   
   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NODE_ENV="development"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # Seed the database (optional)
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
gas_agency/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard and features
│   │   ├── agency/            # Agency dashboard and features
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── admin/         # Admin management endpoints
│   │   │   ├── agency/        # Agency management endpoints
│   │   │   ├── booking/       # Booking management endpoints
│   │   │   ├── notifications/ # Notification endpoints
│   │   │   ├── payment/       # Payment processing endpoints
│   │   │   └── user/          # User management endpoints
│   │   ├── complete-profile/  # User profile completion
│   │   ├── dashboard/         # User dashboard
│   │   ├── history/           # Booking history
│   │   └── layout.js          # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── LoadingSpinner.jsx # Loading components
│   │   └── Navigation.jsx    # Main navigation
│   ├── hooks/                # Custom React hooks
│   │   ├── useApi.js         # API call hook
│   │   └── useLocalStorage.js # Local storage hook
│   └── lib/                  # Utilities and configurations
│       ├── constants.js      # Application constants
│       ├── db.js            # Prisma client
│       ├── errorHandler.js  # Error handling system
│       ├── utils.js         # Utility functions
│       └── razorpay.js      # Payment integration
├── prisma/                   # Database schema and migrations
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── public/                  # Static assets
├── tests/                   # Test files
├── .env.example            # Environment variables template
├── .eslintrc.js           # ESLint configuration
├── jest.config.js         # Jest configuration
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # TailwindCSS configuration
└── README.md              # This file
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes
npm run db:reset     # Reset database

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Linting
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors

# Type checking
npm run type-check   # Check TypeScript types
```

## 🌐 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/complete-profile` - Update user profile
- `GET /api/user/bookings` - Get user bookings
- `POST /api/user/bookings` - Create new booking

### Agency Management
- `GET /api/agency/profile` - Get agency profile
- `PUT /api/agency/profile` - Update agency profile
- `GET /api/agency/bookings` - Get agency bookings
- `PUT /api/agency/bookings/:id/status` - Update booking status

### Admin Management
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/block` - Block/unblock user
- `GET /api/admin/agencies` - Get all agencies
- `POST /api/admin/notifications` - Send notification

### Payment Processing
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/history` - Get payment history

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository**
   - Push your code to GitHub
   - Connect your repository to Vercel

2. **Configure environment variables**
   - Add all environment variables in Vercel dashboard
   - Set `NODE_ENV=production`

3. **Deploy**
   ```bash
   npm run build
   ```

### Netlify

1. **Build settings**
   ```bash
   Build command: npm run build
   Publish directory: .next
   ```

2. **Environment variables**
   - Add all environment variables in Netlify dashboard

### Docker

1. **Build the image**
   ```bash
   docker build -t gas-agency .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 gas-agency
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🔒 Security Considerations

- 🔐 **JWT Authentication** - Secure token-based authentication
- 🔒 **Input Validation** - Comprehensive validation on all endpoints
- 🛡️ **SQL Injection Protection** - Prisma ORM prevents SQL injection
- 🔐 **Password Hashing** - bcrypt for secure password storage
- 📝 **API Logging** - Comprehensive request/response logging
- 🚫 **Rate Limiting** - Protection against brute force attacks
- 🔒 **Environment Variables** - Secure configuration management
- 🔐 **HTTPS Only** - Force HTTPS in production

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=user.test.js
```

### Test Structure
```
tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
├── e2e/              # End-to-end tests
└── fixtures/         # Test data
```

## 📊 Performance Optimization

- ⚡ **Code Splitting** - Automatic code splitting with Next.js
- 🖼️ **Image Optimization** - Next.js Image component
- 📦 **Bundle Analysis** - Analyze bundle size
- 🗄️ **Database Optimization** - Indexed queries and efficient schemas
- 🚀 **Caching** - Redis caching for frequently accessed data
- 📱 **PWA Support** - Progressive Web App capabilities

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Create a Pull Request**

### Development Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation
- Ensure all tests pass
- Follow conventional commits

## 📝 License

This project is proprietary and confidential. All rights reserved.

## 🆘 Support

### Getting Help
- 📧 **Email**: support@gasagency.com
- 📞 **Phone**: +1-800-GAS-HELP
- 💬 **Live Chat**: Available on the website

### Documentation
- 📚 **API Docs**: `/api/docs`
- 🎥 **Video Tutorials**: Available in the help section
- 📖 **User Guide**: Comprehensive user documentation

### Bug Reports
Please report bugs using the GitHub issue tracker with:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information

## 🏆 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Prisma Team** - For the excellent ORM
- **TailwindCSS Team** - For the utility-first CSS framework
- **shadcn/ui** - For the beautiful UI components
- **All Contributors** - For their valuable contributions

---

**Made with ❤️ by the Gas Agency Team**
