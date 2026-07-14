import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';
import { sendWA } from '@/lib/server/fonnte';

const UpdateWithdrawalSchema = z.object({
  status: z.enum(['PROCESSING', 'COMPLETED', 'REJECTED']),
  note: z.string().optional(),
});

// PUT /api/admin/withdrawals/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin(req);
  if (isAuthError(session)) return session;

  const { id } = await params;
  const body = await req.json();
  const parsed = UpdateWithdrawalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  const { status, note } = parsed.data;

  const withdrawal = await prisma.withdrawal.update({
    where: { id },
    data: {
      status,
      note,
      processedAt: status === 'COMPLETED' ? new Date() : undefined,
    },
    include: {
      affiliate: {
        include: { user: { select: { id: true, name: true, email: true, phone: true } } },
      },
    },
  });

  // If REJECTED — refund balance
  if (status === 'REJECTED') {
    await prisma.affiliate.update({
      where: { id: withdrawal.affiliateId },
      data: { balance: { increment: withdrawal.amount } },
    });
  }

  // Notify affiliate via WA on COMPLETED
  if (status === 'COMPLETED') {
    const amtFormatted = `Rp ${withdrawal.amount.toLocaleString('id-ID')}`;
    await sendWA('W08', withdrawal.affiliate.user.phone, {
      name: withdrawal.affiliate.user.name,
      amount: amtFormatted,
      payoutMethod: withdrawal.method,
      payoutAccount: withdrawal.account,
    }, withdrawal.affiliate.user.id).catch(console.error);
  }

  return NextResponse.json({ success: true, withdrawal: { id: withdrawal.id, status: withdrawal.status } });
}
