import { NextRequest, NextResponse } from 'next/server';
import { hasDatabase, listBookingsForAdmin } from '@/lib/db';
import { requireApiUser } from '@/lib/auth/api';

export async function GET(request: NextRequest) {
  const { user, error } = await requireApiUser(request, ['admin']);

  if (!user) {
    return error;
  }

  if (!hasDatabase) {
    return NextResponse.json({ success: true, bookings: [] });
  }

  try {
    const bookings = await listBookingsForAdmin();
    return NextResponse.json({ success: true, bookings });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to load bookings.' }, { status: 500 });
  }
}
