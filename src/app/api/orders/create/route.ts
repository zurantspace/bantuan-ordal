import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/server/prisma';
import { hashPassword, generateTempPassword } from '@/lib/server/auth';
import { createSnapToken } from '@/lib/server/midtrans';
import { randomBytes } from 'crypto';

const PRICE_MAIN = 50000;
const PRICE_BUMP = 47000;
const PRICE_PREMIUM = 149000;

const CreateOrderSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8),
  hasOrderBump: z.boolean().default(false),
  isUpgrade: z.boolean().default(false),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  referrerUrl: z.string().optional(),
  landingUrl: z.string().optional(),
  affiliateCode: z.string().optional(),
  promoToken: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Data tidak lengkap', errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      name, email, phone, password, hasOrderBump, isUpgrade,
      utmSource, utmMedium, utmCampaign, utmContent,
      referrerUrl, landingUrl, affiliateCode, promoToken,
    } = parsed.data;

    // ── Resolve promo pricing ──────────────────────────────────────────────────
    let finalPrice = isUpgrade ? PRICE_PREMIUM : PRICE_MAIN;
    let promoDiscount = 0;
    let promoCode: string | null = null;

    if (promoToken && !isUpgrade) {
      const promo = await prisma.promoSchedule.findUnique({
        where: { promoToken },
      });
      if (promo && (!promo.expiresAt || promo.expiresAt > new Date())) {
        const discount = PRICE_MAIN - promo.discountAmount;
        promoDiscount = discount;
        finalPrice = promo.discountAmount;
        promoCode = promoToken;
      }
    }

    const totalAmount = finalPrice + (hasOrderBump && !isUpgrade ? PRICE_BUMP : 0);

    // ── Upsert user ────────────────────────────────────────────────────────────
    const passwordHash = await hashPassword(password);
    const normalizedEmail = email.toLowerCase();

    let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      user = await prisma.user.create({
        data: { name, email: normalizedEmail, phone, passwordHash, role: 'MEMBER', tier: 'standard' },
      });
    }

    // ── Create Order ───────────────────────────────────────────────────────────
    const timestamp = Date.now();
    const orderId = `ORD-${timestamp}-${user.id.slice(0, 6).toUpperCase()}`;

    // Find product slug
    const productSlug = isUpgrade ? 'premium_upgrade' : 'main_course';
    let product = await prisma.product.findUnique({ where: { slug: productSlug } });
    if (!product) {
      product = await prisma.product.create({
        data: { slug: productSlug, name: isUpgrade ? 'Premium Upgrade (Ep.5-9)' : 'Kelas Persiapan Karir (Ep.1-4)', price: isUpgrade ? PRICE_PREMIUM : PRICE_MAIN },
      });
    }

    const order = await prisma.order.create({
      data: {
        orderId,
        userId: user.id,
        productId: product.id,
        customerName: name,
        customerEmail: normalizedEmail,
        customerPhone: phone,
        amount: totalAmount,
        hasOrderBump: hasOrderBump && !isUpgrade,
        orderBumpAmount: hasOrderBump && !isUpgrade ? PRICE_BUMP : 0,
        promoDiscount,
        promoCode,
        status: 'PENDING',
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        referrerUrl,
        landingUrl,
        affiliateCode,
        abandonedAt: new Date(),
      },
    });

    // ── Create PromoSchedules for abandoned checkout ───────────────────────────
    if (!isUpgrade) {
      const abandonTime = new Date();
      const token99k = randomBytes(16).toString('hex');
      const token79k = randomBytes(16).toString('hex');

      await prisma.promoSchedule.createMany({
        data: [
          {
            orderId: order.id,
            triggerType: 'day3_99k',
            scheduledAt: new Date(abandonTime.getTime() + 3 * 24 * 60 * 60 * 1000),
            discountAmount: 99000,
            promoToken: token99k,
            expiresAt: new Date(abandonTime.getTime() + 5 * 24 * 60 * 60 * 1000),
          },
          {
            orderId: order.id,
            triggerType: 'day10_79k',
            scheduledAt: new Date(abandonTime.getTime() + 10 * 24 * 60 * 60 * 1000),
            discountAmount: 79000,
            promoToken: token79k,
            expiresAt: new Date(abandonTime.getTime() + 11 * 24 * 60 * 60 * 1000),
          },
        ],
      });
    }

    // ── Create Snap Token ──────────────────────────────────────────────────────
    const items = [
      {
        id: productSlug,
        name: isUpgrade ? 'Premium Upgrade (Ep.5-9)' : 'Kelas Persiapan Karir (Ep.1-4)',
        price: finalPrice,
        quantity: 1,
      },
    ];
    if (hasOrderBump && !isUpgrade) {
      items.push({ id: 'order_bump', name: 'Bonus Premium Bundle', price: PRICE_BUMP, quantity: 1 });
    }

    const snap = await createSnapToken({
      orderId,
      grossAmount: totalAmount,
      customerName: name,
      customerEmail: normalizedEmail,
      customerPhone: phone,
      items,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      midtransOrderId: orderId,
      snapToken: snap.token,
      amount: totalAmount,
    });
  } catch (err) {
    console.error('[POST /api/orders/create]', err);
    return NextResponse.json({ success: false, message: 'Gagal membuat order' }, { status: 500 });
  }
}
