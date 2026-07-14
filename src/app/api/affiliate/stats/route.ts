import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (isAuthError(session)) return session;

  const affiliate = await prisma.affiliate.findUnique({
    where: { userId: session.userId },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      withdrawals: {
        orderBy: { createdAt: 'desc' },
        take: 3,
      },
    },
  });

  if (!affiliate) {
    return NextResponse.json({ success: true, affiliate: null });
  }

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://bantuan-ordal.id';
  const pendingCommission = await prisma.affiliateTransaction.aggregate({
    where: { affiliateId: affiliate.id, status: 'PENDING' },
    _sum: { commissionAmount: true },
  });

  return NextResponse.json({
    success: true,
    affiliate: {
      id: affiliate.id,
      referralCode: affiliate.referralCode,
      referralLink: `${APP_URL}/?ref=${affiliate.referralCode}`,
      status: affiliate.status,
      balance: affiliate.balance,
      totalClicks: affiliate.totalClicks,
      totalOrders: affiliate.totalOrders,
      totalCommission: affiliate.totalCommission,
      pendingCommission: pendingCommission._sum.commissionAmount || 0,
      bankName: affiliate.bankName,
      bankAccount: affiliate.bankAccount,
      gopayNumber: affiliate.gopayNumber,
      recentTransactions: affiliate.transactions,
    },
  });
}
