import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PUT(request) {
  try {
    const data = await request.json()
    const { 
      userId, 
      phoneNumber, 
      alternateNumber, 
      dateOfBirth, 
      aadharNumber, 
      address, 
      city, 
      state, 
      pincode, 
      landmark 
    } = data

    // Validate required fields
    if (!userId || !phoneNumber || !address || !city || !state || !pincode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        phoneNumber,
        alternateNumber: alternateNumber || null,
        dateOfBirth: dateOfBirth || null,
        aadharNumber: aadharNumber || null,
        address,
        city,
        state,
        pincode,
        landmark: landmark || null,
        updatedAt: new Date()
      }
    })

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      message: "Profile updated successfully",
      user: userWithoutPassword
    })

  } catch (error) {
    console.error("Complete profile error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
