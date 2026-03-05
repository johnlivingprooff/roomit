import { NextRequest, NextResponse } from 'next/server';
import { hasDatabase, listListingsForAdmin, updateListing } from '@/lib/db';
import { requireApiUser } from '@/lib/auth/api';

export async function GET(request: NextRequest) {
  const { user, error } = await requireApiUser(request, ['admin']);

  if (!user) {
    return error;
  }

  if (!hasDatabase) {
    return NextResponse.json({ success: true, listings: [] });
  }

  try {
    const listings = await listListingsForAdmin();
    return NextResponse.json({ success: true, listings });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to load listings.' }, { status: 500 });
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
    const body = (await request.json()) as {
      listingId?: string;
      status?: 'draft' | 'active' | 'flagged' | 'removed';
      verification_status?: 'pending' | 'approved' | 'rejected';
    };

    if (!body.listingId) {
      return NextResponse.json({ success: false, error: 'listingId is required.' }, { status: 400 });
    }

    const listing = await updateListing(body.listingId, user.id, user.role, {
      status: body.status,
      verification_status: body.verification_status,
    });

    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, listing });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update listing.' }, { status: 500 });
  }
}
