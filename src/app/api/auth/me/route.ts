import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/server/session';
import { prisma } from '@/lib/server/prisma';

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      tier: true,
      role: true,
      isActive: true,
      createdAt: true,
      affiliate: {
        select: {
          id: true,
          referralCode: true,
          status: true,
          balance: true,
          totalClicks: true,
          totalOrders: true,
          totalCommission: true,
        },
      },
    },
  });

  if (!user || !user.isActive) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user: {
      ...user,
      isAffiliate: !!user.affiliate && user.affiliate.status === 'APPROVED',
    },
  });
}
