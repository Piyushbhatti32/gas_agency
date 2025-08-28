import { db } from '@/lib/db'

export async function GET(request) {
    try {
        const users = await db.user.findMany();
        const agencies = await db.agency.findMany();
        
        return Response.json({
            users: users.map(u => ({
                id: u.id,
                email: u.email,
                role: u.role,
                name: u.name
            })),
            agencies: agencies.map(a => ({
                id: a.id,
                email: a.email,
                name: a.name,
                isActive: a.isActive,
                isVerified: a.isVerified
            }))
        });
    } catch (error) {
        console.error('Database check error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
