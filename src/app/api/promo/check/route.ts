import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';

// GET /api/promo/check?token=XXX
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ success: false, message: 'Token tidak ditemukan' }, { status: 400 });
  }

  const promo = await prisma.promoSchedule.findUnique({
    where: { promoToken: token },
    include: { order: { select: { status: true, customerEmail: true } } },
  });

  if (!promo) {
    return NextResponse.json({ success: false, message: 'Promo tidak valid' }, { status: 404 });
  }

  // Check if expired
  if (promo.expiresAt && promo.expiresAt < new Date()) {
    return NextResponse.json({ success: false, message: 'Promo sudah kadaluarsa' }, { status: 410 });
  }

  // Check if order already paid
  if (promo.order.status === 'PAID') {
    return NextResponse.json({ success: false, message: 'Order sudah dibayar' }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    promo: {
      token,
      discountAmount: promo.discountAmount,
      expiresAt: promo.expiresAt,
      triggerType: promo.triggerType,
      customerEmail: promo.order.customerEmail,
    },
  });
}
