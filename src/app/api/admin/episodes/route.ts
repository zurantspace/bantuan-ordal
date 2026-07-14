import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

// GET /api/admin/episodes — list all episodes
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (isAuthError(session)) return session;

  const episodes = await prisma.episode.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { watchProgress: true } },
    },
  });

  return NextResponse.json({ success: true, episodes });
}

const EpisodeSchema = z.object({
  number: z.number().int().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal('')),
  thumbnail: z.string().optional(),
  duration: z.string().optional(),
  tier: z.enum(['standard', 'premium']).default('standard'),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

// POST /api/admin/episodes — create episode
export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (isAuthError(session)) return session;

  try {
    const body = await req.json();
    const parsed = EpisodeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 400 });
    }

    const episode = await prisma.episode.create({ data: parsed.data });
    return NextResponse.json({ success: true, episode }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/episodes]', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
