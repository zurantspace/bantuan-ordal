'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { captureUTM, getUTMData, getAffiliateCode } from '@/lib/auth';
import { ShieldCheck, Lock, ArrowRight } from '@phosphor-icons/react';

const PRICE_STANDARD = 50000;
const PRICE_ORDER_BUMP = 47000;

function formatRp(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUpgrade = searchParams.get('upgrade') === '1';

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [orderBump, setOrderBump] = useState(isUpgrade);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    captureUTM();
    const t = setInterval(() => setTimeLeft(p => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Nama wajib diisi';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Email tidak valid';
    if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Nomor WA tidak valid (min. 10 digit)';
    if (!form.password || form.password.length < 8) e.password = 'Password minimal 8 karakter';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      const utmData = getUTMData();
      const affiliateCode = getAffiliateCode();

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          hasOrderBump: orderBump,
          isUpgrade: isUpgrade,
          utmSource: utmData.utm_source,
          utmMedium: utmData.utm_medium,
          utmCampaign: utmData.utm_campaign,
          utmContent: utmData.utm_content,
          referrerUrl: utmData.referrer_url,
          landingUrl: utmData.landing_url,
          affiliateCode: affiliateCode || utmData.ref,
        }),
      });

      const data = await res.json();
      if (!data.success || !data.snapToken) {
        setErrors({ submit: data.message || 'Gagal membuat order. Coba lagi.' });
        setLoading(false);
        return;
      }

      // Open Midtrans Snap popup
      if (typeof window !== 'undefined' && window.snap) {
        window.snap.pay(data.snapToken, {
          onSuccess: () => {
            router.push('/thank-you?status=success');
          },
          onPending: () => {
            router.push('/thank-you?status=pending');
          },
          onError: () => {
            setErrors({ submit: 'Pembayaran gagal. Silakan coba lagi.' });
            setLoading(false);
          },
          onClose: () => {
            setLoading(false);
          },
        });
      } else {
        // Fallback: redirect to thank-you
        router.push('/thank-you?status=pending');
      }
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Terjadi kesalahan. Coba lagi.' });
      setLoading(false);
    }
  };

  const total = PRICE_STANDARD + (orderBump ? PRICE_ORDER_BUMP : 0);

  const inputClass = (field: string) =>
    `w-full h-11 rounded-xl border bg-[#0a0a0a] text-white text-sm px-4 outline-none transition-colors placeholder:text-slate-600 ${
      errors[field] ? 'border-red-500 focus:border-red-400' : 'border-[#2a2a2a] focus:border-[#f1301e]'
    }`;

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Urgency bar */}
      <div style={{ background: 'linear-gradient(90deg, #f1301e, #9f2315)', padding: '10px 20px', textAlign: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.3px' }}>
          ⚡ HARGA PROMO BERAKHIR DALAM{' '}
          <span style={{ fontSize: '15px', fontVariantNumeric: 'tabular-nums', minWidth: '42px', display: 'inline-block' }}>
            {formatTime(timeLeft)}
          </span>
        </span>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px 60px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#f1301e', letterSpacing: '2px', marginBottom: '8px' }}>
            LANGKAH TERAKHIR
          </div>
          <h1 style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: '8px' }}>
            Amankan Akses Kelas Kariirmu
          </h1>
          <p style={{ fontSize: '13px', color: '#666' }}>Isi form di bawah untuk membuat akun dan melanjutkan pembayaran</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Two-column on large screens, single on mobile */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: '24px' }}
            className="lg:grid-cols-[1fr_400px]"
          >
            {/* LEFT: Form */}
            <div>
              {/* Personal Info */}
              <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '20px', padding: '24px', marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#555', letterSpacing: '1px', marginBottom: '20px' }}>
                  DATA DIRI
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Name */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#ccc', marginBottom: '6px' }}>
                      Nama Lengkap <span style={{ color: '#f1301e' }}>*</span>
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      placeholder="Nama sesuai KTP"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className={inputClass('name')}
                      autoComplete="name"
                    />
                    {errors.name && <p style={{ color: '#ef4444', fontSize: '10px', marginTop: '4px' }}>⚠ {errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#ccc', marginBottom: '6px' }}>
                      Email Aktif <span style={{ color: '#f1301e' }}>*</span>
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      placeholder="email@kamu.com"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className={inputClass('email')}
                      autoComplete="email"
                    />
                    {errors.email && <p style={{ color: '#ef4444', fontSize: '10px', marginTop: '4px' }}>⚠ {errors.email}</p>}
                    <p style={{ fontSize: '9px', color: '#444', marginTop: '4px' }}>Konfirmasi pembelian dikirim ke email ini</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#ccc', marginBottom: '6px' }}>
                      Nomor WhatsApp <span style={{ color: '#f1301e' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="checkout-phone"
                        type="tel"
                        placeholder="08xxxxxxxxxx"
                        value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                        className={inputClass('phone')}
                        autoComplete="tel"
                      />
                    </div>
                    {errors.phone && <p style={{ color: '#ef4444', fontSize: '10px', marginTop: '4px' }}>⚠ {errors.phone}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#ccc', marginBottom: '6px' }}>
                      Buat Password <span style={{ color: '#f1301e' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        id="checkout-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimal 8 karakter"
                        value={form.password}
                        onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                        className={inputClass('password')}
                        style={{ paddingRight: '44px' }}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '11px' }}
                      >
                        {showPassword ? 'Sembunyikan' : 'Lihat'}
                      </button>
                    </div>
                    {errors.password && <p style={{ color: '#ef4444', fontSize: '10px', marginTop: '4px' }}>⚠ {errors.password}</p>}
                    <p style={{ fontSize: '9px', color: '#444', marginTop: '4px' }}>Dipakai untuk login ke member area</p>
                  </div>
                </div>
              </div>

              {/* Order Bump */}
              <div style={{
                background: 'linear-gradient(135deg, #0d0500 0%, #0d0d0d 100%)',
                border: `2px solid ${orderBump ? '#f1301e' : '#2a2a2a'}`,
                borderRadius: '20px',
                padding: '20px',
                marginBottom: '20px',
                transition: 'border-color 0.2s',
                cursor: 'pointer',
              }}
                onClick={() => setOrderBump(p => !p)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  {/* Custom toggle */}
                  <div style={{
                    width: '48px', height: '26px', borderRadius: '40px', flexShrink: 0,
                    background: orderBump ? 'linear-gradient(90deg,#f1301e,#9f2315)' : '#1a1a1a',
                    border: '1px solid ' + (orderBump ? '#f1301e' : '#333'),
                    position: 'relative', transition: 'all 0.2s', marginTop: '2px',
                  }}>
                    <div style={{
                      position: 'absolute', top: '3px', width: '20px', height: '20px',
                      left: orderBump ? '24px' : '3px', borderRadius: '50%',
                      background: '#fff', transition: 'left 0.2s',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                    }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                        🎁 Tambahkan Bonus Template Pack
                      </span>
                      <span style={{
                        fontSize: '9px', fontWeight: 700, color: '#f1301e',
                        background: 'rgba(241,48,30,0.1)', border: '1px solid #f1301e33',
                        borderRadius: '20px', padding: '2px 8px',
                      }}>
                        HEMAT 75%
                      </span>
                    </div>
                    <p style={{ fontSize: '11px', color: '#888', lineHeight: 1.5, marginBottom: '8px' }}>
                      CV Template ATS, Cover Letter Generator, LinkedIn Cheat Sheet, Interview Script 50 Soal, Salary Negotiation Playbook — senilai Rp 200.000.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: orderBump ? '#f1301e' : '#fff' }}>
                        + {formatRp(PRICE_ORDER_BUMP)}
                      </span>
                      <span style={{ fontSize: '11px', color: '#444', textDecoration: 'line-through' }}>Rp 200.000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security badges */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {[
                  { icon: '🔒', text: 'Pembayaran aman' },
                  { icon: '🛡️', text: 'Garansi 30 hari' },
                  { icon: '⚡', text: 'Akses instan' },
                ].map(b => (
                  <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#555' }}>
                    <span style={{ fontSize: '14px' }}>{b.icon}</span>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Order Summary + CTA */}
            <div>
              <div style={{
                background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '20px',
                padding: '24px', position: 'sticky', top: '20px',
              }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#555', letterSpacing: '1px', marginBottom: '16px' }}>
                  RINGKASAN PESANAN
                </div>

                {/* Line items */}
                <div style={{ borderBottom: '1px solid #1a1a1a', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                        Kelas Persiapan Karir (Ep. 1–4)
                      </div>
                      <div style={{ fontSize: '10px', color: '#555' }}>Akses seumur hidup</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '11px', color: '#555', textDecoration: 'line-through' }}>Rp 149.000</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{formatRp(PRICE_STANDARD)}</div>
                    </div>
                  </div>

                  {orderBump && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', background: 'rgba(241,48,30,0.05)', borderRadius: '10px', padding: '10px' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#f1301e', marginBottom: '2px' }}>
                          🎁 Bonus Template Pack
                        </div>
                        <div style={{ fontSize: '10px', color: '#555' }}>5 template siap pakai</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '11px', color: '#555', textDecoration: 'line-through' }}>Rp 200.000</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1301e' }}>{formatRp(PRICE_ORDER_BUMP)}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Total</span>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: '#f1301e' }}>
                    {formatRp(total)}
                  </span>
                </div>

                {/* What you get */}
                <div style={{ marginBottom: '20px' }}>
                  {[
                    'Akses seumur hidup Episode 1–4',
                    'Sertifikat penyelesaian digital',
                    'Akses grup diskusi alumni',
                    'Update konten gratis selamanya',
                    ...(orderBump ? ['🎁 5 bonus templates senilai Rp 200.000'] : []),
                  ].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ color: '#4ade80', fontSize: '14px', flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: '11px', color: '#888' }}>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Submit CTA */}
                <button
                  id="btn-checkout-submit"
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', height: '52px', borderRadius: '60px',
                    background: loading ? '#333' : 'linear-gradient(90deg, #f1301e, #9f2315)',
                    border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff',
                    boxShadow: loading ? 'none' : '0 0 30px rgba(241,48,30,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: 'all 0.2s',
                  }}
                >
                  {loading ? '⏳ Memproses...' : <>Buka Akses Sekarang <ArrowRight weight="bold" size={16} /></>}
                </button>

                <p style={{ fontSize: '9px', color: '#444', textAlign: 'center', marginTop: '10px', lineHeight: 1.5 }}>
                  Dengan melanjutkan kamu menyetujui Syarat & Ketentuan kami.
                  Pembayaran diproses secara aman.
                </p>

                {/* Trust row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#444' }}>
                    <Lock size={12} /> Enkripsi SSL
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#444' }}>
                    <ShieldCheck size={12} /> Garansi 30 Hari
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Error toast */}
      {Object.keys(errors).length > 0 && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          background: '#1a0505', border: '1px solid #ef4444',
          borderRadius: '14px', padding: '14px 18px', zIndex: 1000,
          maxWidth: '380px', width: 'calc(100% - 32px)',
          boxShadow: '0 8px 32px rgba(239,68,68,0.2)',
          fontFamily: 'Poppins, sans-serif',
        }}>
          <p style={{ margin: '0 0 6px 0', fontWeight: 700, fontSize: '12px', color: '#fff' }}>⚠️ Harap lengkapi form:</p>
          <ul style={{ margin: 0, paddingLeft: '16px' }}>
            {Object.values(errors).map((err, i) => (
              <li key={i} style={{ fontSize: '11px', color: '#fca5a5', marginBottom: '2px' }}>{err}</li>
            ))}
          </ul>
          <button
            onClick={() => setErrors({})}
            style={{ position: 'absolute', top: '10px', right: '12px', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '16px' }}
          >✕</button>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '13px' }}>
        Memuat checkout...
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
