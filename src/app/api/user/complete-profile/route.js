// API response types
/**
 * @typedef {Object} ProfileUpdateResponse
 * @property {string} message - Success/error message
 * @property {Object} user - Updated user data
 */

/**
 * @typedef {Object} ProfileData
 * @property {string} userId - User's unique identifier
 * @property {string} phoneNumber - Primary contact number
 * @property {string} [dateOfBirth] - User's date of birth
 * @property {string} [aadharNumber] - 12-digit Aadhar number
 * @property {string} address - Full residential address
 * @property {string} city - City of residence
 * @property {string} state - State of residence
 * @property {string} pincode - 6-digit postal code
 */

import { NextResponse } from "next/server"
import { db } from "@/lib/db"

/**
 * Update user profile information
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<NextResponse<ProfileUpdateResponse>>} The HTTP response
 */
export async function PUT(request) {
  console.log("PUT request received to /api/user/complete-profile");
  
  try {
    // Parse request data
    const data = await request.json()
    
    // Log incoming data for debugging
    console.log("Incoming profile data:", data);
    
    const { 
      userId, 
      phoneNumber, 
      dateOfBirth, 
      aadharNumber, 
      address, 
      city, 
      state, 
      pincode
    } = data

    // Validate required fields
    if (!userId || !phoneNumber || !address || !city || !state || !pincode) {
      console.log("Missing required fields:", { userId, phoneNumber, address, city, state, pincode });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate phone number format (10 digits)
    if (!/^\d{10}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid phone number format. Please enter 10 digits." },
        { status: 400 }
      )
    }

    // Validate pincode format (6 digits)
    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { error: "Invalid pincode format. Please enter 6 digits." },
        { status: 400 }
      )
    }

    // Validate Aadhar number if provided (12 digits)
    if (aadharNumber && !/^\d{12}$/.test(aadharNumber)) {
      return NextResponse.json(
        { error: "Invalid Aadhar number format. Please enter 12 digits." },
        { status: 400 }
      )
    }

    try {
      // Check if user exists
      const existingUser = await db.user.findUnique({
        where: { id: userId }
      })

      if (!existingUser) {
        console.log("User not found:", userId);
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        )
      }

      // Parse and validate date if provided
      let parsedDateOfBirth = null;
      if (dateOfBirth) {
        const date = new Date(dateOfBirth);
        if (!isNaN(date.getTime())) {
          parsedDateOfBirth = date;
        } else {
          console.log("Invalid date format:", dateOfBirth);
          return NextResponse.json(
            { error: "Invalid date format" },
            { status: 400 }
          )
        }
      }

      // Log current user data
      const currentUser = await db.user.findUnique({
        where: { id: userId }
      });
      console.log("Current user data:", currentUser);
      
      // Check database connection
      await db.$queryRaw`SELECT 1`;
      console.log("Database connection successful");

      // Prepare update data
      const updateData = {
        phoneNumber,
        dateOfBirth: parsedDateOfBirth,
        aadharNumber: aadharNumber || null,
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode,
        updatedAt: new Date()
      };

      console.log("Attempting to update user with data:", {
        userId,
        ...updateData
      });

      // Update user profile with explicit error handling
      const updatedUser = await db.user.update({
        where: { 
          id: userId,
          // Add a condition to ensure we're updating the right user
          AND: {
            isActive: true
          }
        },
        data: updateData,
        // Select specific fields to return
        select: {
          id: true,
          email: true,
          name: true,
          phoneNumber: true,
          dateOfBirth: true,
          aadharNumber: true,
          address: true,
          city: true,
          state: true,
          pincode: true,
          updatedAt: true,
          isActive: true,
          barrelsRemaining: true
        }
      });
      
      console.log("Successfully updated user:", updatedUser);

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;

      console.log("Profile updated successfully:", userWithoutPassword);

      return NextResponse.json({
        message: "Profile updated successfully",
        user: userWithoutPassword
      });

    } catch (dbError) {
      console.log("Database error caught in outer catch block");
      
      // Log the specific database error
      console.error("Database update error:", {
        error: dbError,
        code: dbError.code,
        meta: dbError.meta,
        message: dbError.message,
        stack: dbError.stack
      });

      // Handle specific database errors
      if (dbError.code === 'P2002') {
        return NextResponse.json(
          { error: "Aadhar number already registered with another user" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Failed to update profile in database. Please try again." },
        { status: 500 }
      );
    }

  } catch (error) {
    console.log("Outer catch block triggered");
    console.error("Complete profile error:", {
      error: error,
      message: error.message,
      stack: error.stack
    });

    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
