'use client';

// Simple mock auth using localStorage
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'standard' | 'premium';
  isAffiliate: boolean;
  affiliateCode?: string;
}

export function login(email: string, password: string): { success: boolean; message?: string; user?: AuthUser } {
  // Check for demo credentials or any registered user
  if (typeof window !== 'undefined') {
    // Check stored user (registered via checkout)
    const stored = localStorage.getItem('bantuan_ordal_user');
    if (stored) {
      try {
        const existingUser = JSON.parse(stored) as AuthUser & { passwordHash?: string };
        if (existingUser.email === email) {
          localStorage.setItem('bantuan_ordal_token', 'mock-token-' + Date.now());
          return { success: true, user: existingUser };
        }
      } catch { /* ignore */ }
    }
  }

  // Demo credentials — ONLY accept exact match
  const isDemoCredentials =
    (email === 'demo@bantuanordal.com' && password === 'demo1234');

  if (!isDemoCredentials) {
    return { success: false, message: 'Email atau password salah. Gunakan demo@bantuanordal.com / demo1234' };
  }

  const user: AuthUser = {
    id: 'user-001',
    name: 'Riyani Rahayu',
    email: email,
    phone: '08123456789',
    tier: 'standard',
    isAffiliate: true,
    affiliateCode: 'RIYANI2026',
  };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('bantuan_ordal_user', JSON.stringify(user));
    localStorage.setItem('bantuan_ordal_token', 'mock-token-' + Date.now());
  }
  
  return { success: true, user };
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('bantuan_ordal_user');
    localStorage.removeItem('bantuan_ordal_token');
  }
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('bantuan_ordal_user');
  if (!stored) return null;
  
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('bantuan_ordal_token');
}

export function registerFromCheckout(name: string, email: string, phone: string, password: string): AuthUser {
  const user: AuthUser = {
    id: 'user-' + Date.now(),
    name,
    email,
    phone,
    tier: 'standard',
    isAffiliate: false,
  };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('bantuan_ordal_user', JSON.stringify(user));
    localStorage.setItem('bantuan_ordal_token', 'mock-token-' + Date.now());
  }
  
  return user;
}

export function getEpisodeProgress(episodeId: number): number {
  if (typeof window === 'undefined') return 0;
  const key = `episode_progress_${episodeId}`;
  return parseInt(localStorage.getItem(key) || '0', 10);
}

export function setEpisodeProgress(episodeId: number, progress: number): void {
  if (typeof window === 'undefined') return;
  const key = `episode_progress_${episodeId}`;
  localStorage.setItem(key, progress.toString());
}

// UTM tracking
export function captureUTM(): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const utmData = {
    utm_source: params.get('utm_source') || 'direct',
    utm_medium: params.get('utm_medium') || 'none',
    utm_campaign: params.get('utm_campaign') || 'none',
    utm_content: params.get('utm_content') || 'none',
    ref: params.get('ref') || null,
    landing_url: window.location.href,
    referrer_url: document.referrer,
  };
  
  if (!localStorage.getItem('utmData')) {
    localStorage.setItem('utmData', JSON.stringify(utmData));
  }
}

export function getUTMData(): Record<string, string | null> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem('utmData') || '{}');
  } catch {
    return {};
  }
}
