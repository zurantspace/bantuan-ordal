import { NextRequest, NextResponse } from 'next/server';
import { decryptSession } from '@/lib/server/session';

// ─── Route Matchers ───────────────────────────────────────────────────────────

const MEMBER_ROUTES = ['/home', '/watch', '/bonus', '/settings', '/affiliate', '/wallet'];
const ADMIN_ROUTES = ['/admin'];
const AUTH_ROUTES = ['/login', '/admin/login'];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin routes ────────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('session')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    const session = await decryptSession(token);
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.next();
  }

  // ── Member dashboard routes ─────────────────────────────────────────────────
  const isMemberRoute = MEMBER_ROUTES.some((r) => pathname.startsWith(r));
  if (isMemberRoute) {
    const token = req.cookies.get('session')?.value;
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    const session = await decryptSession(token);
    if (!session) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 1-device policy: reject if device token mismatch
    // (Note: Full device check would require DB lookup — for edge performance
    //  we skip DB here and rely on the /api/auth/me check on client-side)

    return NextResponse.next();
  }

  // ── Redirect logged-in users away from auth pages ───────────────────────────
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r);
  if (isAuthRoute) {
    const token = req.cookies.get('session')?.value;
    if (token) {
      const session = await decryptSession(token);
      if (session) {
        if (session.role === 'ADMIN') return NextResponse.redirect(new URL('/admin', req.url));
        return NextResponse.redirect(new URL('/home', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files, _next, favicon, api
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
};
