import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { name, email, password, phoneNumber, address, city, state, pincode, dateOfBirth, aadharNumber } = await request.json()

    // Validate required fields
    if (!name || !email || !password || !phoneNumber || !address || !city || !state || !pincode || !dateOfBirth) {
      return NextResponse.json(
        { error: "All fields except Aadhar Number are required" },
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

    // Validate phone number
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Phone number must be 10 digits" },
        { status: 400 }
      )
    }

    // Validate pincode
    if (!/^[0-9]{6}$/.test(pincode)) {
      return NextResponse.json(
        { error: "Pincode must be 6 digits" },
        { status: 400 }
      )
    }

    // Validate Aadhar number
    if (aadharNumber && !/^[0-9]{12}$/.test(aadharNumber)) {
      return NextResponse.json(
        { error: "Aadhar number must be 12 digits" },
        { status: 400 }
      )
    }

    // Check if user is at least 18 years old
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (age < 18 || (age === 18 && monthDiff < 0) || (age === 18 && monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return NextResponse.json(
        { error: "You must be at least 18 years old to register" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        address,
        city,
        state,
        pincode,
        dateOfBirth: new Date(dateOfBirth),
        aadharNumber: aadharNumber || null
      }
    })

    // Log the registration
    await prisma.log.create({
      data: {
        action: "USER_REGISTRATION",
        details: `User ${name} registered with email ${email}`
      }
    })

    return NextResponse.json(
      { 
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: "USER"
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("User registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
