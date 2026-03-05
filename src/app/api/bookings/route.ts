import { NextRequest, NextResponse } from 'next/server';
import { createBooking, hasDatabase, listBookingsForUser, type BookingInput } from '@/lib/db';
import { requireApiUser } from '@/lib/auth/api';

export async function GET(request: NextRequest) {
  const { user, error } = await requireApiUser(request);

  if (!user) {
    return error;
  }

  if (!hasDatabase) {
    return NextResponse.json({ success: true, bookings: [] });
  }

  try {
    const bookings = await listBookingsForUser(user.id, user.role);
    return NextResponse.json({ success: true, bookings });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to load bookings.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireApiUser(request, ['renter', 'admin']);

  if (!user) {
    return error;
  }

  if (!hasDatabase) {
    return NextResponse.json(
      { success: false, error: 'Booking creation requires a configured database.' },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as Partial<BookingInput>;

    if (!body.listingId || !body.duration || !body.startDate || !body.endDate) {
      return NextResponse.json({ success: false, error: 'Missing required booking fields.' }, { status: 400 });
    }

    const booking = await createBooking(user.id, {
      listingId: body.listingId,
      duration: body.duration,
      startDate: body.startDate,
      endDate: body.endDate,
      totalPrice: Number(body.totalPrice ?? 0),
      depositPaid: Number(body.depositPaid ?? 0),
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create booking.' }, { status: 500 });
  }
}
