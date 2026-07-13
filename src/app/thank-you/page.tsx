'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ThankYouPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect to home dashboard after 5 seconds
    const timer = setTimeout(() => {
      router.push('/home');
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="dashboard-shell">
      <div className="dashboard-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(241,48,30,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        {/* Checkmark */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f1301e, #9f2315)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          marginBottom: '24px',
          boxShadow: '0 0 40px rgba(241,48,30,0.4)',
        }}>
          ✓
        </div>

        <h1 style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '24px',
          fontWeight: 800,
          color: '#fff',
          textAlign: 'center',
          marginBottom: '8px',
        }}>
          Pembayaran Berhasil!
        </h1>

        <p style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '13px',
          color: '#aaa',
          textAlign: 'center',
          marginBottom: '32px',
          lineHeight: '1.6',
        }}>
          Selamat bergabung! Akses member area kamu sudah aktif. Cek email untuk detail login.
        </p>

        {/* Info card */}
        <div style={{
          width: '100%',
          border: '1px solid #3a3a3a',
          borderRadius: '16px',
          backgroundColor: '#101010',
          padding: '20px',
          marginBottom: '24px',
        }}>
          <h3 style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '10px',
            fontWeight: 800,
            color: '#d9d9d9',
            textAlign: 'center',
            letterSpacing: '1px',
            marginBottom: '16px',
          }}>LANGKAH SELANJUTNYA</h3>

          {[
            { step: '1', text: 'Cek email untuk konfirmasi pembelian' },
            { step: '2', text: 'Login ke member area dengan email & password yang sudah kamu buat' },
            { step: '3', text: 'Mulai belajar dari Episode 1 — perjalananmu dimulai hari ini!' },
          ].map((item) => (
            <div key={item.step} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '12px',
            }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f1301e, #9f2315)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}>
                {item.step}
              </div>
              <p style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '10px',
                color: '#aaa',
                lineHeight: '1.5',
              }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={() => router.push('/home')}
          style={{
            width: '100%',
            height: '46px',
            borderRadius: '60px',
            background: 'linear-gradient(90deg, #f1301e, #9f2315)',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '13px',
            fontWeight: 700,
            color: '#fff',
            boxShadow: '0 0 20px rgba(241,48,30,0.4)',
          }}
        >
          🚀 Mulai Belajar Sekarang
        </button>

        <p style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '9px',
          color: '#525252',
          textAlign: 'center',
          marginTop: '12px',
        }}>
          Kamu akan diarahkan otomatis dalam 5 detik...
        </p>
      </div>
    </div>
  );
}
