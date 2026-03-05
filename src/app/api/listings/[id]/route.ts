import { NextRequest, NextResponse } from 'next/server';
import {
  getListingById,
  hasDatabase,
  softDeleteListing,
  updateListing,
  type ListingInput,
} from '@/lib/db';
import { requireApiUser } from '@/lib/auth/api';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!hasDatabase) {
    return NextResponse.json({ success: false, error: 'Database is not configured.' }, { status: 503 });
  }

  try {
    const listing = await getListingById(params.id);

    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, listing });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to load listing.' }, { status: 500 });
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
    const body = (await request.json()) as Partial<ListingInput> & {
      status?: 'draft' | 'active' | 'flagged' | 'removed';
      verification_status?: 'pending' | 'approved' | 'rejected';
    };
    const listing = await updateListing(params.id, user.id, user.role, body);

    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, listing });
  } catch (errorCaught) {
    if (errorCaught instanceof Error && errorCaught.message === 'Forbidden') {
      return NextResponse.json({ success: false, error: 'Forbidden.' }, { status: 403 });
    }

    return NextResponse.json({ success: false, error: 'Failed to update listing.' }, { status: 500 });
  }
}

export async function DELETE(
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
    const listing = await softDeleteListing(params.id, user.id, user.role);

    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, listing });
  } catch (errorCaught) {
    if (errorCaught instanceof Error && errorCaught.message === 'Forbidden') {
      return NextResponse.json({ success: false, error: 'Forbidden.' }, { status: 403 });
    }

    return NextResponse.json({ success: false, error: 'Failed to remove listing.' }, { status: 500 });
  }
}
