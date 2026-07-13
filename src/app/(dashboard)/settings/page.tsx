'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';
import ScaledIframeCanvas from '@/app/components/ScaledIframeCanvas';

const CANVAS_WIDTH  = 393;
const CANVAS_HEIGHT = 1767;

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');
  const [modal, setModal] = useState<'profile' | 'password' | null>(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    if (u) setForm({ name: u.name, email: u.email, phone: u.phone });
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && typeof window !== 'undefined') {
      const updated = { ...user, ...form };
      localStorage.setItem('bantuan_ordal_user', JSON.stringify(updated));
      setUser(updated);
      setSaved(true);
      setTimeout(() => { setSaved(false); setModal(null); }, 1500);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (passwords.new.length < 8) { setPwError('Password minimal 8 karakter'); return; }
    if (passwords.new !== passwords.confirm) { setPwError('Password tidak cocok'); return; }
    setPwSaved(true);
    setPasswords({ current: '', new: '', confirm: '' });
    setTimeout(() => { setPwSaved(false); setModal(null); }, 1500);
  };

  const handleLogout = () => { logout(); router.replace('/login'); };

  const INPUT_STYLE: React.CSSProperties = {
    width: '100%', height: '40px', borderRadius: '10px',
    border: '1px solid #3a3a3a', background: '#0a0a0a',
    color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '13px',
    padding: '0 12px', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <>
      <ScaledIframeCanvas
        src="/design/settings/index.html"
        canvasWidth={CANVAS_WIDTH}
        canvasHeight={CANVAS_HEIGHT}
      >
        {/* Profile form area click target */}
        <button id="btn-edit-profile" onClick={() => setModal('profile')}
          style={{ position: 'absolute', top: 280, left: 20, width: 353, height: 400, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label="Edit Profil" />

        {/* Password form area */}
        <button id="btn-edit-password" onClick={() => setModal('password')}
          style={{ position: 'absolute', top: 760, left: 20, width: 353, height: 350, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label="Ganti Password" />

        {/* Logout */}
        <button id="btn-logout" onClick={handleLogout}
          style={{ position: 'absolute', top: 1640, left: 20, width: 353, height: 60, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label="Keluar" />

        {/* Nav bar handled by (dashboard)/layout.tsx — no duplicate overlay needed */}
      </ScaledIframeCanvas>

      {/* ══ Profile Edit Modal ══ */}
      {modal === 'profile' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '480px', background: '#0d0d0d', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px 20px 40px', border: '1px solid #2a2a2a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>Edit Profil</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <form onSubmit={handleSaveProfile}>
              {[
                { label: 'Nama Lengkap', key: 'name' as const, type: 'text', ph: 'Nama kamu' },
                { label: 'Email', key: 'email' as const, type: 'email', ph: 'email@kamu.com' },
                { label: 'Nomor WhatsApp', key: 'phone' as const, type: 'tel', ph: '08xxxxxxxxx' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '14px' }}>
                  <label style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: 700, color: '#fff', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={INPUT_STYLE} />
                </div>
              ))}
              <button type="submit" style={{
                width: '100%', height: '44px', borderRadius: '12px', marginTop: '8px',
                background: saved ? '#4ade80' : 'linear-gradient(90deg, #f1301e, #9f2315)',
                border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff',
              }}>{saved ? '✓ Tersimpan!' : 'Simpan Profil'}</button>
            </form>
          </div>
        </div>
      )}

      {/* ══ Password Modal ══ */}
      {modal === 'password' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '480px', background: '#0d0d0d', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px 20px 40px', border: '1px solid #2a2a2a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>Ganti Password</h2>
              <button onClick={() => { setModal(null); setPwError(''); }} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <form onSubmit={handleChangePassword}>
              {[
                { label: 'Password Saat Ini', key: 'current' as const, ph: '••••••••' },
                { label: 'Password Baru', key: 'new' as const, ph: 'Min. 8 karakter' },
                { label: 'Konfirmasi Password Baru', key: 'confirm' as const, ph: '••••••••' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '14px' }}>
                  <label style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: 700, color: '#fff', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                  <input type="password" placeholder={f.ph} value={passwords[f.key]}
                    onChange={e => setPasswords(p => ({ ...p, [f.key]: e.target.value }))}
                    style={INPUT_STYLE} />
                </div>
              ))}
              {pwError && <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#ef4444', marginBottom: '10px' }}>⚠️ {pwError}</p>}
              <button type="submit" style={{
                width: '100%', height: '44px', borderRadius: '12px', marginTop: '8px',
                background: pwSaved ? '#166534' : 'linear-gradient(90deg, #f1301e, #9f2315)',
                border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff',
              }}>{pwSaved ? '✓ Password Diperbarui!' : 'Ganti Password'}</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
