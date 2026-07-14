import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';
// Brevo import removed — completion email triggers via BullMQ queue in production
import { sendWA } from '@/lib/server/fonnte';

const ProgressSchema = z.object({
  episodeId: z.string(),
  progressSeconds: z.number().min(0),
  totalSeconds: z.number().min(0),
});

export async function POST(req: NextRequest) {
  const session = await requireAuth(req);
  if (isAuthError(session)) return session;

  try {
    const body = await req.json();
    const parsed = ProgressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
    }

    const { episodeId, progressSeconds, totalSeconds } = parsed.data;
    const progressPct = totalSeconds > 0 ? (progressSeconds / totalSeconds) * 100 : 0;
    const completed = progressPct >= 90;

    const existing = await prisma.watchProgress.findUnique({
      where: { userId_episodeId: { userId: session.userId, episodeId } },
    });

    const wasCompleted = existing?.completed ?? false;

    const progress = await prisma.watchProgress.upsert({
      where: { userId_episodeId: { userId: session.userId, episodeId } },
      create: {
        userId: session.userId,
        episodeId,
        progressSeconds,
        totalSeconds,
        progressPct,
        completed,
        completedAt: completed ? new Date() : null,
      },
      update: {
        progressSeconds: Math.max(existing?.progressSeconds ?? 0, progressSeconds),
        totalSeconds,
        progressPct: Math.max(existing?.progressPct ?? 0, progressPct),
        completed: existing?.completed || completed,
        completedAt: completed && !wasCompleted ? new Date() : existing?.completedAt,
      },
      include: { episode: { select: { number: true } } },
    });

    // ── Trigger Ep.4 upsell automation ─────────────────────────────────────────
    if (completed && !wasCompleted && progress.episode.number === 4) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, name: true, email: true, phone: true, tier: true },
      });

      if (user && user.tier === 'standard') {
        // Async — fire WA completion notification, email via queue in prod
        sendWA('W05', user.phone, { name: user.name }, user.id).catch(console.error);
      }
    }

    return NextResponse.json({ success: true, progressPct, completed });
  } catch (err) {
    console.error('[POST /api/member/progress]', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
