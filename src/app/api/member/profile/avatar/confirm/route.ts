import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/server/session';
import { prisma } from '@/lib/server/prisma';
import { BUCKET_NAME, R2_PUBLIC_URL } from '@/lib/server/r2';

/**
 * POST /api/member/profile/avatar/confirm
 * After client uploads to R2, call this to save the avatar URL to DB.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { key } = await req.json();
    if (!key || typeof key !== 'string') {
      return NextResponse.json({ success: false, message: 'Key tidak valid' }, { status: 400 });
    }

    // Validate key belongs to this user
    if (!key.startsWith(`avatars/${session.userId}.`)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    // Build the public URL (needs bucket to be set as public domain, or use custom domain)
    const avatarUrl = `${R2_PUBLIC_URL}/${BUCKET_NAME}/${key}`;

    await prisma.user.update({
      where: { id: session.userId },
      data: { avatarUrl },
    });

    return NextResponse.json({ success: true, avatarUrl });
  } catch (err) {
    console.error('[POST /api/member/profile/avatar/confirm]', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
