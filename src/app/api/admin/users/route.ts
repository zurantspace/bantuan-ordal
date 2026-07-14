import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (isAuthError(session)) return session;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const tier = searchParams.get('tier') || undefined;
  const search = searchParams.get('search') || undefined;

  const where = {
    role: 'MEMBER' as const,
    ...(tier ? { tier } : {}),
    ...(search ? {
      OR: [
        { email: { contains: search, mode: 'insensitive' as const } },
        { name: { contains: search, mode: 'insensitive' as const } },
        { phone: { contains: search } },
      ],
    } : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, name: true, email: true, phone: true, tier: true,
        isActive: true, createdAt: true, lastLoginAt: true,
        affiliate: { select: { referralCode: true, status: true } },
        watchProgress: {
          select: { episodeId: true, progressPct: true, completed: true },
        },
        _count: { select: { orders: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ success: true, users, total, page, limit });
}
