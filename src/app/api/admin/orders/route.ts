import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (isAuthError(session)) return session;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status') || undefined;
  const search = searchParams.get('search') || undefined;

  const where = {
    ...(status ? { status: status as 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'EXPIRED' } : {}),
    ...(search ? {
      OR: [
        { customerEmail: { contains: search, mode: 'insensitive' as const } },
        { customerName: { contains: search, mode: 'insensitive' as const } },
        { orderId: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {}),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        product: { select: { slug: true, name: true } },
        user: { select: { id: true, tier: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({ success: true, orders, total, page, limit });
}
