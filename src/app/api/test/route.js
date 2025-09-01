import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Test database connection
    await db.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      message: "API is working",
      timestamp: new Date().toISOString(),
      database: "connected"
    });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json({
      error: "Database connection failed",
      message: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    return NextResponse.json({
      message: "POST request received",
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Test POST API error:", error);
    return NextResponse.json({
      error: "Failed to parse request",
      message: error.message
    }, { status: 400 });
  }
}
