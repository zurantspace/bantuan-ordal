import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

function getDateFilter(period: string) {
  const now = new Date();
  if (period === '1d') return new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (period === '7d') return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (period === '30d') return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return undefined; // all-time
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (isAuthError(session)) return session;

  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || '30d';
  const since = getDateFilter(period);
  const dateFilter = since ? { gte: since } : undefined;

  const [
    totalOrders,
    paidOrders,
    failedOrders,
    pendingOrders,
    refundedOrders,
    totalRevenue,
    orderBumpOrders,
    premiumOrders,
    abandonedCount,
    totalUsers,
    affiliateTransactionsPending,
    // Episode completion rates
    ep2Completions,
    ep3Completions,
    ep4Completions,
    totalMembers,
    // Revenue by day (last 30 days)
    dailyRevenue,
    // Traffic sources
    trafficSources,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: dateFilter } }),
    prisma.order.count({ where: { status: 'PAID', paidAt: dateFilter } }),
    prisma.order.count({ where: { status: 'FAILED', createdAt: dateFilter } }),
    prisma.order.count({ where: { status: 'PENDING', createdAt: dateFilter } }),
    prisma.order.count({ where: { status: 'REFUNDED', createdAt: dateFilter } }),
    prisma.order.aggregate({
      where: { status: 'PAID', paidAt: dateFilter },
      _sum: { amount: true },
    }),
    prisma.order.count({ where: { status: 'PAID', hasOrderBump: true, paidAt: dateFilter } }),
    prisma.order.count({
      where: { status: 'PAID', product: { slug: 'premium_upgrade' }, paidAt: dateFilter },
    }),
    prisma.order.count({ where: { status: 'PENDING', abandonedAt: { not: null }, createdAt: dateFilter } }),
    prisma.user.count({ where: { role: 'MEMBER', createdAt: dateFilter } }),
    prisma.affiliateTransaction.count({ where: { status: 'PENDING' } }),
    // Episode completions
    prisma.watchProgress.count({
      where: { completed: true, episode: { number: 2 }, ...(since ? { completedAt: { gte: since } } : {}) },
    }),
    prisma.watchProgress.count({
      where: { completed: true, episode: { number: 3 }, ...(since ? { completedAt: { gte: since } } : {}) },
    }),
    prisma.watchProgress.count({
      where: { completed: true, episode: { number: 4 }, ...(since ? { completedAt: { gte: since } } : {}) },
    }),
    prisma.user.count({ where: { role: 'MEMBER' } }),
    // Revenue per day (last 30 days)
    prisma.$queryRaw<Array<{ day: string; revenue: number; count: number }>>`
      SELECT DATE("paidAt")::text as day, SUM(amount) as revenue, COUNT(*) as count
      FROM "Order"
      WHERE status = 'PAID' AND "paidAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE("paidAt")
      ORDER BY day ASC
    `,
    // Traffic sources
    prisma.order.groupBy({
      by: ['utmSource'],
      where: { status: 'PAID', paidAt: dateFilter },
      _count: { id: true },
      _sum: { amount: true },
    }),
  ]);

  const orderBumpRate = paidOrders > 0 ? ((orderBumpOrders / paidOrders) * 100).toFixed(1) : '0';
  const premiumRate = paidOrders > 0 ? ((premiumOrders / paidOrders) * 100).toFixed(1) : '0';

  return NextResponse.json({
    success: true,
    stats: {
      totalOrders,
      paidOrders,
      failedOrders,
      pendingOrders,
      refundedOrders,
      totalRevenue: totalRevenue._sum.amount || 0,
      orderBumpOrders,
      orderBumpRate,
      premiumOrders,
      premiumRate,
      abandonedCount,
      totalUsers,
      affiliateTransactionsPending,
      completionRates: {
        ep2: totalMembers > 0 ? ((ep2Completions / totalMembers) * 100).toFixed(1) : '0',
        ep3: totalMembers > 0 ? ((ep3Completions / totalMembers) * 100).toFixed(1) : '0',
        ep4: totalMembers > 0 ? ((ep4Completions / totalMembers) * 100).toFixed(1) : '0',
      },
      dailyRevenue,
      trafficSources: trafficSources.map(s => ({
        source: s.utmSource || 'direct',
        orders: s._count.id,
        revenue: s._sum.amount || 0,
      })),
    },
  });
}
