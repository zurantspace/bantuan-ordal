'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AFFILIATE_STATS } from '@/lib/mockData';

export default function AffiliateLinkPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const affiliateLink = AFFILIATE_STATS.affiliateLink;
  const code = AFFILIATE_STATS.affiliateCode;

  const copyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(affiliateLink);
      } else {
        const ta = document.createElement('textarea');
        ta.value = affiliateLink;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt('Salin link:', affiliateLink);
    }
  };

  const shareItems = [
    {
      label: 'WhatsApp',
      emoji: '💬',
      color: '#25d366',
      action: () => {
        const msg = encodeURIComponent(`Aku lagi belajar strategi cari kerja dari Bantuan Ordal!\n\nKelas ini beneran membantu banget. Coba deh:\n${affiliateLink}`);
        window.open(`https://wa.me/?text=${msg}`, '_blank');
      },
    },
    {
      label: 'Instagram',
      emoji: '📸',
      color: '#e1306c',
      action: () => {
        copyLink();
        window.open('https://instagram.com', '_blank');
      },
    },
    {
      label: 'Twitter / X',
      emoji: '🐦',
      color: '#1da1f2',
      action: () => {
        const msg = encodeURIComponent(`Lagi belajar strategi cari kerja dari @BantuanOrdal 🎯\n\nKelas yang actually berguna buat fresh grad. Coba: ${affiliateLink}`);
        window.open(`https://twitter.com/intent/tweet?text=${msg}`, '_blank');
      },
    },
    {
      label: 'Telegram',
      emoji: '✈️',
      color: '#0088cc',
      action: () => {
        const msg = encodeURIComponent(`Coba kelas persiapan karir ini: ${affiliateLink}`);
        window.open(`https://t.me/share/url?url=${encodeURIComponent(affiliateLink)}&text=${msg}`, '_blank');
      },
    },
  ];

  const STATS_MINI = [
    { label: 'Total Klik', value: AFFILIATE_STATS.totalClicks.toLocaleString('id-ID') },
    { label: 'Total Referral', value: AFFILIATE_STATS.totalLeads.toString() },
    { label: 'Komisi Earned', value: `Rp ${AFFILIATE_STATS.totalEarned.toLocaleString('id-ID')}` },
  ];

  return (
    <div className="dashboard-shell">
      <div className="dashboard-container" style={{ paddingBottom: '100px' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '52px 20px 16px',
        }}>
          <button
            onClick={() => router.back()}
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: '#111', border: '1px solid #2a2a2a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff', fontSize: '16px', flexShrink: 0,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            ←
          </button>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
              Link Affiliate
            </div>
            <div style={{ fontSize: '10px', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
              Bagikan & dapatkan komisi 50%
            </div>
          </div>
        </div>

        <div style={{ padding: '0 20px' }}>
          {/* Stats mini cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            gap: '10px', marginBottom: '20px',
          }}>
            {STATS_MINI.map((s, i) => (
              <div key={i} style={{
                background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '12px',
                padding: '12px 10px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#f1301e', fontFamily: 'Poppins, sans-serif' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '9px', color: '#555', fontFamily: 'Poppins, sans-serif', marginTop: '2px' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Link Card */}
          <div style={{
            background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '16px',
            padding: '20px', marginBottom: '16px',
          }}>
            <div style={{
              fontSize: '10px', fontWeight: 700, color: '#555', fontFamily: 'Poppins, sans-serif',
              letterSpacing: '1px', marginBottom: '12px',
            }}>
              LINK UNIKMU
            </div>
            {/* Code badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px',
            }}>
              <span style={{ fontSize: '11px', color: '#888', fontFamily: 'Poppins, sans-serif' }}>Kode:</span>
              <span style={{
                background: 'linear-gradient(90deg, #f1301e22, #9f231522)',
                border: '1px solid #f1301e55',
                borderRadius: '6px', padding: '3px 10px',
                fontSize: '12px', fontWeight: 800, color: '#f1301e',
                fontFamily: 'Poppins, sans-serif', letterSpacing: '1px',
              }}>{code}</span>
            </div>

            {/* Link box */}
            <div style={{
              background: '#080808', border: '1px solid #1f1f1f',
              borderRadius: '10px', padding: '12px 14px', marginBottom: '12px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <span style={{ fontSize: '14px' }}>🔗</span>
              <span style={{
                fontSize: '10px', color: '#888', fontFamily: 'Poppins, sans-serif',
                flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {affiliateLink}
              </span>
            </div>

            {/* Copy button */}
            <button
              onClick={copyLink}
              style={{
                width: '100%', height: '46px', borderRadius: '12px',
                background: copied
                  ? 'linear-gradient(90deg, #166534, #14532d)'
                  : 'linear-gradient(90deg, #f1301e, #9f2315)',
                border: 'none', cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 700,
                color: '#fff', transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {copied ? '✅ Link Tersalin!' : '📋 Salin Link'}
            </button>
          </div>

          {/* QR Code Placeholder */}
          <div style={{
            background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '16px',
            padding: '20px', marginBottom: '16px', textAlign: 'center',
          }}>
            <div style={{
              fontSize: '10px', fontWeight: 700, color: '#555', fontFamily: 'Poppins, sans-serif',
              letterSpacing: '1px', marginBottom: '16px',
            }}>
              QR CODE
            </div>
            {/* QR placeholder */}
            <div style={{
              width: '140px', height: '140px', margin: '0 auto 16px',
              background: '#fff', borderRadius: '12px', padding: '10px',
              display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px',
            }}>
              {Array.from({ length: 49 }).map((_, i) => {
                // Simple QR-like pattern for visual
                const row = Math.floor(i / 7);
                const col = i % 7;
                const isCorner = (row < 2 && col < 2) || (row < 2 && col > 4) || (row > 4 && col < 2);
                const isRand = (i * 37 + 13) % 3 === 0;
                return (
                  <div key={i} style={{
                    background: isCorner || isRand ? '#000' : 'transparent',
                    borderRadius: '2px',
                  }} />
                );
              })}
            </div>
            <p style={{ fontSize: '10px', color: '#555', fontFamily: 'Poppins, sans-serif', margin: '0 0 12px' }}>
              Scan untuk buka link affiliatemu
            </p>
            <button
              onClick={() => window.alert('QR Code siap didownload (fitur backend diperlukan)')}
              style={{
                height: '38px', borderRadius: '10px', padding: '0 20px',
                background: 'transparent', border: '1px solid #3a3a3a',
                cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                fontSize: '11px', fontWeight: 600, color: '#fff',
              }}
            >
              ⬇️ Download QR
            </button>
          </div>

          {/* Share buttons */}
          <div style={{
            background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '16px',
            padding: '20px',
          }}>
            <div style={{
              fontSize: '10px', fontWeight: 700, color: '#555', fontFamily: 'Poppins, sans-serif',
              letterSpacing: '1px', marginBottom: '14px',
            }}>
              BAGIKAN KE
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {shareItems.map((s, i) => (
                <button key={i} onClick={s.action} style={{
                  height: '48px', borderRadius: '12px', padding: '0 16px',
                  background: '#0a0a0a', border: '1px solid #2a2a2a',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                  fontFamily: 'Poppins, sans-serif',
                  transition: 'border-color 0.2s',
                }}>
                  <span style={{ fontSize: '20px' }}>{s.emoji}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Info box */}
          <div style={{
            background: '#08080a', border: '1px solid #1a1a2a', borderRadius: '12px',
            padding: '14px 16px', marginTop: '16px',
            display: 'flex', gap: '12px',
          }}>
            <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#ccc', fontFamily: 'Poppins, sans-serif', marginBottom: '4px' }}>
                Cara Kerja Komisi
              </div>
              <p style={{ fontSize: '10px', color: '#555', fontFamily: 'Poppins, sans-serif', lineHeight: '1.6', margin: 0 }}>
                Setiap orang yang transaksi via linkmu → kamu dapat <strong style={{ color: '#f1301e' }}>50%</strong> komisi selamanya. Plus bonus <strong style={{ color: '#f1301e' }}>Rp 1.000</strong> setiap 1.000 klik unik.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
