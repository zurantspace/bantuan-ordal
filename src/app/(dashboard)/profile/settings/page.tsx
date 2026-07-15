'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';

const RED      = '#f1301e';
const RED_DARK = '#9f2315';
const CARD_BG  = '#101010';
const BORDER   = '#3a3a3a';
const BORDER_MID = '#3a3a3a';


function inputStyle(focused = false, disabled = false): React.CSSProperties {
  return {
    width: '100%', height: '48px',
    background: disabled ? '#0a0a0a' : '#101010',
    border: `1px solid ${focused ? RED + '88' : BORDER_MID}`,
    borderRadius: '8px', padding: '0 14px',
    color: disabled ? '#767676' : '#fff',
    fontFamily: 'Poppins, sans-serif', fontSize: '14px',
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
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '20px 20px 20px' }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>Foto Profile</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{
            width: '82px', height: '82px', borderRadius: '50%', flexShrink: 0,
            background: '#212121',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: '#fff',
          }}>
            {user?.name?.[0]?.toUpperCase() || '👤'}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="photo-upload" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '8px',
              background: '#2a2a2a', border: `1px solid ${BORDER}`,
              color: '#b7b7b7', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              width: 'fit-content',
            }}>Pilih Foto</label>
            <input id="photo-upload" type="file" accept="image/png,image/jpeg,image/webp" style={{ display: 'none' }}
              onChange={e => setPhotoName(e.target.files?.[0]?.name || '')} />
            {photoName && <p style={{ fontSize: '10px', color: '#555' }}>{photoName}</p>}
          </div>
        </div>
        <button style={{
          marginTop: '16px', height: '33px', padding: '0 20px', borderRadius: '8px', border: 'none',
          background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
          color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
        }}>Simpan Foto</button>
      </div>

      {/* ── Profile Form ── */}
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '20px' }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '18px' }}>Profile</p>
        <form onSubmit={saveProfile}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#767676', display: 'block', marginBottom: '8px' }}>Username</label>
              <input type="text" value={user?.email?.split('@')[0] || ''} disabled style={inputStyle(false, true)} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#767676', display: 'block', marginBottom: '8px' }}>Nama Lengkap</label>
              <input
                id="settings-name" type="text" value={profileForm.name}
                onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                style={inputStyle(focusedField === 'name')}
              />
            </div>
          </div>
          <button id="btn-save-profile" type="submit" disabled={profileLoading} style={{
            height: '33px', padding: '0 20px', borderRadius: '8px', border: 'none', marginTop: '18px',
            background: profileLoading ? '#333' : `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
            color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '12px', fontWeight: 600,
            cursor: profileLoading ? 'not-allowed' : 'pointer',
          }}>
            {profileSaved ? '✓ Tersimpan!' : profileLoading ? '⏳ Menyimpan...' : 'Simpan Profile'}
          </button>
        </form>
      </div>

      {/* ── Email Card ── */}
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '20px' }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '18px' }}>Email</p>
        <input type="email" value={profileForm.email} disabled style={inputStyle(false, true)} />
        <p style={{ fontSize: '11px', fontWeight: 400, color: '#767676', marginTop: '6px' }}>Email tidak bisa diubah.</p>
      </div>

      {/* ── Change Password ── */}
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '20px' }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '18px' }}>Ganti Password</p>
        <form onSubmit={changePassword}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { id: 'pw-current', label: 'Password Saat Ini',       key: 'current', hint: '' },
              { id: 'pw-new',     label: 'Password Baru',           key: 'next',    hint: 'Minimal 8 Karakter' },
              { id: 'pw-confirm', label: 'Konfirmasi Password Baru', key: 'confirm', hint: '' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#767676', display: 'block', marginBottom: '8px' }}>{f.label}</label>
                <input
                  id={f.id}
                  type="password"
                  value={pwForm[f.key as keyof typeof pwForm]}
                  onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                  onFocus={() => setFocusedField(f.key)}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle(focusedField === f.key)}
                />
                {f.hint && <p style={{ fontSize: '10px', fontWeight: 300, color: '#767676', marginTop: '4px' }}>{f.hint}</p>}
              </div>
            ))}
            {pwError && <p style={{ fontSize: '11px', color: '#ef4444' }}>⚠ {pwError}</p>}
          </div>
          <button id="btn-save-password" type="submit" style={{
            height: '33px', padding: '0 20px', borderRadius: '8px', border: 'none', marginTop: '18px',
            background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
            color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
          }}>
            {pwSaved ? '✓ Password Diperbarui!' : 'Simpan Password Baru'}
          </button>
        </form>
      </div>

      {/* ── Danger Zone / Delete Account ── */}
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '2px' }}>Delete Account</p>
            <p style={{ fontSize: '12px', color: '#767676' }}>Permanently</p>
          </div>
          <button id="btn-delete-account" style={{
            height: '35px', padding: '0 24px', borderRadius: '8px',
            border: 'none',
            background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
            color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
          }}>Delete Account</button>
        </div>
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
