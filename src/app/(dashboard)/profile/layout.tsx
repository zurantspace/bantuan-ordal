'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getUser } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';

const RED = '#f1301e';
const RED_DARK = '#9f2315';

const TABS = [
  { key: 'watch',     label: 'Watch',     path: '/profile' },
  { key: 'wallet',    label: 'Wallet',    path: '/profile/wallet' },
  { key: 'affiliate', label: 'Affiliate', path: '/profile/affiliate' },
  { key: 'settings',  label: 'Settings',  path: '/profile/settings' },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    (async () => {
      const u = await getUser();
      if (u) setUser(u);
    })();
  }, []);

  const activeIdx = TABS.findIndex(t =>
    t.path === '/profile'
      ? pathname === '/profile'
      : pathname.startsWith(t.path)
  );

  // Animate indicator on tab change
  useEffect(() => {
    const el = tabsRef.current[activeIdx === -1 ? 0 : activeIdx];
    if (el) {
      const { offsetLeft, offsetWidth } = el;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeIdx, pathname]);

  const isPremium = user?.tier === 'premium';
  const now = new Date();
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const memberSince = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', minHeight: '100vh' }}>

      {/* ── Hero Banner ── */}
      <div style={{
        height: '180px', width: '100%', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(119.6deg, #871409 0%, #000 94.7%)',
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(241,48,30,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(241,48,30,0.08)', pointerEvents: 'none' }} />
      </div>

      {/* ── Profile Card (overlapping hero) ── */}
      <div style={{
        maxWidth: '960px', margin: '-60px auto 0', padding: '0 16px 8px', position: 'relative', zIndex: 2,
      }}>
        <div style={{
          background: '#0d0d0d', border: '1px solid #282828',
          borderRadius: '20px', padding: '20px',
          display: 'flex', alignItems: 'center', gap: '16px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
        }}>
          {/* Avatar */}
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
            background: '#1a1a1a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '26px', fontWeight: 800, color: '#fff',
            border: '2px solid transparent',
            backgroundImage: `linear-gradient(#1a1a1a, #1a1a1a), linear-gradient(135deg, ${RED}, ${RED_DARK})`,
            backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box',
          }}>
            {user?.name?.[0]?.toUpperCase() || '👤'}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#fff', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Member'}
            </div>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '6px' }}>
              @{user?.name?.toLowerCase().replace(/\s+/g, '') || 'member'} · Member since {memberSince}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              background: isPremium ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isPremium ? '#fbbf2444' : '#3a3a3a'}`,
              borderRadius: '20px', padding: '3px 10px',
              fontSize: '10px', fontWeight: 700,
              color: isPremium ? '#fbbf24' : '#888',
            }}>
              {isPremium ? '⭐ VIP Premium' : '▶ Standard'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation with sliding indicator ── */}
      <div style={{
        maxWidth: '960px', margin: '12px auto 0', padding: '0 16px',
        position: 'relative',
      }}>
        <div style={{
          background: '#0a0a0a', border: '1px solid #1a1a1a',
          borderRadius: '12px', padding: '4px',
          position: 'relative', display: 'flex',
        }}>
          {/* Sliding pill indicator */}
          <div style={{
            position: 'absolute',
            top: '4px',
            bottom: '4px',
            left: indicatorStyle.left + 4,
            width: indicatorStyle.width - 8,
            background: `linear-gradient(135deg, ${RED}, ${RED_DARK})`,
            borderRadius: '8px',
            transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1)',
            zIndex: 0,
            boxShadow: `0 0 16px rgba(241,48,30,0.3)`,
          }} />

          {TABS.map((tab, idx) => {
            const isActive = idx === (activeIdx === -1 ? 0 : activeIdx);
            return (
              <button
                key={tab.key}
                id={`profile-tab-${tab.key}`}
                ref={el => { tabsRef.current[idx] = el; }}
                onClick={() => router.push(tab.path)}
                style={{
                  flex: 1, padding: '9px 6px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '11px', fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#fff' : '#666',
                  fontFamily: 'Poppins, sans-serif',
                  borderRadius: '8px',
                  position: 'relative', zIndex: 1,
                  transition: 'color 0.3s',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Page Content ── */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '16px 16px 120px' }}>
        {children}
      </div>
    </div>
  );
}
