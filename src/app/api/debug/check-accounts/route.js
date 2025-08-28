import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request) {
    try {
        // Get all users
        const users = await db.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                name: true,
                isActive: true,
            }
        });

        // Get all agencies
        const agencies = await db.agency.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                businessName: true,
                isActive: true,
                isVerified: true,
            }
        });

        return Response.json({
            users,
            agencies,
            message: 'Database check complete'
        });
    } catch (error) {
        console.error('Error checking database:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
