import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

const EpisodeUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  thumbnail: z.string().optional(),
  duration: z.string().optional(),
  tier: z.enum(['standard', 'premium']).optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

// PATCH /api/admin/episodes/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin(req);
  if (isAuthError(session)) return session;

  const { id } = await params;
  const body = await req.json();
  const parsed = EpisodeUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 400 });
  }

  const episode = await prisma.episode.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ success: true, episode });
}

// DELETE /api/admin/episodes/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin(req);
  if (isAuthError(session)) return session;

  const { id } = await params;
  await prisma.episode.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
