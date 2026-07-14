import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (isAuthError(session)) return session;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;

  const where = status ? { status: status as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' } : {};

  const [withdrawals, total] = await Promise.all([
    prisma.withdrawal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        affiliate: {
          include: { user: { select: { name: true, email: true, phone: true } } },
        },
      },
    }),
    prisma.withdrawal.count({ where }),
  ]);

  return NextResponse.json({ success: true, withdrawals, total });
}
