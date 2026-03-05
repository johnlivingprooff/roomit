import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSubscription, hasDatabase, upsertSubscription } from '@/lib/db';
import { requireApiUser } from '@/lib/auth/api';
import type { SubscriptionTier } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { user, error } = await requireApiUser(request);

  if (!user) {
    return error;
  }

  if (!hasDatabase) {
    return NextResponse.json({ success: true, subscription: null });
  }

  try {
    const subscription = await getCurrentSubscription(user.id);
    return NextResponse.json({ success: true, subscription });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to load subscription.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireApiUser(request);

  if (!user) {
    return error;
  }

  if (!hasDatabase) {
    return NextResponse.json(
      { success: false, error: 'Subscription changes require a configured database.' },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as { tier?: SubscriptionTier };
    const tier = body.tier === 'premium' ? 'premium' : 'basic';
    const subscription = await upsertSubscription(user.id, tier);
    return NextResponse.json({ success: true, subscription }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update subscription.' }, { status: 500 });
  }
}
