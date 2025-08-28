import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // First try to find a user
    let user = await db.user.findUnique({ 
      where: { email },
      include: { defaultVendor: true }  // Include vendor data for users
    });
    let isAgency = false;

    // If no user found, try to find an agency
    if (!user) {
      const agency = await db.agency.findUnique({ 
        where: { email },
        include: {
          defaultUsers: true,  // Include linked users
          bookings: {
            take: 1,  // Just to verify relations work
            include: {
              user: true
            }
          }
        }
      });
      if (agency) {
        user = agency;
        isAgency = true;
      }
    }

    if (!user) {
      console.log('No user or agency found for email:', email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    const role = isAgency ? 'AGENCY' : (user.role || 'USER')

    // Only create log entry for regular users
    if (!isAgency) {
      await db.log.create({
        data: {
          userId: user.id,
          action: 'LOGIN',
          details: `User with email ${email} logged in as ${role}`
        }
      });
    }

    // Return user or agency data (excluding password)
    const { password: _, ...entityWithoutPassword } = user

    // Add additional agency-specific validation
    if (isAgency && !entityWithoutPassword.isVerified) {
      return NextResponse.json(
        { error: 'Agency account is not verified yet' },
        { status: 403 }
      )
    }

    if (isAgency && !entityWithoutPassword.isActive) {
      return NextResponse.json(
        { error: 'Agency account is currently inactive' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      message: 'Login successful',
      user: { ...entityWithoutPassword, role }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}