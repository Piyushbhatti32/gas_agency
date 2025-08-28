import { db } from "@/lib/db";
import bcryptjs from "bcryptjs";

export async function POST(req) {
  try {
    console.log('Starting database reset...');
    // Clear existing data first
    await db.notification.deleteMany();
    await db.booking.deleteMany();
    await db.payment.deleteMany();
    await db.user.deleteMany();
    await db.agency.deleteMany();

    // Create admin user
    console.log('Data cleared, creating admin...');
    const admin = await db.user.create({
      data: {
        email: "admin@test.com",
        name: "Admin User",
        password: await bcryptjs.hash("admin123", 10),
        role: "ADMIN",
        phoneNumber: "1234567890",
        address: "Admin Address",
        city: "Admin City",
        state: "Admin State",
        pincode: "123456",
      },
    });

    // Create agency
    const agency = await db.agency.create({
      data: {
        email: "agency@test.com",
        name: "Agency Owner",
        password: await bcryptjs.hash("agency123", 10),
        businessName: "Test Gas Agency",
        businessAddress: "123 Gas Street",
        city: "Agency City",
        state: "Agency State",
        pincode: "234567",
        contactNumber: "9876543210",
        licenseNumber: "LIC123456",
        gstNumber: "GST123456",
        panNumber: "PAN123456",
        cylinderPrice: 900.0,
        deliveryRadius: 15,
        minOrderAmount: 900.0,
        deliveryCharges: 50.0,
        workingHours: "9:00 AM - 7:00 PM",
        establishedYear: 2020,
        description: "Test gas agency for development",
        isVerified: true,
      },
    });

    // Create regular users
    const user1 = await db.user.create({
      data: {
        email: "user1@test.com",
        name: "Test User 1",
        password: await bcryptjs.hash("user123", 10),
        role: "USER",
        phoneNumber: "8765432109",
        address: "User1 Home Address",
        city: "User City",
        state: "User State",
        pincode: "345678",
        barrelsRemaining: 12,
        defaultVendorId: agency.id,
      },
    });

    const user2 = await db.user.create({
      data: {
        email: "user2@test.com",
        name: "Test User 2",
        password: await bcryptjs.hash("user123", 10),
        role: "USER",
        phoneNumber: "8765432110",
        address: "User2 Home Address",
        city: "User City",
        state: "User State",
        pincode: "345678",
        barrelsRemaining: 8,
        defaultVendorId: agency.id,
      },
    });

    // Create some sample bookings
    const booking1 = await db.booking.create({
      data: {
        userId: user1.id,
        agencyId: agency.id,
        status: "APPROVED",
        paymentMethod: "COD",
        paymentStatus: "COMPLETED",
        amount: 950.0,
        approvedAt: new Date(),
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        deliveryAddress: user1.address,
        contactNumber: user1.phoneNumber,
        notes: "Regular cylinder booking",
      },
    });

    const booking2 = await db.booking.create({
      data: {
        userId: user2.id,
        agencyId: agency.id,
        status: "PENDING",
        paymentMethod: "ONLINE",
        paymentStatus: "PENDING",
        amount: 950.0,
        deliveryAddress: user2.address,
        contactNumber: user2.phoneNumber,
        notes: "Urgent delivery needed",
        isExtra: true,
      },
    });

    // Create some sample notifications
    await db.notification.create({
      data: {
        title: "Welcome to Gas Agency",
        message: "Thank you for registering with our gas agency system.",
        isActive: true,
        userId: user1.id,
      },
    });

    await db.notification.create({
      data: {
        title: "Booking Confirmation",
        message: "Your cylinder booking has been confirmed.",
        isActive: true,
        userId: user1.id,
      },
    });

    return Response.json({
      message: "Test accounts and sample data created successfully",
      accounts: {
        admin: { email: admin.email, password: "admin123" },
        agency: { email: agency.email, password: "agency123" },
        users: [
          { email: user1.email, password: "user123" },
          { email: user2.email, password: "user123" },
        ],
      },
    });
  } catch (error) {
    console.error("Error creating test accounts:", error);
    return Response.json(
      { error: "Failed to create test accounts", details: error.message },
      { status: 500 }
    );
  }
}
