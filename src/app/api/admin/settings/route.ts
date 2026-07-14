import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, isAuthError } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

// GET /api/admin/settings
export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (isAuthError(session)) return session;

  const settings = await prisma.appSetting.findMany();
  const map: Record<string, string> = {};
  settings.forEach((s) => { map[s.key] = s.value; });

  return NextResponse.json({ success: true, settings: map });
}

const SettingsSchema = z.record(z.string(), z.string());

// PUT /api/admin/settings
export async function PUT(req: NextRequest) {
  const session = await requireAdmin(req);
  if (isAuthError(session)) return session;

  const body = await req.json();
  const parsed = SettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: 'Invalid settings format' }, { status: 400 });
  }

  // Upsert all settings
  const ops = Object.entries(parsed.data).map(([key, value]) =>
    prisma.appSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    })
  );
  await Promise.all(ops);

  return NextResponse.json({ success: true });
}
