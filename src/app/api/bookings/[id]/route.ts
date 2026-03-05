import { NextRequest, NextResponse } from 'next/server';
import { hasDatabase, listBookingsForUser, updateBookingStatus } from '@/lib/db';
import { requireApiUser } from '@/lib/auth/api';
import type { BookingStatus } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { user, error } = await requireApiUser(request);

  if (!user) {
    return error;
  }

  if (!hasDatabase) {
    return NextResponse.json({ success: false, error: 'Database is not configured.' }, { status: 503 });
  }

  try {
    const bookings = await listBookingsForUser(user.id, user.role);
    const booking = bookings.find((item) => item.id === params.id);

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to load booking.' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { user, error } = await requireApiUser(request);

  if (!user) {
    return error;
  }

  if (!hasDatabase) {
    return NextResponse.json({ success: false, error: 'Database is not configured.' }, { status: 503 });
  }

  try {
    const body = (await request.json()) as { booking_status?: BookingStatus };

    if (!body.booking_status) {
      return NextResponse.json({ success: false, error: 'booking_status is required.' }, { status: 400 });
    }

    const booking = await updateBookingStatus(params.id, user.id, user.role, body.booking_status);

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (errorCaught) {
    if (errorCaught instanceof Error && errorCaught.message === 'Forbidden') {
      return NextResponse.json({ success: false, error: 'Forbidden.' }, { status: 403 });
    }

    return NextResponse.json({ success: false, error: 'Failed to update booking.' }, { status: 500 });
  }
}
