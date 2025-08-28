import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { 
      name, email, password, businessName, businessAddress, city, state, pincode,
      contactNumber, alternateNumber, gstNumber, licenseNumber, panNumber, 
      cylinderPrice, deliveryRadius, deliveryCharges, workingHours, 
      establishedYear, description 
    } = await request.json()

    // Validate required fields
    if (!name || !email || !password || !businessName || !businessAddress || !city || !state || !pincode || !contactNumber || !licenseNumber || !cylinderPrice) {
      return NextResponse.json(
        { error: "Required fields: name, email, password, businessName, businessAddress, city, state, pincode, contactNumber, licenseNumber, cylinderPrice" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // Validate cylinder price
    if (cylinderPrice < 100 || cylinderPrice > 2000) {
      return NextResponse.json(
        { error: "Cylinder price must be between ₹100 and ₹2000" },
        { status: 400 }
      )
    }

    // Check if agency email already exists
    const existingAgency = await prisma.agency.findUnique({
      where: { email }
    })

    if (existingAgency) {
      return NextResponse.json(
        { error: "Agency with this email already exists" },
        { status: 400 }
      )
    }

    // Check if user email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create agency
    const agency = await prisma.agency.create({
      data: {
        name,
        email,
        password: hashedPassword,
        businessName,
        businessAddress,
        city,
        state,
        pincode,
        contactNumber,
        alternateNumber: alternateNumber || null,
        gstNumber: gstNumber || null,
        licenseNumber,
        panNumber: panNumber || null,
        cylinderPrice: parseFloat(cylinderPrice),
        deliveryRadius: parseInt(deliveryRadius) || 10,
        deliveryCharges: parseFloat(deliveryCharges) || 0.0,
        workingHours: workingHours || "9:00 AM - 6:00 PM",
        establishedYear: establishedYear || null,
        description: description || null
      }
    })

    // Log the registration
    await prisma.log.create({
      data: {
        action: "AGENCY_REGISTRATION",
        details: `Agency ${businessName} registered with email ${email}`
      }
    })

    return NextResponse.json(
      { 
        message: "Agency registered successfully",
        agency: {
          id: agency.id,
          name: agency.name,
          email: agency.email,
          businessName: agency.businessName,
          role: "AGENCY"
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Agency registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
