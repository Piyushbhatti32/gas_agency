import { db } from '@/lib/db';

export async function GET(request) {
    try {
        const agency = await db.agency.findUnique({
            where: { email: 'agency@test.com' },
            include: {
                defaultUsers: true,
                bookings: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!agency) {
            return Response.json({ error: 'Agency not found' }, { status: 404 });
        }

        // Remove sensitive data
        const { password, ...safeAgencyData } = agency;

        return Response.json({
            success: true,
            agency: safeAgencyData
        });
    } catch (error) {
        console.error('Error fetching agency:', error);
        return Response.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
