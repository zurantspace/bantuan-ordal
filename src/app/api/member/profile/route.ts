import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, isAuthError, comparePassword, hashPassword } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

const ProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
});

export async function PUT(req: NextRequest) {
  const session = await requireAuth(req);
  if (isAuthError(session)) return session;

  try {
    const body = await req.json();
    const parsed = ProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Data tidak valid' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: { ...parsed.data },
      select: { id: true, name: true, email: true, phone: true, tier: true },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    console.error('[PUT /api/member/profile]', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
