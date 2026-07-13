'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EPISODES } from '@/lib/mockData';

const PREMIUM_BENEFITS = [
  { icon: '🧠', text: 'Personal Branding & LinkedIn Optimization' },
  { icon: '🤝', text: 'Network Building — 80% lowongan tidak dipublish' },
  { icon: '🎤', text: 'Interview Mastery — jawab seperti kandidat terbaik' },
  { icon: '🚀', text: '90 Hari Pertama — survive & thrive di tempat kerja baru' },
  { icon: '📈', text: 'Career Acceleration — naik jabatan lebih cepat' },
];

const S = {
  shell: { minHeight: '100dvh', background: '#000', fontFamily: 'Poppins, sans-serif' } as React.CSSProperties,
  header: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '52px 20px 16px',
  } as React.CSSProperties,
  backBtn: {
    width: '34px', height: '34px', borderRadius: '50%',
    background: '#111', border: '1px solid #2a2a2a',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: '#fff', fontSize: '16px', flexShrink: 0,
  } as React.CSSProperties,
  badge: {
    display: 'inline-block',
    background: 'linear-gradient(90deg, #f1301e22, #9f231522)',
    border: '1px solid #f1301e55',
    borderRadius: '20px', padding: '4px 12px',
    fontSize: '10px', fontWeight: 700, color: '#f1301e',
    letterSpacing: '0.5px',
  } as React.CSSProperties,
  card: {
    background: '#0d0d0d', border: '1px solid #2a2a2a',
    borderRadius: '16px', overflow: 'hidden',
  } as React.CSSProperties,
};

export default function UpgradePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const premiumEps = EPISODES.filter(e => e.tier === 'premium');

  const handleUpgrade = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    router.push('/checkout?upgrade=1');
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-container" style={{ paddingBottom: '120px' }}>

        {/* Header */}
        <div style={S.header}>
          <button onClick={() => router.back()} style={S.backBtn}>←</button>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>Upgrade ke Premium</div>
            <div style={{ fontSize: '10px', color: '#555' }}>Buka akses Episode 5–9</div>
          </div>
        </div>

        <div style={{ padding: '0 20px' }}>
          {/* Hero Glow Card */}
          <div style={{
            borderRadius: '20px', padding: '28px 20px', marginBottom: '20px',
            background: 'linear-gradient(135deg, #1a0505 0%, #0d0d0d 50%, #0d0505 100%)',
            border: '1px solid #3a1a1a',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-40px', right: '-40px',
              width: '200px', height: '200px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(241,48,30,0.15) 0%, transparent 70%)',
              filter: 'blur(30px)', pointerEvents: 'none',
            }} />
            <div style={S.badge}>PREMIUM</div>
            <h1 style={{
              fontSize: '22px', fontWeight: 800, color: '#fff',
              marginTop: '12px', marginBottom: '8px', lineHeight: '1.3',
            }}>
              Dari Dapat Kerja<br />ke <span style={{ color: '#f1301e' }}>Sukses di Kerja</span>
            </h1>
            <p style={{ fontSize: '12px', color: '#888', lineHeight: '1.6', margin: 0 }}>
              Kamu sudah tahu cara masuk. Sekarang waktunya naik level — dari bertahan ke berkembang.
            </p>

            {/* Price */}
            <div style={{
              marginTop: '20px', display: 'flex', alignItems: 'baseline', gap: '8px',
            }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#f1301e' }}>Rp 149.000</span>
              <span style={{
                fontSize: '11px', color: '#555',
                textDecoration: 'line-through',
              }}>Rp 349.000</span>
            </div>
            <div style={{ fontSize: '9px', color: '#888', marginTop: '4px' }}>
              Akses seumur hidup · 5 episode premium · Update gratis
            </div>
          </div>

          {/* Benefits */}
          <div style={{ ...S.card, padding: '20px', marginBottom: '16px' }}>
            <div style={{
              fontSize: '10px', fontWeight: 700, color: '#555',
              letterSpacing: '1px', marginBottom: '16px',
            }}>
              APA YANG KAMU DAPATKAN
            </div>
            {PREMIUM_BENEFITS.map((b, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 0',
                borderBottom: i < PREMIUM_BENEFITS.length - 1 ? '1px solid #1a1a1a' : 'none',
              }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{b.icon}</span>
                <span style={{ fontSize: '12px', color: '#ccc', lineHeight: '1.4' }}>{b.text}</span>
                <span style={{ marginLeft: 'auto', color: '#f1301e', fontSize: '14px', flexShrink: 0 }}>✓</span>
              </div>
            ))}
          </div>

          {/* Episode Preview Cards */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              fontSize: '10px', fontWeight: 700, color: '#555',
              letterSpacing: '1px', marginBottom: '12px',
            }}>
              5 EPISODE PREMIUM
            </div>
            {premiumEps.map((ep) => (
              <div key={ep.id} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '12px 14px', marginBottom: '8px',
                background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '12px',
              }}>
                {/* Lock icon */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                  background: 'linear-gradient(135deg, #1a0505, #2a0a0a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid #3a1a1a', fontSize: '18px',
                }}>
                  🔒
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px',
                  }}>
                    <span style={{ fontSize: '9px', color: '#f1301e', fontWeight: 700 }}>EP {ep.number}</span>
                    <span style={{
                      fontSize: '8px', color: '#444', background: '#1a1a1a',
                      borderRadius: '4px', padding: '1px 5px', fontWeight: 600,
                    }}>
                      PREMIUM
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                    {ep.title}
                  </div>
                  <div style={{ fontSize: '10px', color: '#555' }}>{ep.subtitle} · {ep.duration}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee strip */}
          <div style={{
            background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '12px',
            padding: '14px 16px', marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <span style={{ fontSize: '24px' }}>🛡️</span>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                Garansi 30 Hari
              </div>
              <div style={{ fontSize: '10px', color: '#555', lineHeight: '1.5' }}>
                Tidak puas? Uang kembali 100%. Tanpa debat. Tanpa negosiasi.
              </div>
            </div>
          </div>
        </div>

        {/* Fixed CTA */}
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: '700px',
          background: 'linear-gradient(to top, #000 80%, transparent)',
          padding: '16px 20px 28px', zIndex: 50,
        }}>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            style={{
              width: '100%', height: '52px', borderRadius: '60px',
              background: loading ? '#333' : 'linear-gradient(90deg, #f1301e, #9f2315)',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 700,
              color: '#fff', boxShadow: '0 0 30px rgba(241,48,30,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            {loading ? '⏳ Memproses...' : '🚀 Upgrade Sekarang — Rp 149.000'}
          </button>
          <p style={{
            fontFamily: 'Poppins, sans-serif', fontSize: '9px', color: '#444',
            textAlign: 'center', marginTop: '8px',
          }}>
            Bayar sekali · Akses seumur hidup · Garansi 30 hari
          </p>
        </div>
      </div>
    </div>
  );
}
