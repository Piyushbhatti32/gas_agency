import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function DELETE(req, { params }) {
  try {
    const { userId } = params

    // First, check if the user exists and is a regular user
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    if (user.role !== "USER") {
      return NextResponse.json(
        { error: "Can only delete regular user accounts" },
        { status: 403 }
      )
    }

    // Delete all related data in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete user's bookings
      await tx.booking.deleteMany({
        where: {
          userId: userId
        }
      })

      // Delete user's notifications
      await tx.notification.deleteMany({
        where: {
          userId: userId
        }
      })

      // Finally, delete the user
      await tx.user.delete({
        where: {
          id: userId
        }
      })
    })

    return NextResponse.json({
      message: "User account deleted successfully"
    })

  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Failed to delete user account" },
      { status: 500 }
    )
  }
}
