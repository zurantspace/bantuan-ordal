import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { verifyMidtransSignature, mapMidtransStatus, type MidtransNotification } from '@/lib/server/midtrans';
import { sendWelcomeEmail } from '@/lib/server/brevo';
import { sendWA } from '@/lib/server/fonnte';
import { hashPassword } from '@/lib/server/auth';
import { generateAndUploadInvoice } from '@/lib/server/invoice';


export async function POST(req: NextRequest) {
  try {
    const notification: MidtransNotification = await req.json();

    // ── Security: verify signature ─────────────────────────────────────────────
    const sigValid = verifyMidtransSignature(notification);
    if (!sigValid) {
      console.warn('[Webhook] Invalid Midtrans signature for order:', notification.order_id);
      return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
    }

    const { order_id, transaction_status, fraud_status, payment_type } = notification;

    // ── Find order (idempotency) ───────────────────────────────────────────────
    const order = await prisma.order.findUnique({
      where: { orderId: order_id },
      include: { user: true, product: true },
    });

    if (!order) {
      console.warn('[Webhook] Order not found:', order_id);
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Already processed — idempotent
    if (order.status === 'PAID' || order.status === 'REFUNDED') {
      return NextResponse.json({ message: 'Already processed' });
    }

    const newStatus = mapMidtransStatus(transaction_status, fraud_status);
    if (!newStatus) {
      return NextResponse.json({ message: 'Status ignored' });
    }

    // ── Update order ───────────────────────────────────────────────────────────
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: newStatus,
        paymentType: payment_type,
        fraudStatus: fraud_status,
        midtransRawJson: notification as object,
        paidAt: newStatus === 'PAID' ? new Date() : undefined,
        abandonedAt: newStatus === 'PAID' ? null : order.abandonedAt,
      },
    });

    // ── On SUCCESS: trigger onboarding ────────────────────────────────────────
    if (newStatus === 'PAID') {
      const user = order.user;
      const customerEmail = order.customerEmail;
      const customerName = order.customerName;
      const customerPhone = order.customerPhone;
      const hasOrderBump = order.hasOrderBump;

      // Update user tier if premium upgrade
      if (order.product.slug === 'premium_upgrade' && user) {
        await prisma.user.update({ where: { id: user.id }, data: { tier: 'premium' } });
      }

      // Send onboarding email
      const emailCode = hasOrderBump ? 'E02' : 'E01';
      const userId = user?.id;

      // Generate a display password for email (stored hash was created at checkout)
      // We'll show a message to check original password
      const emailData = {
        name: customerName,
        email: customerEmail,
        password: '(password yang kamu buat saat checkout)',
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
      };

      // Fire welcome email + WA in parallel
      const tier = (order.product.slug === 'premium_upgrade' || hasOrderBump) ? 'premium' : 'standard';

      // Generate invoice PDF → upload to R2 (non-blocking)
      generateAndUploadInvoice({
        orderId: order.orderId,
        customerName,
        customerEmail,
        customerPhone,
        productName: order.product.name,
        amount: order.amount,
        hasOrderBump: order.hasOrderBump,
        orderBumpAmount: order.orderBumpAmount,
        promoDiscount: order.promoDiscount,
        promoCode: order.promoCode,
        paidAt: new Date(),
      }).then(async (key) => {
        await prisma.order.update({
          where: { id: order.id },
          data: { invoiceUrl: key },
        });
      }).catch(err => {
        console.error('[Invoice] Failed to generate invoice for', order.orderId, err);
      });

      await Promise.all([
        sendWelcomeEmail(customerEmail, customerName, tier),
        sendWA('W04', customerPhone, { name: customerName, loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login` }, userId),
      ]);


      // ── Handle affiliate commission ─────────────────────────────────────────
      if (order.affiliateCode) {
        const affiliate = await prisma.affiliate.findUnique({
          where: { referralCode: order.affiliateCode },
        });
        if (affiliate && affiliate.status === 'APPROVED') {
          // Prevent self-purchase fraud
          const affiliateUser = await prisma.user.findUnique({ where: { id: affiliate.userId } });
          if (affiliateUser?.email !== customerEmail) {
            const commission = Math.round(order.amount * 0.5);
            await prisma.affiliateTransaction.create({
              data: {
                affiliateId: affiliate.id,
                orderId: order.id,
                type: 'transaction',
                commissionAmount: commission,
                status: 'PENDING',
              },
            });
            await prisma.affiliate.update({
              where: { id: affiliate.id },
              data: { totalOrders: { increment: 1 } },
            });
          }
        }
      }
    }

    return NextResponse.json({ message: 'OK' });
  } catch (err) {
    console.error('[POST /api/webhook/midtrans]', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
