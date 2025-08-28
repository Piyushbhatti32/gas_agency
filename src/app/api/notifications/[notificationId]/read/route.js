import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request, { params }) {
  try {
    const notificationId = params.notificationId
    const { userId } = await request.json()
    
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400 }
      )
    }

    // Create or find notification read status
    await db.notificationReadStatus.upsert({
      where: {
        userId_notificationId: {
          userId: user.id,
          notificationId: notificationId
        }
      },
      create: {
        userId: userId,
        notificationId: notificationId
      },
      update: {}
    })

    return new NextResponse(
      JSON.stringify({ message: "Notification marked as read" }),
      { status: 200 }
    )
  } catch (error) {
    console.error("Failed to mark notification as read:", error)
    return new NextResponse(
      JSON.stringify({ error: "Failed to mark notification as read" }),
      { status: 500 }
    )
  }
}
