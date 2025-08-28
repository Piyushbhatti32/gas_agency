import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await db.user.findUnique({
      where: {
        email: 'admin@test.com',
        role: 'ADMIN'
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Remove sensitive data
    const { password, ...adminData } = user;

    return NextResponse.json({ user: adminData });
  } catch (error) {
    console.error('Failed to fetch admin profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
