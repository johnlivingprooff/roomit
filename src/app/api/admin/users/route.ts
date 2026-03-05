import { NextRequest, NextResponse } from 'next/server';
import { getUserById, hasDatabase, listUsersForAdmin } from '@/lib/db';
import { requireApiUser } from '@/lib/auth/api';

export async function GET(request: NextRequest) {
  const { user, error } = await requireApiUser(request, ['admin']);

  if (!user) {
    return error;
  }

  if (!hasDatabase) {
    return NextResponse.json({ success: true, users: [] });
  }

  try {
    const users = await listUsersForAdmin();
    return NextResponse.json({ success: true, users });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to load users.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { user, error } = await requireApiUser(request, ['admin']);

  if (!user) {
    return error;
  }

  if (!hasDatabase) {
    return NextResponse.json({ success: false, error: 'Database is not configured.' }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { userId?: string };

    if (!body.userId) {
      return NextResponse.json({ success: false, error: 'userId is required.' }, { status: 400 });
    }

    const target = await getUserById(body.userId);

    if (!target) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: target.id,
        phone: target.phone,
        name: target.name,
        role: target.role,
        verified_status: target.verified_status,
      },
      message: 'User lookup completed. No destructive mutations are exposed here.',
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to process user request.' }, { status: 500 });
  }
}
