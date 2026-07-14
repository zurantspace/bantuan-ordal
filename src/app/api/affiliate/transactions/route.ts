import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (isAuthError(session)) return session;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;

  const affiliate = await prisma.affiliate.findUnique({ where: { userId: session.userId } });
  if (!affiliate) {
    return NextResponse.json({ success: true, transactions: [], total: 0 });
  }

  const [transactions, total] = await Promise.all([
    prisma.affiliateTransaction.findMany({
      where: { affiliateId: affiliate.id },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { order: { select: { orderId: true, amount: true, customerName: true } } },
    }),
    prisma.affiliateTransaction.count({ where: { affiliateId: affiliate.id } }),
  ]);

  return NextResponse.json({ success: true, transactions, total, page, limit });
}
