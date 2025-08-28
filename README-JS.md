# Gas Agency System - JavaScript Version

A complete gas cylinder booking system built with Next.js, JavaScript, and Prisma.

## Features

- **User Authentication**: Register and login functionality
- **Gas Cylinder Booking**: Book cylinders with multiple payment options
- **Admin Dashboard**: Manage bookings, users, and system settings
- **Real-time Notifications**: Stay updated with booking status
- **Payment Integration**: Support for Cash on Delivery and Paytm QR
- **Barrel Management**: Track annual cylinder limits (12 per year)
- **Booking History**: View past and current bookings
- **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API routes, Socket.IO
- **Database**: SQLite with Prisma ORM
- **Authentication**: Custom JWT-based auth
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npm run db:push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema
- `npm run db:generate` - Generate Prisma client

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── admin/          # Admin dashboard
│   ├── dashboard/      # User dashboard
│   ├── history/        # Booking history
│   └── page.js         # Home page (login/register)
├── components/
│   └── ui/            # shadcn/ui components
├── hooks/             # Custom React hooks
└── lib/               # Utility libraries
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Bookings
- `POST /api/booking/create` - Create new booking
- `GET /api/booking/user` - Get user bookings
- `GET /api/booking/history` - Get booking history

### Admin
- `GET /api/admin/bookings` - Get all bookings
- `POST /api/admin/booking/approve` - Approve booking
- `POST /api/admin/booking/reject` - Reject booking
- `POST /api/admin/booking/deliver` - Mark as delivered
- `GET /api/admin/users` - Get all users
- `POST /api/admin/barrel-reset` - Reset barrel counts

### Other
- `GET /api/notifications` - Get system notifications
- `POST /api/init-admin` - Initialize admin user

## Database Schema

The application uses the following main entities:

- **Users**: Store user information and authentication
- **Bookings**: Manage gas cylinder bookings
- **Notifications**: System-wide notifications
- **Logs**: Activity logging

## Features in Detail

### User Features
- **Registration**: Create account with email and password
- **Login**: Secure authentication with session management
- **Dashboard**: View current bookings and account status
- **Booking**: Book cylinders with payment method selection
- **History**: View all past and current bookings
- **Barrel Tracking**: Monitor remaining annual cylinder allowance

### Admin Features
- **Dashboard**: Overview of all system activity
- **Booking Management**: Approve, reject, and deliver bookings
- **User Management**: View and manage all users
- **Barrel Reset**: Annual reset of cylinder counts
- **Notifications**: Create system-wide announcements
- **Scheduling**: Set delivery dates and times

### Payment Options
- **Cash on Delivery (COD)**: Pay when cylinder is delivered
- **Paytm QR**: Scan QR code for instant payment

## Security Features

- Password hashing with bcrypt
- Input validation and sanitization
- SQL injection prevention with Prisma ORM
- Session-based authentication
- Role-based access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.