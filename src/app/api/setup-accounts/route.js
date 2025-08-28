import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

export async function POST() {
    try {
        // Clean up existing data first
        await db.$transaction([
            db.booking.deleteMany({}),
            db.log.deleteMany({}),
            db.user.deleteMany({}),
            db.agency.deleteMany({})
        ]);

        console.log('Creating agency...');
        const agency = await db.agency.create({
            data: {
                email: 'agency@test.com',
                name: 'Agency Owner',
                password: await hashPassword('agency123'),
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
        console.log('Agency created:', agency.id);

        console.log('Creating admin...');
        const admin = await db.user.create({
            data: {
                email: 'admin@test.com',
                name: 'Admin User',
                password: await hashPassword('admin123'),
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
        console.log('Admin created:', admin.id);

        console.log('Creating user...');
        const user = await db.user.create({
            data: {
                email: 'user@test.com',
                name: 'Test User',
                password: await hashPassword('user123'),
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
        console.log('User created:', user.id);

        console.log('Creating test booking...');
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
        console.log('Booking created:', booking.id);

        // Verify the data
        const verifyAgency = await db.agency.findUnique({
            where: { id: agency.id },
            include: {
                defaultUsers: true,
                bookings: {
                    include: { user: true }
                }
            }
        });

        return Response.json({
            success: true,
            message: 'Test accounts created successfully',
            data: {
                admin: { id: admin.id, email: admin.email },
                agency: { 
                    id: agency.id, 
                    email: agency.email,
                    defaultUsers: verifyAgency.defaultUsers.length,
                    bookings: verifyAgency.bookings.length
                },
                user: { 
                    id: user.id, 
                    email: user.email,
                    defaultVendorId: user.defaultVendorId
                }
            }
        });

    } catch (error) {
        console.error('Failed to create test accounts:', error);
        return Response.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
