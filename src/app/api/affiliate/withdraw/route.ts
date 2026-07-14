import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

const MIN_WITHDRAWAL = 50000;

const WithdrawSchema = z.object({
  amount: z.number().min(MIN_WITHDRAWAL),
  method: z.enum(['gopay', 'bank_transfer', 'ovo']),
  account: z.string().min(5),
  holderName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (isAuthError(session)) return session;

  try {
    const body = await req.json();
    const parsed = WithdrawSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: `Minimum pencairan Rp ${MIN_WITHDRAWAL.toLocaleString('id-ID')}`, errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { amount, method, account, holderName } = parsed.data;

    const affiliate = await prisma.affiliate.findUnique({ where: { userId: session.userId } });
    if (!affiliate || affiliate.status !== 'APPROVED') {
      return NextResponse.json({ success: false, message: 'Akun affiliate tidak aktif' }, { status: 403 });
    }

    if (affiliate.balance < amount) {
      return NextResponse.json(
        { success: false, message: 'Saldo tidak cukup' },
        { status: 400 }
      );
    }

    // Deduct balance and create withdrawal request
    await prisma.$transaction([
      prisma.affiliate.update({
        where: { id: affiliate.id },
        data: { balance: { decrement: amount } },
      }),
      prisma.withdrawal.create({
        data: { affiliateId: affiliate.id, amount, method, account, holderName, status: 'PENDING' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Permintaan pencairan berhasil dikirim. Admin akan memproses dalam 1x24 jam.',
    });
  } catch (err) {
    console.error('[POST /api/affiliate/withdraw]', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
