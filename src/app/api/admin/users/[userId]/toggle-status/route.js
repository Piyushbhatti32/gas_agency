import { NextResponse } from "next/server"
import { db as prisma } from "@/lib/db"

export async function POST(req, { params }) {
  try {
    const { userId } = params
    const { isBlocked } = await req.json()

    // Update user's blocked status
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
        role: "USER", // Ensure we can only block regular users
      },
      data: {
        isBlocked
      }
    })

    return NextResponse.json({
      message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
      user: updatedUser
    })

  } catch (error) {
    console.error("Error updating user status:", error)
    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 }
    )
  }
}
