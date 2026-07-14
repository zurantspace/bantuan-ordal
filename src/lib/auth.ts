'use client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'standard' | 'premium';
  role: 'MEMBER' | 'ADMIN';
  isAffiliate: boolean;
  affiliateCode?: string;
  affiliate?: {
    id: string;
    referralCode: string;
    status: string;
    balance: number;
    totalClicks: number;
    totalOrders: number;
    totalCommission: number;
  } | null;
}

// ─── Auth API calls ───────────────────────────────────────────────────────────

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; message?: string; user?: AuthUser }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, message: 'Gagal terhubung ke server. Coba lagi.' };
  }
}

export async function loginAdmin(
  email: string,
  password: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch('/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, message: 'Gagal terhubung ke server.' };
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  } catch {
    // Silently fail
  }
}

export async function getUser(): Promise<AuthUser | null> {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.user : null;
  } catch {
    return null;
  }
}

// ─── Episode Progress ─────────────────────────────────────────────────────────

export async function setEpisodeProgress(
  episodeId: string,
  progressSeconds: number,
  totalSeconds: number
): Promise<void> {
  try {
    await fetch('/api/member/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ episodeId, progressSeconds, totalSeconds }),
      credentials: 'include',
    });
  } catch {
    // Silently fail
  }
}

// ─── UTM Tracking ─────────────────────────────────────────────────────────────

export function captureUTM(): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const utmData = {
    utm_source: params.get('utm_source') || 'direct',
    utm_medium: params.get('utm_medium') || 'none',
    utm_campaign: params.get('utm_campaign') || 'none',
    utm_content: params.get('utm_content') || 'none',
    ref: params.get('ref') || getCookie('ref') || null,
    landing_url: window.location.href,
    referrer_url: document.referrer,
  };

  // Only capture first touch
  if (!sessionStorage.getItem('utmData')) {
    sessionStorage.setItem('utmData', JSON.stringify(utmData));
  }
}

export function getUTMData(): Record<string, string | null> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(sessionStorage.getItem('utmData') || '{}');
  } catch {
    return {};
  }
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function getAffiliateCode(): string | null {
  return getCookie('ref');
}
