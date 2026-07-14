import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (isAuthError(session)) return session;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  // Abandoned = PENDING orders that have abandonedAt set
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: {
        status: 'PENDING',
        abandonedAt: { not: null, lte: thirtyMinutesAgo },
      },
      orderBy: { abandonedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true, orderId: true, customerName: true, customerEmail: true,
        customerPhone: true, hasOrderBump: true, amount: true,
        abandonedAt: true, followupSent: true, createdAt: true,
        utmSource: true, affiliateCode: true,
      },
    }),
    prisma.order.count({
      where: { status: 'PENDING', abandonedAt: { not: null, lte: thirtyMinutesAgo } },
    }),
  ]);

  return NextResponse.json({ success: true, orders, total, page, limit });
}
