'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { registerFromCheckout, captureUTM } from '@/lib/auth';

// Checkout HTML canvas: 393×1755px
const CANVAS_HEIGHT = 1755;

function CheckoutFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUpgradeFromQuery = searchParams.get('upgrade') === '1';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [orderBump, setOrderBump] = useState(isUpgradeFromQuery);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes countdown
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    captureUTM();
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m} : ${s}`;
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Nama wajib diisi';
    if (!form.email.trim() || !form.email.includes('@')) errs.email = 'Email tidak valid';
    if (!form.phone.trim() || form.phone.length < 10) errs.phone = 'Nomor WA tidak valid';
    if (!form.password || form.password.length < 8) errs.password = 'Password minimal 8 karakter';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    registerFromCheckout(form.name, form.email, form.phone, form.password);
    router.push('/thank-you');
  };

  const inputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '11px',
    fontWeight: 400,
    width: '100%',
    height: '100%',
    padding: '0 10px',
    boxSizing: 'border-box',
  };

  return (
    <form onSubmit={handleSubmit} style={{
      position: 'absolute', top: 0, left: 0,
      width: '393px', height: `${CANVAS_HEIGHT}px`,
    }}>
      {/* Countdown Timer */}
      <div style={{
        position: 'absolute', top: '353px', left: '235px', width: '60px', height: '18px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Poppins, sans-serif', fontSize: '9px', fontWeight: 700, color: '#f1301e',
        pointerEvents: 'none',
      }}>
        {formatTime(timeLeft)}
      </div>

      {/* Input: Nama Lengkap */}
      <div style={{
        position: 'absolute', top: '468px', left: '66px', width: '259px', height: '32px',
        border: errors.name ? '1px solid #ef4444' : 'none', borderRadius: '6px'
      }}>
        <input
          type="text"
          value={form.name}
          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          style={inputStyle}
          placeholder=""
        />
      </div>

      {/* Input: Email */}
      <div style={{
        position: 'absolute', top: '525px', left: '66px', width: '259px', height: '32px',
        border: errors.email ? '1px solid #ef4444' : 'none', borderRadius: '6px'
      }}>
        <input
          type="email"
          value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          style={inputStyle}
          placeholder=""
        />
      </div>

      {/* Input: WA */}
      <div style={{
        position: 'absolute', top: '582px', left: '66px', width: '259px', height: '32px',
        border: errors.phone ? '1px solid #ef4444' : 'none', borderRadius: '6px'
      }}>
        <input
          type="tel"
          value={form.phone}
          onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
          style={inputStyle}
          placeholder=""
        />
      </div>

      {/* Input: Password */}
      <div style={{
        position: 'absolute', top: '642px', left: '66px', width: '259px', height: '32px',
        border: errors.password ? '1px solid #ef4444' : 'none', borderRadius: '6px'
      }}>
        <input
          type="password"
          value={form.password}
          onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          style={inputStyle}
          placeholder=""
        />
      </div>

      {/* Toggle Order Bump */}
      <div style={{
        position: 'absolute', top: '783px', left: '97px', width: '52px', height: '27px',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <input
          type="checkbox"
          checked={orderBump}
          onChange={e => setForm(p => {
            setOrderBump(e.target.checked);
            return p;
          })}
          style={{
            width: '100%', height: '100%', cursor: 'pointer', opacity: 0
          }}
        />
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          borderRadius: '40px', background: orderBump ? '#22c55e' : '#330303',
          transition: 'background 0.2s', pointerEvents: 'none',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)'
        }}>
          <div style={{
            position: 'absolute', top: '3px', left: orderBump ? '28px' : '4px',
            width: '20px', height: '20px', borderRadius: '50%',
            background: '#fff', transition: 'left 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }} />
        </div>
      </div>

      {/* Dynamic Summary Pricing */}
      {!orderBump && (
        <>
          <div style={{
            position: 'absolute', top: '1268px', left: '60px', width: '275px', height: '20px',
            background: '#101010', pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', top: '1318px', left: '240px', width: '90px', height: '22px',
            background: '#101010', display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
            fontFamily: 'Poppins, sans-serif', fontSize: '15px', fontWeight: 600,
            color: '#f1301e', pointerEvents: 'none'
          }}>
            Rp 50.000
          </div>
        </>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        style={{
          position: 'absolute', top: '1428px', left: '44px', width: '305px', height: '46px',
          background: 'transparent', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
        }}
        aria-label="Buka Akses Sekarang"
      />

      {loading && (
        <div style={{
          position: 'absolute', top: '1428px', left: '44px', width: '305px', height: '46px',
          background: 'rgba(0,0,0,0.7)', borderRadius: '9px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 700,
          pointerEvents: 'none',
        }}>
          ⏳ Memproses Pembayaran...
        </div>
      )}

      {/* Toast Errors */}
      {Object.keys(errors).length > 0 && (
        <div style={{
          position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
          width: '350px', background: '#ef4444', color: '#fff',
          borderRadius: '12px', padding: '12px 16px', zIndex: 1000,
          fontFamily: 'Poppins, sans-serif', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }}>
          <p style={{ margin: '0 0 4px 0', fontWeight: 700 }}>⚠️ Harap lengkapi form:</p>
          <ul style={{ margin: 0, paddingLeft: '16px' }}>
            {Object.values(errors).map((err, i) => <li key={i}>{err}</li>)}
          </ul>
          <button
            onClick={() => setErrors({})}
            style={{
              position: 'absolute', top: '8px', right: '12px', background: 'none', border: 'none',
              color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 700
            }}
          >
            ✕
          </button>
        </div>
      )}
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <div style={{ position: 'relative', width: '393px', margin: '0 auto', background: '#000' }}>
      {/* ── Pixel-perfect HTML design ── */}
      <iframe
        src="/design/checkout/index.html"
        width="393"
        height={CANVAS_HEIGHT}
        scrolling="no"
        style={{ border: 'none', display: 'block', pointerEvents: 'none' }}
        title="checkout-design"
      />

      <Suspense fallback={
        <div style={{
          position: 'absolute', top: '400px', left: 0, width: '393px', textAlign: 'center',
          color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '12px'
        }}>
          Memuat formulir...
        </div>
      }>
        <CheckoutFormContent />
      </Suspense>
    </div>
  );
}
