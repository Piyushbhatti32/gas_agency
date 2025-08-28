import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get active notifications
    const notifications = await db.notification.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      notifications
    })

  } catch (error) {
    console.error('Notifications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { title, message, adminId } = await request.json()

    if (!title || !message || !adminId) {
      return NextResponse.json(
        { error: 'Title, message, and admin ID are required' },
        { status: 400 }
      )
    }

    // Create notification
    const notification = await db.notification.create({
      data: {
        title,
        message,
        isActive: true
      }
    })

    // Log the notification creation
    await db.log.create({
      data: {
        userId: adminId,
        action: 'NOTIFICATION_CREATE',
        details: `Admin created notification: ${title}`
      }
    })

    return NextResponse.json({
      message: 'Notification created successfully',
      notification
    })

  } catch (error) {
    console.error('Notification creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}