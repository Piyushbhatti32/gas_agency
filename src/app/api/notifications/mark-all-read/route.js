import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400 }
      )
    }

    // Get all active notifications
    const notifications = await db.notification.findMany({
      where: {
        isActive: true,
        OR: [
          { userId: null },
          { userId: userId }
        ]
      }
    })

    // Mark all as read
    for (const notification of notifications) {
      await db.notificationReadStatus.upsert({
        where: {
          userId_notificationId: {
            userId: userId,
            notificationId: notification.id
          }
        },
        create: {
          userId: user.id,
          notificationId: notification.id
        },
        update: {}
      })
    }

    return new NextResponse(
      JSON.stringify({ message: "All notifications marked as read" }),
      { status: 200 }
    )
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error)
    return new NextResponse(
      JSON.stringify({ error: "Failed to mark all notifications as read" }),
      { status: 500 }
    )
  }
}
