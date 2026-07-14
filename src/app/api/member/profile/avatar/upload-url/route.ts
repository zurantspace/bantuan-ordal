import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/server/session';
import { getPresignedUploadUrl } from '@/lib/server/r2';
import { prisma } from '@/lib/server/prisma';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

/**
 * POST /api/member/profile/avatar/upload-url
 * Returns a presigned R2 URL for client-side avatar upload.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { contentType, fileSize } = await req.json();

    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        { success: false, message: 'Format file tidak valid. Gunakan JPG, PNG, atau WebP.' },
        { status: 400 }
      );
    }

    if (fileSize > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: 'Ukuran file maksimal 2MB.' },
        { status: 400 }
      );
    }

    const ext = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg';
    const key = `avatars/${session.userId}.${ext}`;

    const uploadUrl = await getPresignedUploadUrl(key, contentType, 300);

    // Return the key so the client can confirm upload
    return NextResponse.json({ success: true, uploadUrl, key });
  } catch (err) {
    console.error('[POST /api/member/profile/avatar/upload-url]', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
