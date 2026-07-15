'use client';

import { useState, useEffect } from 'react';

const RED      = '#f1301e';
const RED_DARK = '#9f2315';
const CARD_BG  = '#101010';
const BORDER   = '#3a3a3a';
const BORDER_MID = '#2b2b2b';


function formatRp(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

type AffiliateData = {
  id: string;
  referralCode: string;
  referralLink: string;
  status: string;
  balance: number;
  totalClicks: number;
  totalOrders: number;
  totalCommission: number;
  pendingCommission: number;
  bankName?: string;
  bankAccount?: string;
  gopayNumber?: string;
  recentTransactions: {
    id: string;
    amount: number;
    commissionAmount: number;
    status: string;
    createdAt: string;
  }[];
};

const COMMISSION_TIERS = [
  { label: 'Standard',  pct: 10, desc: 'Setiap penjualan kelas Standard',  color: '#888' },
  { label: 'Premium',   pct: 15, desc: 'Setiap penjualan kelas Premium',   color: '#fbbf24' },
];

const FAQ = [
  { q: 'Bagaimana cara bergabung program affiliate?', a: 'Daftarkan diri dan tunggu persetujuan admin. Setelah disetujui, kamu akan mendapatkan link unik untuk dibagikan.' },
  { q: 'Kapan komisi saya cair?', a: 'Komisi masuk ke saldo setelah pembayaran dari customer dikonfirmasi. Pencairan diproses dalam 1×24 jam kerja.' },
  { q: 'Berapa minimum pencairan?', a: 'Minimum pencairan adalah Rp 50.000. Kamu bisa cairkan kapan saja selama saldo mencukupi.' },
  { q: 'Bagaimana sistem tracking referral?', a: 'Setiap klik pada link referral kamu akan tercatat. Cookie berlaku 30 hari, jadi jika teman kamu beli dalam 30 hari setelah klik, kamu tetap dapat komisi.' },
];

export default function ProfileAffiliatePage() {
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registered, setRegistered] = useState(false);

  const [calcPrice, setCalcPrice] = useState(297000);
  const [calcTier, setCalcTier] = useState<'standard' | 'premium'>('standard');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [copied, setCopied] = useState(false);

  useEffect(() => { fetchAffiliate(); }, []);

  async function fetchAffiliate() {
    try {
      const res = await fetch('/api/affiliate/stats', { credentials: 'include' });
      const data = await res.json();
      if (data.success && data.affiliate) setAffiliate(data.affiliate);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  async function handleRegister() {
    setRegisterLoading(true); setRegisterError('');
    try {
      const res = await fetch('/api/affiliate/register', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) { setRegistered(true); fetchAffiliate(); }
      else setRegisterError(data.message || 'Gagal mendaftar');
    } catch { setRegisterError('Terjadi kesalahan. Coba lagi.'); }
    finally { setRegisterLoading(false); }
  }

  function copyLink() {
    if (!affiliate) return;
    navigator.clipboard?.writeText(affiliate.referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const commissionPct = calcTier === 'premium' ? 15 : 10;
  const estimatedComm = Math.round(calcPrice * commissionPct / 100);

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0', color: '#555', fontSize: '13px' }}>
          Memuat data affiliate...
        </div>
      )}

      {!loading && !affiliate && !registered && (
        /* ── Registration CTA ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Hero */}
          <div style={{
            background: `linear-gradient(135deg, rgba(241,48,30,0.12) 0%, rgba(0,0,0,0) 100%)`,
            border: `1px solid ${RED}33`, borderRadius: '20px', padding: '28px 24px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚀</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Program Affiliate</h2>
            <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.6, marginBottom: '20px' }}>
              Dapatkan komisi <strong style={{ color: RED }}>10–15%</strong> setiap kali teman kamu beli kelas lewat link referral kamu.
            </p>
            {registerError && <p style={{ fontSize: '11px', color: '#ef4444', marginBottom: '12px' }}>⚠ {registerError}</p>}
            <button
              id="btn-daftar-affiliate"
              onClick={handleRegister}
              disabled={registerLoading}
              style={{
                padding: '14px 32px', borderRadius: '60px', border: 'none',
                background: registerLoading ? '#333' : `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
                color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 700,
                cursor: registerLoading ? 'not-allowed' : 'pointer',
                boxShadow: `0 0 28px rgba(241,48,30,0.3)`,
              }}
            >
              {registerLoading ? '⏳ Memproses...' : 'Daftar Jadi Affiliate'}
            </button>
          </div>

          {/* Commission tiers info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {COMMISSION_TIERS.map(t => (
              <div key={t.label} style={{
                background: CARD_BG, borderRadius: '14px', padding: '18px',
                border: `1px solid ${BORDER}`, textAlign: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#555', letterSpacing: '1px', marginBottom: '6px' }}>KELAS {t.label.toUpperCase()}</div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: t.color, marginBottom: '4px' }}>{t.pct}%</div>
                <div style={{ fontSize: '10px', color: '#555' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {registered && !affiliate && (
        <div style={{
          background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px',
          padding: '40px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Pendaftaran Dikirim!</h2>
          <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.6 }}>
            Akun affiliate kamu sedang menunggu persetujuan admin. Biasanya 1–2 hari kerja.
          </p>
        </div>
      )}

      {!loading && affiliate && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Status Badge */}
          {affiliate.status !== 'APPROVED' && (
            <div style={{
              background: 'rgba(251,191,36,0.05)', border: '1px solid #fbbf2433', borderRadius: '14px',
              padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <span style={{ fontSize: '20px' }}>⏳</span>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#fbbf24', marginBottom: '2px' }}>Menunggu Persetujuan</p>
                <p style={{ fontSize: '11px', color: '#888' }}>Admin sedang mereview pendaftaran kamu. Biasanya 1–2 hari kerja.</p>
              </div>
            </div>
          )}

          {/* Referral Link — per template design: gradient border card */}
          <div style={{
            background: CARD_BG, borderRadius: '14px', padding: '18px',
            position: 'relative', overflow: 'hidden',
            boxShadow: `inset 0 0 0 1px ${RED}33`,
          }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#555', letterSpacing: '1px', marginBottom: '6px' }}>
              KODE REFERRAL UNIKMU
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{
                fontFamily: 'monospace', fontSize: '22px', fontWeight: 800,
                background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                {affiliate.referralCode}
              </span>
              <span style={{
                fontSize: '9px', fontWeight: 700,
                color: affiliate.status === 'APPROVED' ? '#4ade80' : '#fbbf24',
                background: affiliate.status === 'APPROVED' ? 'rgba(74,222,128,0.08)' : 'rgba(251,191,36,0.08)',
                border: `1px solid ${affiliate.status === 'APPROVED' ? '#4ade8033' : '#fbbf2433'}`,
                borderRadius: '20px', padding: '3px 10px',
              }}>
                {affiliate.status === 'APPROVED' ? '✓ AKTIF' : '⏳ PENDING'}
              </span>
            </div>

            <p style={{ fontSize: '10px', color: '#555', marginBottom: '8px' }}>Link referral:</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{
                flex: 1, background: '#0a0a0a', border: `1px solid ${BORDER_MID}`,
                borderRadius: '10px', padding: '10px 12px',
                fontFamily: 'monospace', fontSize: '10px', color: '#555',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {affiliate.referralLink}
              </div>
              <button
                id="btn-copy-link"
                onClick={copyLink}
                style={{
                  padding: '10px 16px', borderRadius: '10px', border: 'none',
                  background: copied ? '#1a3a1a' : `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
                  color: copied ? '#4ade80' : '#fff',
                  fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
                }}
              >
                {copied ? '✓ Tersalin' : 'Salin'}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { label: 'Total Klik',  value: affiliate.totalClicks.toLocaleString('id-ID'), icon: '👆' },
              { label: 'Total Order', value: String(affiliate.totalOrders), icon: '🛒' },
              { label: 'Komisi',      value: formatRp(affiliate.totalCommission), icon: '💰' },
            ].map(s => (
              <div key={s.label} style={{
                background: CARD_BG, border: `1px solid ${BORDER}`,
                borderRadius: '12px', padding: '14px 12px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '2px' }}>{s.value}</div>
                <div style={{ fontSize: '9px', color: '#555' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Commission Calculator */}
          <div style={{
            background: CARD_BG, border: `1px solid ${BORDER}`,
            borderRadius: '14px', padding: '18px',
          }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#555', letterSpacing: '1px', marginBottom: '14px' }}>
              KALKULATOR KOMISI
            </p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '140px' }}>
                <p style={{ fontSize: '10px', color: '#555', marginBottom: '6px' }}>Jenis Kelas</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['standard', 'premium'] as const).map(t => (
                    <button key={t} id={`calc-tier-${t}`} onClick={() => setCalcTier(t)} style={{
                      flex: 1, padding: '8px 4px', borderRadius: '8px',
                      border: `1px solid ${calcTier === t ? RED + '55' : BORDER_MID}`,
                      background: calcTier === t ? 'rgba(241,48,30,0.08)' : '#0a0a0a',
                      color: calcTier === t ? '#fff' : '#555',
                      fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: 700,
                      cursor: 'pointer', textTransform: 'capitalize',
                    }}>{t}</button>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: '140px' }}>
                <p style={{ fontSize: '10px', color: '#555', marginBottom: '6px' }}>Harga (Rp)</p>
                <input
                  id="calc-price"
                  type="number"
                  value={calcPrice}
                  onChange={e => setCalcPrice(parseInt(e.target.value) || 0)}
                  style={{
                    width: '100%', height: '36px', background: '#0a0a0a',
                    border: `1px solid ${BORDER_MID}`, borderRadius: '8px',
                    padding: '0 10px', color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '12px',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
            <div style={{
              background: `linear-gradient(135deg, rgba(241,48,30,0.1) 0%, rgba(0,0,0,0) 100%)`,
              border: `1px solid ${RED}22`, borderRadius: '10px', padding: '12px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ fontSize: '10px', color: '#555' }}>Komisi {commissionPct}% kamu</p>
                <p style={{ fontSize: '22px', fontWeight: 800, color: '#fff' }}>{formatRp(estimatedComm)}</p>
              </div>
              <span style={{
                fontSize: '28px', fontWeight: 900,
                background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>{commissionPct}%</span>
            </div>
          </div>

          {/* Recent Transactions */}
          {affiliate.recentTransactions.length > 0 && (
            <div>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#555', letterSpacing: '1px', marginBottom: '10px' }}>
                TRANSAKSI TERBARU
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {affiliate.recentTransactions.map(tx => (
                  <div key={tx.id} style={{
                    background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '12px',
                    padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px',
                  }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(241,48,30,0.08)', border: `1px solid ${RED}22`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                    }}>💰</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Komisi Referral</p>
                      <p style={{ fontSize: '9px', color: '#555' }}>
                        {new Date(tx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>+{formatRp(tx.commissionAmount)}</p>
                      <span style={{
                        fontSize: '8px', fontWeight: 700, borderRadius: '20px', padding: '2px 8px',
                        color: tx.status === 'PAID' ? '#4ade80' : '#fbbf24',
                        background: tx.status === 'PAID' ? 'rgba(74,222,128,0.08)' : 'rgba(251,191,36,0.08)',
                        border: `1px solid ${tx.status === 'PAID' ? '#4ade8033' : '#fbbf2433'}`,
                      }}>
                        {tx.status === 'PAID' ? '✓ Selesai' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#555', letterSpacing: '1px', marginBottom: '10px' }}>
              FAQ
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {FAQ.map((f, i) => (
                <div key={i} style={{
                  background: CARD_BG, border: `1px solid ${openFaq === i ? RED + '33' : BORDER}`,
                  borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s',
                }}>
                  <button
                    id={`faq-${i}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: 'Poppins, sans-serif', color: '#fff', fontSize: '12px', fontWeight: 700,
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ flex: 1, marginRight: '12px' }}>{f.q}</span>
                    <span style={{
                      color: RED, fontSize: '16px', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s', flexShrink: 0,
                    }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 16px 14px', fontSize: '12px', color: '#888', lineHeight: 1.6 }}>
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
