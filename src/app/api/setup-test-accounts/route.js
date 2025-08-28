import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Helper function to hash password
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function POST(request) {
  try {
    // First, clear existing test accounts and related data
    await db.booking.deleteMany({
      where: {
        OR: [
          { user: { email: { in: ['admin@test.com', 'user@test.com'] } } },
          { agency: { email: 'agency@test.com' } }
        ]
      }
    });
    
    await db.log.deleteMany({
      where: {
        user: { 
          email: { 
            in: ['admin@test.com', 'user@test.com'] 
          } 
        }
      }
    });
    
    await db.user.deleteMany({
      where: {
        email: {
          in: ['admin@test.com', 'user@test.com']
        }
      }
    });
    
    await db.agency.deleteMany({
      where: {
        email: 'agency@test.com'
      }
    });

    // Create admin user
    const adminPassword = await hashPassword('admin123');
    const admin = await db.user.create({
      data: {
        email: 'admin@test.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'ADMIN',
        phoneNumber: '1234567890',
        address: 'Admin Address',
        city: 'Admin City',
        state: 'Admin State',
        pincode: '123456',
        isActive: true,
        barrelsRemaining: 12
      }
    });

    // Create agency
    const agencyPassword = await hashPassword('agency123');
    const agency = await db.agency.create({
      data: {
        email: 'agency@test.com',
        name: 'Agency Owner',
        password: agencyPassword,
        businessName: 'Test Gas Agency',
        businessAddress: '123 Gas Street',
        city: 'Agency City',
        state: 'Agency State',
        pincode: '234567',
        contactNumber: '9876543210',
        licenseNumber: 'LIC123456',
        cylinderPrice: 900.0,
        deliveryRadius: 15,
        minOrderAmount: 900.0,
        deliveryCharges: 50.0,
        workingHours: '9:00 AM - 7:00 PM',
        establishedYear: 2020,
        description: 'Test gas agency for development',
        isVerified: true,
        isActive: true
      }
    });

    // Create regular user with link to agency
    const userPassword = await hashPassword('user123');
    const user = await db.user.create({
      data: {
        email: 'user@test.com',
        name: 'Test User',
        password: userPassword,
        role: 'USER',
        phoneNumber: '8765432109',
        address: 'User Home Address',
        city: 'User City',
        state: 'User State',
        pincode: '345678',
        barrelsRemaining: 12,
        defaultVendorId: agency.id,
        isActive: true
      }
    });

    // Create a test booking to ensure relationships work
    const booking = await db.booking.create({
      data: {
        userId: user.id,
        agencyId: agency.id,
        status: 'PENDING',
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        amount: 900.0,
        deliveryAddress: user.address,
        contactNumber: user.phoneNumber,
        notes: 'Test booking'
      }
    });

    return Response.json({
      success: true,
      message: 'Test accounts created successfully',
      accounts: {
        admin: { email: admin.email, password: 'admin123', id: admin.id },
        agency: { email: agency.email, password: 'agency123', id: agency.id },
        user: { email: user.email, password: 'user123', id: user.id }
      },
      testBooking: booking.id
    });
  } catch (error) {
    console.error('Error creating test accounts:', error);
    return Response.json(
      {
        error: 'Failed to create test accounts',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
