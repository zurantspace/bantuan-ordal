import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';
import { randomBytes } from 'crypto';

const RegisterSchema = z.object({
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankHolder: z.string().optional(),
  gopayNumber: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (isAuthError(session)) return session;

  try {
    // Check user has a paid order
    const paidOrder = await prisma.order.findFirst({
      where: { userId: session.userId, status: 'PAID' },
    });
    if (!paidOrder) {
      return NextResponse.json(
        { success: false, message: 'Hanya alumni (yang sudah beli kelas) yang bisa daftar affiliate' },
        { status: 403 }
      );
    }

    // Check not already registered
    const existing = await prisma.affiliate.findUnique({ where: { userId: session.userId } });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Kamu sudah terdaftar sebagai affiliate' }, { status: 400 });
    }

    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    // Generate unique referral code
    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { name: true } });
    const base = (user?.name || 'ref').toUpperCase().replace(/\s+/g, '').slice(0, 6);
    const suffix = randomBytes(2).toString('hex').toUpperCase();
    const referralCode = `${base}${suffix}`;

    const affiliate = await prisma.affiliate.create({
      data: {
        userId: session.userId,
        referralCode,
        status: 'PENDING',
        bankName: parsed.success ? parsed.data.bankName : undefined,
        bankAccount: parsed.success ? parsed.data.bankAccount : undefined,
        bankHolder: parsed.success ? parsed.data.bankHolder : undefined,
        gopayNumber: parsed.success ? parsed.data.gopayNumber : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil! Menunggu persetujuan admin.',
      affiliate: { id: affiliate.id, referralCode: affiliate.referralCode, status: affiliate.status },
    });
  } catch (err) {
    console.error('[POST /api/affiliate/register]', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
