import { NextResponse } from 'next/server'
import { barrelResetService } from '@/lib/barrel-reset'

export async function POST(request) {
  try {
    const { adminId } = await request.json()

    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      )
    }

    await barrelResetService.manualBarrelReset(adminId)

    return NextResponse.json({
      message: 'Barrel reset completed successfully'
    })

  } catch (error) {
    console.error('Manual barrel reset error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const stats = await barrelResetService.getBarrelResetStats()
    const isResetNeeded = await barrelResetService.isBarrelResetNeeded()

    return NextResponse.json({
      stats,
      isResetNeeded
    })

  } catch (error) {
    console.error('Barrel reset stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}