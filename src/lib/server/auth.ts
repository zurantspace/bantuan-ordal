import 'server-only';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, SessionPayload } from './session';
import { prisma } from './prisma';
import { randomBytes } from 'crypto';

// ─── Password ────────────────────────────────────────────────────────────────

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// ─── Device Token ─────────────────────────────────────────────────────────────

export function generateDeviceToken(): string {
  return randomBytes(32).toString('hex');
}

// ─── Auto-generate password for new users created from checkout ───────────────

export function generateTempPassword(): string {
  // e.g. "BantuanOrdal@4872"
  const num = Math.floor(1000 + Math.random() * 9000);
  return `BantuanOrdal@${num}`;
}

// ─── Auth guards ─────────────────────────────────────────────────────────────

/** Returns session or a 401 Response. Use in Route Handlers. */
export async function requireAuth(
  req: NextRequest
): Promise<SessionPayload | NextResponse> {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  return session;
}

/** Returns session or a 403 Response. Use in admin Route Handlers. */
export async function requireAdmin(
  req: NextRequest
): Promise<SessionPayload | NextResponse> {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  if (session.role !== 'ADMIN') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }
  return session;
}

/** Helper: check if result from requireAuth/requireAdmin is a Response (error) */
export function isAuthError(val: SessionPayload | NextResponse): val is NextResponse {
  return val instanceof NextResponse;
}

// ─── Fetch full user from DB ──────────────────────────────────────────────────

export async function getUserFromSession(session: SessionPayload) {
  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      tier: true,
      isActive: true,
      activeDeviceToken: true,
      createdAt: true,
      affiliate: {
        select: {
          id: true,
          referralCode: true,
          status: true,
          balance: true,
          totalClicks: true,
          totalOrders: true,
          totalCommission: true,
        },
      },
    },
  });
}
