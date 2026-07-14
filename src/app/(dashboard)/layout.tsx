'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';

const RED = '#f1301e';
const RED_DARK = '#9f2315';

/* ─── 4-item nav per Figma: Home, Template, Bonus, Profile ─── */
const NAV_ITEMS = [
  {
    label: 'Home',
    path: '/home',
    match: '/home',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 9.5L12 2L21 9.5V20C21 20.55 20.78 21.05 20.41 21.41C20.05 21.78 19.55 22 19 22H5C4.45 22 3.95 21.78 3.59 21.41C3.22 21.05 3 20.55 3 20V9.5Z"
          fill={active ? RED : 'none'} stroke={active ? RED : '#555'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 22V12H15V22" stroke={active ? '#fff' : '#555'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Template',
    path: '/template',
    match: '/template',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 18 18.375" fill="none">
        <rect x="0" y="0" width="18" height="18.375" rx="1.969" fill={active ? RED : '#535353'} />
        <path
          d="M5.9 5.465c.79 0 1.49.278 2.007.696.477.388.701.775.896 1.123l-1.363.695c-.097-.228-.215-.466-.516-.725-.323-.269-.653-.349-.936-.349-1.11 0-1.694 1.054-1.694 2.227 0 1.541.77 2.306 1.694 2.306.896 0 1.257-.636 1.49-1.043l1.354.706c-.253.407-.497.805-1.042 1.192-.292.21-.963.618-1.917.618-1.822 0-3.292-1.352-3.292-3.729 0-2.077 1.383-3.717 3.33-3.717zm3.033.218h1.831l1.421 4.991 1.411-4.991H15.43l-2.386 7.018H11.32L8.933 5.683z"
          fill="white"
        />
      </svg>
    ),
  },
  {
    label: 'Bonus',
    path: '/bonus',
    match: '/bonus',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
        <path
          d="M7.2 9.6V16H4c-.636 0-1.247-.253-1.697-.703C1.853 14.847 1.6 14.236 1.6 13.6v-3.2c0-.212.084-.416.234-.566C1.984 9.684 2.188 9.6 2.4 9.6h4.8zm6.4 0c.212 0 .416.084.566.234.15.15.234.354.234.566V13.6c0 .636-.253 1.247-.703 1.697C13.247 15.747 12.636 16 12 16H8.8V9.6h4.8zm-2-9.6c.472 0 .937.12 1.351.348.414.227.764.556 1.016.955.253.4.4.856.429 1.328.028.471-.063.943-.266 1.37H14.4c.424 0 .831.168 1.131.469.3.3.469.707.469 1.131V6.4c0 .424-.169.831-.469 1.131-.3.3-.707.469-1.131.469H8.8V4h-1.6v4H1.6c-.424 0-.831-.169-1.131-.469C.169 7.231 0 6.824 0 6.4V5.6c0-.424.169-.831.469-1.131C.769 4.169 1.176 4 1.6 4h.27C1.692 3.625 1.6 3.215 1.6 2.8c0-1.546 1.254-2.8 2.786-2.8C5.79-.024 7.036.874 7.891 2.348L8 2.542C8.826 1.011 10.048.051 11.433.002L11.6 0zm-4 1.6c-.318 0-.623.127-.848.352-.225.225-.352.53-.352.848s.127.623.352.848c.225.225.53.352.848.352H9.086C8.493 2.476 7.527 1.584 6.571 1.6zm5.015 0C10.641 1.584 9.678 2.477 9.086 4h2.514c.318-.002.622-.13.846-.354.224-.223.349-.528.347-.846-.002-.318-.13-.622-.353-.846C12.216 1.73 11.911 1.605 11.586 1.6z"
          fill={active ? RED : '#535353'}
        />
      </svg>
    ),
  },
  {
    label: 'Profile',
    path: '/profile',
    match: '/profile',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
        <path
          d="M15.833 17.5v-1.667c0-.884-.351-1.732-.976-2.357C14.232 12.851 13.384 12.5 12.5 12.5h-5c-.884 0-1.732.351-2.357.976C4.518 14.101 4.167 14.949 4.167 15.833V17.5"
          stroke={active ? RED : '#535353'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M13.333 5.833c0 1.841-1.492 3.334-3.333 3.334-1.841 0-3.333-1.493-3.333-3.334C6.667 3.992 8.159 2.5 10 2.5c1.841 0 3.333 1.492 3.333 3.333z"
          stroke={active ? RED : '#535353'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router    = useRouter();
  const pathname  = usePathname();
  const [mounted, setMounted]       = useState(false);
  const [user, setUser]             = useState<AuthUser | null>(null);
  const [dropdownOpen, setDropdown] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    (async () => {
      const u = await getUser();
      if (!u) { router.replace('/login'); return; }
      setUser(u);
    })();
  }, [router]);

  /* Close dropdown on outside click */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  if (!mounted) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: '#000', overflow: 'hidden', width: '100%' }}>

      {/* ── GLOBAL HEADER BAR (per Figma — all pages) ─── */}
      <header style={{
        height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px, 4vw, 40px)', background: '#000',
        position: 'sticky', top: 0, zIndex: 50, flexShrink: 0,
      }}>
        {/* Logo */}
        <img
          src="/design/home/images/5057f55df3a0654d35ba33b5c7d724680455ffc1.png"
          alt="Bantuan Ordal"
          style={{ height: '18px', objectFit: 'contain' }}
          onError={e => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).insertAdjacentHTML('afterend',
              `<span style="font-size:14px;font-weight:800;color:#fff"><span style="color:${RED}">Bantuan</span> Ordal+</span>`);
          }}
        />

        {/* Center: bell icon */}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#4b4b4b' }}>
          <svg width="19" height="19" viewBox="0 0 14.15 17.27" fill="currentColor">
            <path d="M7.076 0C5.606 0 4.197.584 3.158 1.623 2.118 2.662 1.534 4.072 1.534 5.542V8.335c0 .123-.028.244-.083.354L.092 11.406a1.19 1.19 0 00.779 1.261h12.41a1.19 1.19 0 00.779-1.261l-1.359-2.717a.74.74 0 01-.083-.354V5.542C12.618 4.072 12.034 2.662 10.995 1.623 9.955.584 8.546 0 7.076 0zM7.076 15.042a2.37 2.37 0 01-1.372-.436 2.37 2.37 0 01-.868-.848h4.481a2.37 2.37 0 01-.869.848 2.37 2.37 0 01-1.372.436z" />
          </svg>
        </button>

        {/* Right: Welcome + name + avatar + dropdown */}
        <div ref={dropRef} style={{ position: 'relative' }}>
          <button
            id="user-dropdown-trigger"
            onClick={() => setDropdown(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '7px', fontWeight: 500, color: '#4b4b4b', lineHeight: 1 }}>Welcome</div>
              <div style={{
                fontSize: '9px', fontWeight: 500, lineHeight: 1.2,
                background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{user?.name ? (user.name.length > 12 ? user.name.substring(0, 12) + '...' : user.name) : 'Member'}</div>
            </div>
            <div style={{
              width: '27px', height: '27px', borderRadius: '50%',
              background: '#272727',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', color: '#fff',
              border: '1.5px solid transparent',
              backgroundImage: `linear-gradient(#272727, #272727), linear-gradient(90deg, ${RED}, ${RED_DARK})`,
              backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box',
              flexShrink: 0,
            }}>
              {user?.name?.[0]?.toUpperCase() || '👤'}
            </div>
            {/* Dropdown arrow */}
            <svg
              width="6" height="4" viewBox="0 0 5 3.74" fill="#4b4b4b"
              style={{ transform: dropdownOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s', flexShrink: 0 }}
            >
              <path d="M.25 3.743h4.5a.25.25 0 00.222-.363L2.706.1a.25.25 0 00-.41 0L.044 3.351a.25.25 0 00.206.392z" />
            </svg>
          </button>

          {/* Dropdown menu — per Figma node 6363:174 */}
          {dropdownOpen && (
            <div id="user-dropdown-menu" style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: '#141414', borderRadius: '16px',
              border: '1px solid #282828', padding: '16px',
              minWidth: '180px', zIndex: 200,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}>
              {/* User info */}
              <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #282828' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>
                  {user?.name || 'Member'}
                </div>
                <div style={{ fontSize: '10px', color: '#555' }}>
                  @{user?.name?.toLowerCase().replace(/\s+/g, '') || 'member'}
                </div>
              </div>

              {/* Menu items */}
              {[
                { icon: '👤', label: 'Profile', action: () => { router.push('/profile'); setDropdown(false); } },
                { icon: '✏️', label: 'Bikin CV', action: () => { router.push('/template'); setDropdown(false); } },
                { icon: '🔍', label: 'Review CV', action: () => { router.push('/template'); setDropdown(false); } },
                { icon: '💬', label: 'Support', action: () => { setDropdown(false); } },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '10px 8px', borderRadius: '8px', textAlign: 'left',
                    color: '#ccc', fontSize: '12px', fontFamily: 'Poppins, sans-serif',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1e1e1e')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}

              {/* Sign out */}
              <div style={{ borderTop: '1px solid #282828', marginTop: '8px', paddingTop: '8px' }}>
                <button
                  id="btn-signout"
                  onClick={handleLogout}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '10px 8px', borderRadius: '8px', textAlign: 'left',
                    color: RED, fontSize: '12px', fontFamily: 'Poppins, sans-serif',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(241,48,30,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <span>🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Gradient red line under header (Figma) */}
      <div style={{
        height: '0.5px', width: '100%', flexShrink: 0,
        background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
      }} />

      {/* Page content */}
      <div style={{ width: '100%', flex: 1, position: 'relative', background: '#000', paddingBottom: '100px', overflowY: 'auto', overflowX: 'hidden' }}>
        {children}

        {/* ── Bottom Navigation — 4 items, floating rounded (Figma) ── */}
        <nav
          aria-label="Navigasi utama"
          style={{
            position: 'fixed',
            bottom: 'clamp(12px, 2vw, 24px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(calc(100% - 40px), 400px)',
            height: '60px',
            background: 'linear-gradient(180deg, #1b1b1b 0%, #141414 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'space-around',
            zIndex: 100,
            boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
            border: '1px solid #2a2a2a',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.match);
            return (
              <button
                key={item.path}
                id={`nav-${item.label.toLowerCase()}`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => router.push(item.path)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px 4px',
                  position: 'relative',
                  transition: 'opacity 0.15s',
                }}
              >
                {item.icon(isActive)}

                <span style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '9px',
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? RED : '#555',
                  transition: 'color 0.2s',
                  letterSpacing: '0.3px',
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
