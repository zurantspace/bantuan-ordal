'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

const NAV_ITEMS = [
  { icon: '🏠', label: 'Home',      path: '/home',      matchPaths: ['/home'] },
  { icon: '▶️', label: 'Kelas',     path: '/watch/1',   matchPaths: ['/watch'] },
  { icon: '🎁', label: 'Bonus',     path: '/bonus',     matchPaths: ['/bonus'] },
  { icon: '🤝', label: 'Affiliate', path: '/affiliate', matchPaths: ['/affiliate', '/wallet'] },
  { icon: '⚙️', label: 'Settings',  path: '/settings',  matchPaths: ['/settings'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) router.replace('/login');
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="dashboard-shell">
      <div className="dashboard-container">
        {children}

        {/* Bottom Navigation – spans full viewport width */}
        <nav
          className="dashboard-nav-bar"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '72px',
            backgroundColor: '#111',
            borderTop: '0.5px solid #2a2a2a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            zIndex: 100,
            paddingBottom: 'env(safe-area-inset-bottom, 8px)',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = item.matchPaths.some(p => pathname.startsWith(p));
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 16px',
                  flex: 1,
                }}
              >
                <span style={{ fontSize: '22px', lineHeight: 1 }}>{item.icon}</span>
                <span style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '10px',
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? '#f1301e' : '#555',
                  transition: 'color 0.2s',
                }}>
                  {item.label}
                </span>
                {isActive && (
                  <div style={{
                    width: '4px', height: '4px',
                    borderRadius: '50%',
                    background: 'linear-gradient(90deg, #f1301e, #9f2315)',
                  }} />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
