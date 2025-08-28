# Gas Agency Management System

A modern web application for managing gas cylinder bookings, agencies, and user interactions. Built with Next.js and Prisma.

## Features

### For Users
- 📱 User registration and profile management
- 🛒 Book gas cylinders with multiple payment options
  - Cash on Delivery (COD)
  - Online Payment (Razorpay)
  - Paytm QR
- 📊 Track cylinder bookings and delivery status
- 🔔 Real-time notifications for booking updates
- 📋 View booking history and remaining barrel quota

### For Agencies
- � Agency registration and profile management
- � Manage cylinder deliveries and inventory
- � Track customer bookings and history
- � Dashboard with business analytics
- � Booking status management

### For Administrators
- � User management (block/unblock, reset barrels, delete)
- 🏢 Agency management and oversight
- 📢 Send notifications to users
- � System-wide analytics and monitoring
- 🔧 Configuration management

## Tech Stack

- **Frontend**: Next.js App Router, React, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (easily upgradable to PostgreSQL/MySQL)
- **Authentication**: Custom JWT-based auth
- **Payment**: Razorpay integration
- **UI Components**: 
  - Dialog
  - ScrollArea
  - Tabs
  - Cards
  - Forms
  - Notifications
  - And more...

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gas_agency.git
cd gas_agency
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Set up the database:
```bash
npx prisma migrate deploy
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

### Environment Variables

Required environment variables in `.env`:

```env
# Database
DATABASE_URL="file:./custom.db"

# JWT
JWT_SECRET=your-jwt-secret

# Razorpay (for payments)
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret

# Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard and features
│   ├── agency/            # Agency dashboard and features
│   ├── api/               # API routes
│   └── user/              # User pages
├── components/            # React components
│   ├── ui/               # UI components
│   └── Navigation.jsx    # Main navigation
├── hooks/                # Custom React hooks
└── lib/                  # Utilities and configurations
    ├── db.js            # Prisma client
    ├── email.js         # Email utilities
    └── razorpay.js      # Payment integration
```

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/admin/*` - Admin management endpoints
- `/api/agency/*` - Agency management endpoints
- `/api/booking/*` - Booking management endpoints
- `/api/notifications/*` - Notification endpoints
- `/api/payment/*` - Payment processing endpoints
- `/api/user/*` - User management endpoints

## Production Deployment

1. Build the application:
```bash
npm run build
# or
yarn build
```

2. Start the production server:
```bash
npm start
# or
yarn start
```

## Security Considerations

- 🔒 All sensitive routes are protected with authentication
- �️ Input validation on all endpoints
- 🔐 Secure password hashing with bcrypt
- 📝 Comprehensive API logging
- 🚫 Rate limiting on sensitive endpoints
- 🔒 Protected environment variables

## Database Migrations

Run migrations in development:
```bash
npx prisma migrate dev
```

Apply migrations in production:
```bash
npx prisma migrate deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary and confidential. All rights reserved.

## Support

For support, please contact your system administrator.
