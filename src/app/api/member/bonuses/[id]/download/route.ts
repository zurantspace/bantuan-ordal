import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/server/session';
import { prisma } from '@/lib/server/prisma';
import { getPresignedDownloadUrl } from '@/lib/server/r2';

/**
 * GET /api/member/bonuses/[id]/download
 * Generate a presigned R2 URL for bonus file download.
 * Only accessible by premium members.
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

    // Only premium members can download
    if (session.tier !== 'premium') {
      return NextResponse.json(
        { success: false, message: 'Upgrade ke premium untuk mengakses bonus ini' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const bonus = await prisma.bonusResource.findUnique({
      where: { id, isActive: true },
    });

    if (!bonus) {
      return NextResponse.json({ success: false, message: 'Bonus tidak ditemukan' }, { status: 404 });
    }

    if (!bonus.fileUrl) {
      return NextResponse.json({ success: false, message: 'File belum tersedia' }, { status: 404 });
    }

    // fileUrl stored as R2 key (e.g. "bonus/ebook-trading.pdf")
    // or full URL — extract key if full URL
    const key = bonus.fileUrl.startsWith('http')
      ? new URL(bonus.fileUrl).pathname.replace(/^\/[^/]+\//, '') // strip /bucket-name/
      : bonus.fileUrl;

    const url = await getPresignedDownloadUrl(key, 900); // 15 minutes

    return NextResponse.json({ success: true, url, expiresIn: 900 });
  } catch (err) {
    console.error('[GET /api/member/bonuses/[id]/download]', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
