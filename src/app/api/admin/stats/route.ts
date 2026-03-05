import { NextRequest, NextResponse } from 'next/server';
import { getAdminDashboardStats, hasDatabase } from '@/lib/db';
import { requireApiUser } from '@/lib/auth/api';

export async function GET(request: NextRequest) {
  const { user, error } = await requireApiUser(request, ['admin']);

  if (!user) {
    return error;
  }

  if (!hasDatabase) {
    return NextResponse.json(
      { success: false, error: 'Database is not configured.' },
      { status: 503 },
    );
  }

  try {
    const stats = await getAdminDashboardStats();
    return NextResponse.json({ success: true, stats });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to load admin stats.' }, { status: 500 });
  }
}
