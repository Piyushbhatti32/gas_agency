import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    // Clean up existing test accounts
    await db.$transaction([
      db.booking.deleteMany({
        where: {
          OR: [
            { user: { email: { in: ['admin@test.com', 'user@test.com'] } } },
            { agency: { email: 'agency@test.com' } }
          ]
        }
      }),
      db.log.deleteMany({
        where: {
          user: { email: { in: ['admin@test.com', 'user@test.com'] } }
        }
      }),
      db.user.deleteMany({
        where: {
          email: { in: ['admin@test.com', 'user@test.com'] }
        }
      }),
      db.agency.deleteMany({
        where: {
          email: 'agency@test.com'
        }
      })
    ]);

    // Create agency first
    const agency = await db.agency.create({
      data: {
        email: 'agency@test.com',
        name: 'Agency Owner',
        password: await bcrypt.hash('agency123', 10),
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

    // Create admin user
    const admin = await db.user.create({
      data: {
        email: 'admin@test.com',
        name: 'Admin User',
        password: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
        phoneNumber: '1234567890',
        address: 'Admin Address',
        city: 'Admin City',
        state: 'Admin State',
        pincode: '123456',
        barrelsRemaining: 12,
        isActive: true
      }
    });

    // Create regular user
    const user = await db.user.create({
      data: {
        email: 'user@test.com',
        name: 'Test User',
        password: await bcrypt.hash('user123', 10),
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

    // Create a test booking to verify relationships
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
      data: {
        admin: { email: admin.email, password: 'admin123', id: admin.id },
        agency: { email: agency.email, password: 'agency123', id: agency.id },
        user: { email: user.email, password: 'user123', id: user.id, defaultAgency: agency.id },
        testBooking: booking.id
      }
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
