import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request) {
  try {
    // Get userId from query parameter
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400 }
      )
    }

    console.log("Fetching notifications for userId:", userId);
    
    // Check database connection
    await db.$queryRaw`SELECT 1`;
    console.log("Database connection successful");

    // Get active notifications for the user
    const notifications = await db.notification.findMany({
      where: {
        isActive: true,
        OR: [
          // Global notifications
          { userId: null },
          // User-specific notifications
          { userId: userId }
        ]
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        userReadStatus: {
          where: {
            userId: userId
          }
        }
      }
    });
    
    console.log("Found notifications:", notifications.length);

    // Transform notifications to include read status
    const transformedNotifications = notifications.map(notification => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      createdAt: notification.createdAt,
      isRead: notification.userReadStatus.length > 0
    }))

    return new NextResponse(
      JSON.stringify({ notifications: transformedNotifications }),
      { status: 200 }
    )
  } catch (error) {
    console.error("Failed to fetch notifications:", error)
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch notifications" }),
      { status: 500 }
    )
  }
}
