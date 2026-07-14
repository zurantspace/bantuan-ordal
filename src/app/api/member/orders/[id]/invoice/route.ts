import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/server/session';
import { prisma } from '@/lib/server/prisma';
import { getPresignedDownloadUrl } from '@/lib/server/r2';

/**
 * GET /api/member/orders/[id]/invoice
 * Download invoice PDF for an order (must belong to session user).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderId: id }],
        userId: session.userId,
        status: 'PAID',
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Invoice tidak ditemukan' }, { status: 404 });
    }

    if (!order.invoiceUrl) {
      return NextResponse.json({ success: false, message: 'Invoice belum tersedia' }, { status: 404 });
    }

    // invoiceUrl stored as R2 key: "invoices/ORD-xxx.pdf"
    const key = order.invoiceUrl.startsWith('http')
      ? new URL(order.invoiceUrl).pathname.replace(/^\/[^/]+\//, '')
      : order.invoiceUrl;

    const url = await getPresignedDownloadUrl(key, 600); // 10 minutes

    return NextResponse.json({ success: true, url });
  } catch (err) {
    console.error('[GET /api/member/orders/[id]/invoice]', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
