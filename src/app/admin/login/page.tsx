'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin, getUser } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const u = await getUser();
      if (u && u.role === 'ADMIN') router.replace('/admin/dashboard');
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
    const result = await loginAdmin(form.email, form.password);
    if (result.success) {
      router.replace('/admin/dashboard');
    } else {
      setError(result.message || 'Email atau password admin salah');
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#050505',
      fontFamily: 'Poppins, sans-serif',
      color: '#fff',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#0d0d0d',
        border: '1px solid #1a1a1a',
        borderRadius: '16px',
        padding: '32px 24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{
            fontSize: '18px',
            fontWeight: 800,
            color: '#f1301e',
            letterSpacing: '1px',
          }}>
            BANTUAN ORDAL
          </span>
          <div style={{ fontSize: '10px', color: '#555', marginTop: '4px' }}>
            Portal Login Administrator
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239,31,31,0.1)',
            border: '1px solid #ef1f1f',
            borderRadius: '8px',
            padding: '10px 12px',
            fontSize: '11px',
            color: '#ef1f1f',
            marginBottom: '20px',
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email field */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              color: '#888',
              marginBottom: '6px',
            }}>
              Email Admin
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="admin@bantuanordal.com"
              style={{
                width: '100%',
                height: '42px',
                backgroundColor: '#050505',
                border: '1px solid #222',
                borderRadius: '8px',
                padding: '0 12px',
                color: '#fff',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>

          {/* Password field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              color: '#888',
              marginBottom: '6px',
            }}>
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
              style={{
                width: '100%',
                height: '42px',
                backgroundColor: '#050505',
                border: '1px solid #222',
                borderRadius: '8px',
                padding: '0 12px',
                color: '#fff',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '44px',
              borderRadius: '8px',
              background: loading ? '#333' : 'linear-gradient(90deg, #f1301e, #9f2315)',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: 'inherit',
              boxShadow: '0 4px 12px rgba(241,48,30,0.2)',
            }}
          >
            {loading ? 'Masuk...' : 'Masuk ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
