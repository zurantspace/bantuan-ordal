import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, isAuthError, comparePassword, hashPassword } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function PUT(req: NextRequest) {
  const session = await requireAuth(req);
  if (isAuthError(session)) return session;

  try {
    const body = await req.json();
    const parsed = ChangePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Data tidak valid' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) return NextResponse.json({ success: false, message: 'User tidak ditemukan' }, { status: 404 });

    const valid = await comparePassword(parsed.data.currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ success: false, message: 'Password lama salah' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: { passwordHash: await hashPassword(parsed.data.newPassword) },
    });

    return NextResponse.json({ success: true, message: 'Password berhasil diubah' });
  } catch (err) {
    console.error('[PUT /api/member/change-password]', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
