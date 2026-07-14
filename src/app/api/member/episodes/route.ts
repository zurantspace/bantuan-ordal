import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export async function GET(req: NextRequest) {
  const session = await requireAuth(req);
  if (isAuthError(session)) return session;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { tier: true },
  });

  const episodes = await prisma.episode.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      watchProgress: {
        where: { userId: session.userId },
        select: { progressPct: true, completed: true, progressSeconds: true, totalSeconds: true },
      },
    },
  });

  const userTier = user?.tier || 'standard';

  const result = episodes.map((ep) => {
    const progress = ep.watchProgress[0];
    const isLocked = ep.tier === 'premium' && userTier !== 'premium';
    return {
      id: ep.id,
      number: ep.number,
      title: ep.title,
      subtitle: ep.subtitle,
      description: ep.description,
      duration: ep.duration,
      thumbnail: ep.thumbnail,
      tier: ep.tier,
      isLocked,
      progress: progress?.progressPct ?? 0,
      completed: progress?.completed ?? false,
    };
  });

  return NextResponse.json({ success: true, episodes: result });
}
