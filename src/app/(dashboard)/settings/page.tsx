'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';

const RED = '#f1301e';
const RED_DARK = '#9f2315';
const CARD_BG = '#101010';
const BORDER = '#3a3a3a';
const BORDER_DARK = '#1f1f1f';

function inputStyle(disabled = false): React.CSSProperties {
  return {
    width: '100%', height: '48px', background: disabled ? '#080808' : '#0a0a0a',
    border: `1px solid ${disabled ? '#1a1a1a' : BORDER_DARK}`,
    borderRadius: '10px', padding: '0 14px', color: disabled ? '#444' : '#fff',
    fontFamily: 'Poppins, sans-serif', fontSize: '13px',
    outline: 'none', boxSizing: 'border-box',
    cursor: disabled ? 'not-allowed' : 'text',
  };
}

function SidebarProfile({ user, router }: { user: AuthUser | null; router: ReturnType<typeof useRouter> }) {
  const now = new Date();
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

  return (
    <div style={{ width: '260px', flexShrink: 0, marginRight: 'clamp(20px, 3vw, 40px)' }}>
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
            background: '#272727', border: `2px solid ${RED}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#fff',
          }}>{user?.name?.[0] || '👤'}</div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Member'}</p>
            <p style={{ fontSize: '10px', color: '#737373', marginTop: '2px' }}>Member since {months[now.getMonth()]} {now.getDate()}, {now.getFullYear()}</p>
            <p style={{ fontSize: '10px', fontWeight: 700, color: user?.tier === 'premium' ? '#fbbf24' : '#fff', marginTop: '4px' }}>
              {user?.tier === 'premium' ? 'VIP Premium' : 'Standard'}
            </p>
          </div>
        </div>

        {[
          { label: 'Watch',     path: '/home',      icon: '▶' },
          { label: 'Wallet',    path: '/wallet',    icon: '💰' },
          { label: 'Affiliate', path: '/affiliate', icon: '🤝' },
          { label: 'Setting',   path: '/settings',  icon: '⚙️' },
        ].map(item => (
          <button key={item.path} onClick={() => router.push(item.path)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '13px', color: item.path === '/settings' ? '#fff' : '#888', fontFamily: 'Poppins, sans-serif', textAlign: 'left',
            borderBottom: '1px solid #1a1a1a', transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#fff'}
            onMouseLeave={e => { if (item.path !== '/settings') (e.currentTarget as HTMLButtonElement).style.color = '#888'; }}
          >
            <span style={{ fontSize: '14px', width: '20px' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profileForm, setProfileForm] = useState({ username: '', email: '', name: '' });
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [profileSaved, setProfileSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');
  const [photoName, setPhotoName] = useState('');

  useEffect(() => {
    (async () => {
      const u = await getUser();
      setUser(u);
      if (u) setProfileForm({
        username: u.email?.split('@')[0] || '',
        email: u.email || '',
        name: u.name || '',
      });
    })();
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    try {
      const res = await fetch('/api/member/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profileForm.name }),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setUser({ ...user, name: profileForm.name });
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2500);
      }
    } catch { /* ignore */ }
  }

  function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError('');
    if (pwForm.next.length < 8) { setPwError('Password baru minimal 8 karakter'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError('Konfirmasi password tidak cocok'); return; }
    const raw = localStorage.getItem('bantuan_ordal_user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u.password && u.password !== pwForm.current) { setPwError('Password saat ini salah'); return; }
      localStorage.setItem('bantuan_ordal_user', JSON.stringify({ ...u, password: pwForm.next }));
    }
    setPwForm({ current: '', next: '', confirm: '' });
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2500);
  }

  function handleLogout() { logout(); router.replace('/login'); }

  const saveBtnStyle: React.CSSProperties = {
    width: '100%', height: '48px', borderRadius: '6px', border: 'none', marginTop: '20px',
    background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`, color: '#fff',
    fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div style={{
        display: 'flex', maxWidth: '1100px', margin: '0 auto',
        padding: 'clamp(24px, 4vw, 48px) clamp(16px, 4vw, 40px)',
        paddingBottom: '120px', alignItems: 'flex-start',
      }}>
        {/* Sidebar — hidden on mobile */}
        <div style={{ display: 'none' }} className="settings-sidebar">
          <SidebarProfile user={user} router={router} />
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ─── Foto Profile ── */}
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: 'clamp(16px, 2.5vw, 24px)', marginBottom: '20px' }}>
            <p style={{ fontSize: 'clamp(11px, 1.2vw, 14px)', fontWeight: 700, color: '#737373', letterSpacing: '1px', marginBottom: '16px' }}>Foto Profile</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
                background: '#272727', border: `2px solid ${RED}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#fff',
              }}>{user?.name?.[0] || '👤'}</div>

              <div style={{ flex: 1 }}>
                <label htmlFor="photo-upload" style={{
                  display: 'inline-block', padding: '8px 20px', borderRadius: '6px',
                  background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`, color: '#fff',
                  fontSize: '12px', fontWeight: 700, cursor: 'pointer', marginBottom: '8px',
                }}>Pilih Foto</label>
                <input id="photo-upload" type="file" accept="image/png,image/jpeg,image/webp" style={{ display: 'none' }}
                  onChange={e => setPhotoName(e.target.files?.[0]?.name || '')} />
                {photoName && <p style={{ fontSize: '11px', color: '#737373', marginBottom: '6px' }}>{photoName}</p>}
                <button style={{ display: 'block', padding: '8px 20px', borderRadius: '6px', background: '#1a1a1a', border: `1px solid ${BORDER_DARK}`, color: '#888', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                  Simpan Foto
                </button>
                <p style={{ fontSize: '10px', color: '#737373', marginTop: '6px' }}>Format : JPG, PNG, WebP, Maks 2MB</p>
              </div>
            </div>
          </div>

          {/* ─── Profile ── */}
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: 'clamp(16px, 2.5vw, 24px)', marginBottom: '20px' }}>
            <p style={{ fontSize: 'clamp(11px, 1.2vw, 14px)', fontWeight: 700, color: '#737373', letterSpacing: '1px', marginBottom: '20px' }}>Profile</p>

            <form onSubmit={saveProfile}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#737373', display: 'block', marginBottom: '7px' }}>Username</label>
                  <input id="settings-username" type="text" value={profileForm.username}
                    onChange={e => setProfileForm(p => ({ ...p, username: e.target.value }))}
                    style={inputStyle()} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#737373', display: 'block', marginBottom: '7px' }}>Email</label>
                  <input type="email" value={profileForm.email} disabled style={inputStyle(true)} />
                  <p style={{ fontSize: '10px', color: '#737373', marginTop: '4px' }}>Email tidak bisa diubah.</p>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#737373', display: 'block', marginBottom: '7px' }}>Nama Lengkap</label>
                  <input id="settings-name" type="text" value={profileForm.name}
                    onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    style={inputStyle()} />
                </div>
              </div>
              <button id="btn-save-profile" type="submit" style={saveBtnStyle}>
                {profileSaved ? '✓ Tersimpan!' : 'Simpan Profile'}
              </button>
            </form>
          </div>

          {/* ─── Ganti Password ── */}
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: 'clamp(16px, 2.5vw, 24px)', marginBottom: '20px' }}>
            <p style={{ fontSize: 'clamp(11px, 1.2vw, 14px)', fontWeight: 700, color: '#737373', letterSpacing: '1px', marginBottom: '20px' }}>Ganti Password</p>

            <form onSubmit={changePassword}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#737373', display: 'block', marginBottom: '7px' }}>Password Saat Ini</label>
                  <input id="pw-current" type="password" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} style={inputStyle()} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#737373', display: 'block', marginBottom: '7px' }}>Password Baru</label>
                  <input id="pw-new" type="password" value={pwForm.next} onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} style={inputStyle()} />
                  <p style={{ fontSize: '10px', color: '#737373', marginTop: '4px' }}>Minimal 8 Karakter</p>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#737373', display: 'block', marginBottom: '7px' }}>Konfirmasi Password Baru</label>
                  <input id="pw-confirm" type="password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} style={inputStyle()} />
                </div>
                {pwError && <p style={{ fontSize: '11px', color: '#ef4444' }}>⚠ {pwError}</p>}
              </div>
              <button id="btn-save-password" type="submit" style={saveBtnStyle}>
                {pwSaved ? '✓ Password Diperbarui!' : 'Simpan Password Baru'}
              </button>
            </form>
          </div>

          {/* ─── Delete Account (per Figma: "Permanently" + 1 button) ── */}
          <div style={{ background: CARD_BG, border: `1px solid #2a0a0a`, borderRadius: '16px', padding: 'clamp(16px, 2.5vw, 24px)', marginBottom: '20px' }}>
            <p style={{ fontSize: 'clamp(11px, 1.2vw, 14px)', fontWeight: 700, color: '#737373', letterSpacing: '1px', marginBottom: '8px' }}>Delete Account</p>
            <p style={{ fontSize: '12px', color: '#ef4444', marginBottom: '16px', fontWeight: 600 }}>Permanently</p>
            <button id="btn-delete-account" style={{
              width: '100%', height: '48px', borderRadius: '6px', border: '1px solid #ef444433',
              background: 'rgba(239,68,68,0.06)', color: '#ef4444',
              fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            }}>Delete Account</button>
          </div>

          {/* Logout */}
          <button id="btn-logout" onClick={handleLogout} style={{
            width: '100%', height: '48px', borderRadius: '14px',
            background: '#0a0a0a', border: `1px solid #2a0a0a`, cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 700, color: '#ef4444',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = '#150505'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = '#0a0a0a'}
          >
            ⬅ Keluar dari Akun
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .settings-sidebar { display: block !important; }
        }
      `}</style>
    </div>
  );
}
