import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';
import { sendEmail } from '@/lib/server/brevo';
import { sendWA } from '@/lib/server/fonnte';

// GET /api/admin/affiliate — list all affiliates
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (isAuthError(session)) return session;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 20;

  const [affiliates, total] = await Promise.all([
    prisma.affiliate.findMany({
      where: status ? { status: status as 'PENDING' | 'APPROVED' | 'SUSPENDED' } : {},
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        _count: { select: { transactions: true, clicks: true } },
      },
    }),
    prisma.affiliate.count({ where: status ? { status: status as 'PENDING' | 'APPROVED' | 'SUSPENDED' } : {} }),
  ]);

  return NextResponse.json({ success: true, affiliates, total });
}
