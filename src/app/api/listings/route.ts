import { NextRequest, NextResponse } from 'next/server';
import {
  createListing,
  hasDatabase,
  listActiveListings,
  listListingsForHost,
  type ListingInput,
} from '@/lib/db';
import { getAuthenticatedApiUser, requireApiUser } from '@/lib/auth/api';

function parseNumber(value: unknown) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    return Number(value);
  }

  return undefined;
}

export async function GET(request: NextRequest) {
  if (!hasDatabase) {
    return NextResponse.json({ success: true, listings: [] });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const mineOnly = searchParams.get('mine') === 'true';

    if (mineOnly) {
      const { user } = await getAuthenticatedApiUser(request);

      if (!user || !['host', 'admin'].includes(user.role)) {
        return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
      }

      const listings = await listListingsForHost(user.id);
      return NextResponse.json({ success: true, listings });
    }

    const listings = await listActiveListings({
      q: searchParams.get('q') || undefined,
      city: searchParams.get('city') || undefined,
      type: (searchParams.get('type') as ListingInput['type'] | null) ?? undefined,
      minPrice: parseNumber(searchParams.get('minPrice')),
      maxPrice: parseNumber(searchParams.get('maxPrice')),
      furnished:
        searchParams.get('furnished') === null
          ? undefined
          : searchParams.get('furnished') === 'true',
    });

    return NextResponse.json({ success: true, listings });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to load listings.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireApiUser(request, ['host', 'admin']);

  if (!user) {
    return error;
  }

  if (!hasDatabase) {
    return NextResponse.json(
      { success: false, error: 'Listing creation requires a configured database.' },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as Partial<ListingInput>;

    if (!body.type || !body.title || !body.area || !body.city) {
      return NextResponse.json(
        { success: false, error: 'Missing required listing fields.' },
        { status: 400 },
      );
    }

    const listing = await createListing(user.id, {
      type: body.type,
      title: body.title,
      description: body.description ?? '',
      area: body.area,
      city: body.city,
      country: body.country ?? 'Malawi',
      price_daily: Number(body.price_daily ?? 0),
      price_weekly: Number(body.price_weekly ?? 0),
      price_monthly: Number(body.price_monthly ?? 0),
      deposit_suggested: Number(body.deposit_suggested ?? 0),
      amenities: body.amenities ?? {
        electricity: 'partial',
        water: 'limited',
        wifi: false,
        furnished: false,
        shared_bathroom: false,
      },
      house_rules: body.house_rules,
      photos: body.photos ?? [],
    });

    return NextResponse.json({ success: true, listing }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create listing.' },
      { status: 500 },
    );
  }
}
