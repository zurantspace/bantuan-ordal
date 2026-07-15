'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';

const RED = '#f1301e';
const RED_DARK = '#9f2315';
const CARD_BG = '#0d0d0d';
const BORDER = '#282828';
const BORDER_MID = '#1f1f1f';

function inputStyle(focused = false, disabled = false): React.CSSProperties {
  return {
    width: '100%', height: '48px',
    background: disabled ? '#080808' : '#0a0a0a',
    border: `1px solid ${focused ? RED + '55' : disabled ? '#111' : BORDER_MID}`,
    borderRadius: '12px', padding: '0 14px',
    color: disabled ? '#444' : '#fff',
    fontFamily: 'Poppins, sans-serif', fontSize: '13px',
    outline: 'none', boxSizing: 'border-box',
    cursor: disabled ? 'not-allowed' : 'text',
    transition: 'border-color 0.2s',
  };
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const u = await getUser();
      setUser(u);
      if (u) setProfileForm({ name: u.name || '', email: u.email || '' });
    })();
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setProfileLoading(true);
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
    finally { setProfileLoading(false); }
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

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── Photo Card ── */}
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '20px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: '#555', letterSpacing: '1px', marginBottom: '16px' }}>FOTO PROFIL</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%', flexShrink: 0,
            background: '#1a1a1a', border: '2px solid transparent',
            backgroundImage: `linear-gradient(#1a1a1a, #1a1a1a), linear-gradient(135deg, ${RED}, ${RED_DARK})`,
            backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#fff',
          }}>
            {user?.name?.[0]?.toUpperCase() || '👤'}
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="photo-upload" style={{
              display: 'inline-block', padding: '8px 20px', borderRadius: '8px',
              background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
              color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer', marginBottom: '6px',
            }}>Pilih Foto</label>
            <input id="photo-upload" type="file" accept="image/png,image/jpeg,image/webp" style={{ display: 'none' }}
              onChange={e => setPhotoName(e.target.files?.[0]?.name || '')} />
            {photoName && <p style={{ fontSize: '10px', color: '#555', marginBottom: '6px' }}>{photoName}</p>}
            <p style={{ fontSize: '10px', color: '#555' }}>Format: JPG, PNG, WebP · Maks 2MB</p>
          </div>
        </div>
      </div>

      {/* ── Profile Form ── */}
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '20px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: '#555', letterSpacing: '1px', marginBottom: '18px' }}>PROFIL</p>
        <form onSubmit={saveProfile}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Nama Lengkap</label>
              <input
                id="settings-name" type="text" value={profileForm.name}
                onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                style={inputStyle(focusedField === 'name')}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>Email</label>
              <input type="email" value={profileForm.email} disabled style={inputStyle(false, true)} />
              <p style={{ fontSize: '10px', color: '#444', marginTop: '4px' }}>Email tidak bisa diubah.</p>
            </div>
          </div>
          <button id="btn-save-profile" type="submit" disabled={profileLoading} style={{
            width: '100%', height: '48px', borderRadius: '60px', border: 'none', marginTop: '18px',
            background: profileLoading ? '#333' : `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
            color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 700,
            cursor: profileLoading ? 'not-allowed' : 'pointer',
          }}>
            {profileSaved ? '✓ Profil Tersimpan!' : profileLoading ? '⏳ Menyimpan...' : 'Simpan Profil'}
          </button>
        </form>
      </div>

      {/* ── Change Password ── */}
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '20px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: '#555', letterSpacing: '1px', marginBottom: '18px' }}>GANTI PASSWORD</p>
        <form onSubmit={changePassword}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { id: 'pw-current', label: 'Password Saat Ini',    key: 'current', hint: '' },
              { id: 'pw-new',     label: 'Password Baru',         key: 'next',    hint: 'Minimal 8 karakter' },
              { id: 'pw-confirm', label: 'Konfirmasi Password Baru', key: 'confirm', hint: '' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                <input
                  id={f.id}
                  type="password"
                  value={pwForm[f.key as keyof typeof pwForm]}
                  onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                  onFocus={() => setFocusedField(f.key)}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle(focusedField === f.key)}
                />
                {f.hint && <p style={{ fontSize: '10px', color: '#444', marginTop: '4px' }}>{f.hint}</p>}
              </div>
            ))}
            {pwError && <p style={{ fontSize: '11px', color: '#ef4444' }}>⚠ {pwError}</p>}
          </div>
          <button id="btn-save-password" type="submit" style={{
            width: '100%', height: '48px', borderRadius: '60px', border: 'none', marginTop: '18px',
            background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
            color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
          }}>
            {pwSaved ? '✓ Password Diperbarui!' : 'Simpan Password Baru'}
          </button>
        </form>
      </div>

      {/* ── Danger Zone ── */}
      <div style={{ background: 'rgba(239,68,68,0.03)', border: '1px solid #ef444422', borderRadius: '16px', padding: '20px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, color: '#ef4444', letterSpacing: '1px', marginBottom: '6px' }}>DANGER ZONE</p>
        <p style={{ fontSize: '12px', color: '#555', marginBottom: '16px' }}>
          Menghapus akun bersifat permanen dan tidak dapat dibatalkan.
        </p>
        <button id="btn-delete-account" style={{
          width: '100%', height: '44px', borderRadius: '12px',
          border: '1px solid #ef444433', background: 'rgba(239,68,68,0.06)',
          color: '#ef4444', fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
        }}>
          Hapus Akun
        </button>
      </div>

      {/* ── Logout ── */}
      <button
        id="btn-logout"
        onClick={handleLogout}
        style={{
          width: '100%', height: '48px', borderRadius: '14px',
          background: '#0a0a0a', border: '1px solid #1a0505',
          color: '#ef4444', fontFamily: 'Poppins, sans-serif',
          fontSize: '13px', fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#150505')}
        onMouseLeave={e => (e.currentTarget.style.background = '#0a0a0a')}
      >
        ⬅ Keluar dari Akun
      </button>
    </div>
  );
}
