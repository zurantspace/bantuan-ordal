import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';
import { sendWA } from '@/lib/server/fonnte';

// POST /api/admin/abandoned/[id]/manual-wa
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin(req);
  if (isAuthError(session)) return session;

  const { id } = await params;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ success: false, message: 'Order tidak ditemukan' }, { status: 404 });
  }
  if (order.status !== 'PENDING') {
    return NextResponse.json({ success: false, message: 'Order sudah tidak pending' }, { status: 400 });
  }

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://bantuan-ordal.id';
  await sendWA('W01', order.customerPhone, {
    name: order.customerName,
    checkoutUrl: `${APP_URL}/checkout?order=${order.id}`,
  });

  return NextResponse.json({ success: true, message: 'WhatsApp terkirim' });
}
