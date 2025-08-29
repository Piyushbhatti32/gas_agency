import { NextResponse } from "next/server"
import { db as prisma } from "@/lib/db"

export async function POST(req, { params }) {
  try {
    const { userId } = params

    // Reset user's barrel count
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
        role: "USER", // Ensure we can only reset regular users' barrels
      },
      data: {
        barrelsRemaining: 0 // Reset to default value
      }
    })

    return NextResponse.json({
      message: "Barrel count reset successfully",
      user: updatedUser
    })

  } catch (error) {
    console.error("Error resetting barrel count:", error)
    return NextResponse.json(
      { error: "Failed to reset barrel count" },
      { status: 500 }
    )
  }
}
