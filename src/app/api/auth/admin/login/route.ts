import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/server/prisma';
import { comparePassword, generateDeviceToken } from '@/lib/server/auth';
import { setSessionCookie } from '@/lib/server/session';

const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AdminLoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Input tidak valid' }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Akses ditolak' }, { status: 403 });
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ success: false, message: 'Email atau password salah' }, { status: 401 });
    }

    const deviceToken = generateDeviceToken();
    await prisma.user.update({
      where: { id: user.id },
      data: { activeDeviceToken: deviceToken, lastLoginAt: new Date() },
    });

    await setSessionCookie({ userId: user.id, role: 'ADMIN', tier: user.tier, deviceToken });

    return NextResponse.json({ success: true, admin: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('[POST /api/auth/admin/login]', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
