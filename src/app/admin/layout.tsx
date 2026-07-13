'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard',  path: '/admin/dashboard' },
  { icon: '🛒', label: 'Orders',     path: '/admin/orders' },
  { icon: '👥', label: 'Users',      path: '/admin/users' },
  { icon: '🚪', label: 'Abandoned',  path: '/admin/abandoned' },
  { icon: '🎬', label: 'Konten',     path: '/admin/content' },
  { icon: '🏷️', label: 'Promo',      path: '/admin/promo' },
  { icon: '🤝', label: 'Affiliate',  path: '/admin/affiliate' },
  { icon: '📈', label: 'Analytics',  path: '/admin/analytics' },
  { icon: '⚙️', label: 'Pengaturan', path: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{
      display: 'flex', minHeight: '100dvh', background: '#050505',
      fontFamily: 'Poppins, sans-serif',
    }}>
      {/* ── Sidebar (desktop) ── */}
      <aside style={{
        width: '220px', flexShrink: 0,
        background: '#080808', borderRight: '1px solid #1a1a1a',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100dvh',
      }}
        className="admin-sidebar"
      >
        {/* Logo */}
        <div style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid #1a1a1a',
        }}>
          <div style={{
            fontSize: '13px', fontWeight: 800, color: '#f1301e', letterSpacing: '1px',
          }}>
            BANTUAN ORDAL
          </div>
          <div style={{ fontSize: '9px', color: '#444', marginTop: '2px' }}>
            Admin Dashboard
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
            return (
              <button
                key={item.path}
                onClick={() => { router.push(item.path); setMobileOpen(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '10px', marginBottom: '2px',
                  background: isActive
                    ? 'linear-gradient(90deg, rgba(241,48,30,0.15), rgba(159,35,21,0.1))'
                    : 'transparent',
                  border: isActive ? '1px solid rgba(241,48,30,0.3)' : '1px solid transparent',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: '15px', flexShrink: 0 }}>{item.icon}</span>
                <span style={{
                  fontSize: '12px', fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#f1301e' : '#666',
                  transition: 'color 0.15s',
                }}>
                  {item.label}
                </span>
                {isActive && (
                  <div style={{
                    marginLeft: 'auto', width: '4px', height: '4px', borderRadius: '50%',
                    background: '#f1301e', flexShrink: 0,
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #1a1a1a' }}>
          <button
            onClick={() => router.push('/login')}
            style={{
              width: '100%', height: '36px', borderRadius: '8px',
              background: 'transparent', border: '1px solid #2a2a2a',
              cursor: 'pointer', color: '#555', fontSize: '11px', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            🚪 Keluar
          </button>
        </div>
      </aside>

      {/* ── Mobile Drawer Overlay ── */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.85)',
          }}
          onClick={() => setMobileOpen(false)}
        >
          <aside
            style={{
              width: '240px', height: '100%',
              background: '#080808', borderRight: '1px solid #1a1a1a',
              display: 'flex', flexDirection: 'column',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #1a1a1a' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#f1301e' }}>BANTUAN ORDAL</div>
              <div style={{ fontSize: '9px', color: '#444', marginTop: '2px' }}>Admin Dashboard</div>
            </div>
            <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
              {NAV_ITEMS.map(item => {
                const isActive = pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => { router.push(item.path); setMobileOpen(false); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px', borderRadius: '10px', marginBottom: '2px',
                      background: isActive ? 'rgba(241,48,30,0.15)' : 'transparent',
                      border: isActive ? '1px solid rgba(241,48,30,0.3)' : '1px solid transparent',
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: '15px' }}>{item.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: isActive ? 700 : 500, color: isActive ? '#f1301e' : '#666' }}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Top bar (mobile) */}
        <header style={{
          height: '56px', background: '#080808', borderBottom: '1px solid #1a1a1a',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', flexShrink: 0,
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <button
            onClick={() => setMobileOpen(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#fff', fontSize: '18px', padding: '4px',
              fontFamily: 'Poppins, sans-serif',
            }}
            className="admin-menu-btn"
          >☰</button>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#888' }}>
            {NAV_ITEMS.find(i => pathname.startsWith(i.path))?.label ?? 'Admin'}
          </div>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #f1301e, #9f2315)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px',
          }}>
            👤
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', background: '#050505' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .admin-sidebar { display: flex !important; }
          .admin-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .admin-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}
