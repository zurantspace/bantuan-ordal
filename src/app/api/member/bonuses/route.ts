import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (isAuthError(session)) return session;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { tier: true },
  });
  const tier = user?.tier || 'standard';

  const bonuses = await prisma.bonusResource.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });

  return NextResponse.json({
    success: true,
    bonuses: bonuses.map((b) => ({
      ...b,
      isLocked: b.tier === 'premium' && tier !== 'premium',
    })),
  });
}
