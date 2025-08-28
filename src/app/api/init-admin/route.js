import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Check if admin already exists
    const existingAdmin = await db.user.findFirst({
      where: { 
        email,
        role: 'ADMIN'
      }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin user already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create admin user
    const admin = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        barrelsRemaining: 999 // Admins get unlimited barrels
      }
    })

    // Log the admin creation
    await db.log.create({
      data: {
        userId: admin.id,
        action: 'ADMIN_CREATE',
        details: `Admin user ${admin.email} created`
      }
    })

    // Return admin data (excluding password)
    const { password: _, ...adminWithoutPassword } = admin

    return NextResponse.json({
      message: 'Admin user created successfully',
      admin: adminWithoutPassword
    })

  } catch (error) {
    console.error('Admin creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}