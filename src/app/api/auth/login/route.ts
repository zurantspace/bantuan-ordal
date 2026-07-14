import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/server/prisma';
import { comparePassword, generateDeviceToken, hashPassword } from '@/lib/server/auth';
import { setSessionCookie } from '@/lib/server/session';
import { randomBytes } from 'crypto';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Email atau password tidak valid' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        affiliate: { select: { id: true, referralCode: true, status: true } },
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { success: false, message: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // 1-device policy: generate new device token, invalidate old sessions
    const deviceToken = generateDeviceToken();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        activeDeviceToken: deviceToken,
        lastLoginIp: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
        lastLoginAt: new Date(),
      },
    });

    await setSessionCookie({
      userId: user.id,
      role: user.role,
      tier: user.tier,
      deviceToken,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        tier: user.tier,
        role: user.role,
        isAffiliate: !!user.affiliate && user.affiliate.status === 'APPROVED',
        affiliateCode: user.affiliate?.referralCode,
      },
    });
  } catch (err) {
    console.error('[POST /api/auth/login]', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
