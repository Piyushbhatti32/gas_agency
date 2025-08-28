import { db } from '@/lib/db'

export async function GET(request) {
  try {
    // Find agency
    const agency = await db.agency.findUnique({
      where: { email: 'agency@test.com' }
    })

    if (!agency) {
      return Response.json(
        { error: 'Agency not found' },
        { status: 404 }
      )
    }

    // Return agency data (excluding password)
    const { password: _, ...agencyWithoutPassword } = agency
    return Response.json(agencyWithoutPassword)

  } catch (error) {
    console.error('Error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
