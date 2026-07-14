import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';

// GET /api/affiliate/track?ref=CODE
// Sets affiliate cookie, logs click, redirects to homepage
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get('ref');
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://bantuan-ordal.id';

  if (!ref) {
    return NextResponse.redirect(APP_URL);
  }

  const affiliate = await prisma.affiliate.findUnique({
    where: { referralCode: ref },
  });

  if (!affiliate || affiliate.status !== 'APPROVED') {
    return NextResponse.redirect(APP_URL);
  }

  // Anti-fraud: 1 unique click per IP per hour
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown';
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const recentClick = await prisma.affiliateClick.findFirst({
    where: { affiliateId: affiliate.id, ip, createdAt: { gte: oneHourAgo } },
  });

  if (!recentClick) {
    await prisma.affiliateClick.create({
      data: {
        affiliateId: affiliate.id,
        ip,
        userAgent: req.headers.get('user-agent') || '',
      },
    });
  }

  // Build redirect URL with UTM params
  const target = new URL(APP_URL);
  target.searchParams.set('ref', ref);
  target.searchParams.set('utm_source', 'affiliate');
  target.searchParams.set('utm_medium', 'referral');
  target.searchParams.set('utm_campaign', ref);

  const response = NextResponse.redirect(target.toString());

  // Set affiliate cookie (30 days)
  response.cookies.set('ref', ref, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
    sameSite: 'lax',
    httpOnly: false, // needs to be readable by JS for checkout form
  });

  return response;
}
