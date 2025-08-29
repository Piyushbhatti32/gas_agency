import { db as prisma } from "@/lib/db";
import { hash } from "bcryptjs";

export async function POST(req) {
  try {
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: "admin@test.com",
        name: "Admin User",
        password: await hash("admin123", 10),
        role: "ADMIN",
        phoneNumber: "1234567890",
        address: "Admin Address",
        city: "Admin City",
        state: "Admin State",
        pincode: "123456",
      },
    });

    // Create agency
    const agency = await prisma.agency.create({
      data: {
        email: "agency@test.com",
        name: "Agency Owner",
        password: await hash("agency123", 10),
        businessName: "Test Gas Agency",
        businessAddress: "123 Gas Street",
        city: "Agency City",
        state: "Agency State",
        pincode: "234567",
        contactNumber: "9876543210",
        licenseNumber: "LIC123456",
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

    // Create regular user
    const user = await prisma.user.create({
      data: {
        email: "user@test.com",
        name: "Test User",
        password: await hash("user123", 10),
        role: "USER",
        phoneNumber: "8765432109",
        address: "User Home Address",
        city: "User City",
        state: "User State",
        pincode: "345678",
        barrelsRemaining: 12,
        defaultVendorId: agency.id, // Link to created agency
      },
    });

    return Response.json({
      message: "Test accounts created successfully",
      accounts: {
        admin: { email: admin.email, password: "admin123" },
        agency: { email: agency.email, password: "agency123" },
        user: { email: user.email, password: "user123" },
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
