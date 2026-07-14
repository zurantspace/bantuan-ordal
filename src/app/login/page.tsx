'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, getUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const u = await getUser();
      if (u) router.replace('/home');
    })();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Email dan password wajib diisi');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) {
      router.replace('/home');
    } else {
      setError(result.message || 'Email atau password salah');
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(241,48,30,0.2) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(241,48,30,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <img
            src="/images/5057f55df3a0654d35ba33b5c7d724680455ffc1.png"
            alt="Bantuan Ordal"
            style={{ height: '24px', objectFit: 'contain', marginBottom: '12px' }}
          />
          <div style={{ height: '0.5px', width: '100%', background: 'linear-gradient(90deg, transparent, #f1301e, transparent)' }} />
        </div>

        {/* Greeting */}
        <div style={{ width: '100%', marginBottom: '28px' }}>
          <h1 style={{
            fontFamily: 'Poppins, sans-serif', fontSize: '22px', fontWeight: 700,
            color: '#fff', margin: '0 0 4px 0',
          }}>
            Selamat Datang 👋
          </h1>
          <p style={{
            fontFamily: 'Poppins, sans-serif', fontSize: '12px', color: '#666',
            margin: 0, lineHeight: '1.5',
          }}>
            Masuk untuk melanjutkan perjalanan kariermu.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div style={{
            border: '1px solid #2a2a2a',
            borderRadius: '18px',
            backgroundColor: '#0d0d0d',
            padding: '24px',
            marginBottom: '16px',
          }}>
            {/* Email */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{
                fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: 700,
                color: '#fff', display: 'block', marginBottom: '6px',
              }}>Email</label>
              <div style={{
                border: `0.5px solid ${error && !form.email ? '#ef1f1f' : '#3a3a3a'}`,
                borderRadius: '8px', backgroundColor: '#0a0a0a',
                height: '40px', display: 'flex', alignItems: 'center', padding: '0 12px',
              }}>
                <span style={{ marginRight: '8px', opacity: 0.5 }}>✉️</span>
                <input
                  type="email"
                  placeholder="email@kamu.com"
                  value={form.email}
                  onChange={e => setForm(p => ({...p, email: e.target.value}))}
                  style={{
                    background: 'transparent', border: 'none', outline: 'none',
                    color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '12px', width: '100%',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '6px' }}>
              <label style={{
                fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: 700,
                color: '#fff', display: 'block', marginBottom: '6px',
              }}>Password</label>
              <div style={{
                border: `0.5px solid ${error ? '#ef1f1f' : '#3a3a3a'}`,
                borderRadius: '8px', backgroundColor: '#0a0a0a',
                height: '40px', display: 'flex', alignItems: 'center', padding: '0 12px',
              }}>
                <span style={{ marginRight: '8px', opacity: 0.5 }}>🔒</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({...p, password: e.target.value}))}
                  style={{
                    background: 'transparent', border: 'none', outline: 'none',
                    color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '12px', width: '100%',
                  }}
                />
              </div>
            </div>

            {error && (
              <p style={{ color: '#ef1f1f', fontSize: '10px', marginBottom: '10px', marginTop: '6px' }}>{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: '46px', borderRadius: '12px', marginTop: '14px',
                background: loading ? '#333' : 'linear-gradient(90deg, #f1301e, #9f2315)',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 700,
                color: '#fff',
                boxShadow: '0 0 20px rgba(241,48,30,0.3)',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading ? '⏳ Masuk...' : '🚀 Masuk ke Member Area'}
            </button>
          </div>

          {/* Demo hint */}
          <div style={{
            border: '1px solid #1a1a1a',
            borderRadius: '10px',
            backgroundColor: '#080808',
            padding: '12px',
            marginBottom: '16px',
          }}>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '9px', color: '#444', margin: 0, lineHeight: '1.6' }}>
              💡 <strong style={{ color: '#666' }}>Demo:</strong> Gunakan email <code style={{ color: '#f1301e' }}>demo@bantuanordal.com</code> dan password <code style={{ color: '#f1301e' }}>demo1234</code> untuk login demo, atau daftar melalui{' '}
              <button
                type="button"
                onClick={() => router.push('/checkout')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f1301e', fontFamily: 'Poppins, sans-serif', fontSize: '9px', padding: 0 }}
              >
                halaman checkout
              </button>.
            </p>
          </div>
        </form>

        {/* Footer */}
        <p style={{
          fontFamily: 'Poppins, sans-serif', fontSize: '9px', color: '#333',
          textAlign: 'center',
        }}>
          Belum punya akun?{' '}
          <button
            onClick={() => router.push('/checkout')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f1301e', fontFamily: 'Poppins, sans-serif', fontSize: '9px', fontWeight: 700, padding: 0 }}
          >
            Daftar di sini →
          </button>
        </p>
      </div>
    </div>
  );
}
