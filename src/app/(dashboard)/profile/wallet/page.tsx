'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RED      = '#f1301e';
const RED_DARK = '#9f2315';
const CARD_BG  = '#101010';
const BORDER   = '#3a3a3a';
const BORDER_MID = '#2b2b2b';

function formatRp(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

type AffiliateStats = {
  id: string;
  referralCode: string;
  referralLink: string;
  status: string;
  balance: number;
  totalClicks: number;
  totalOrders: number;
  totalCommission: number;
  pendingCommission: number;
  recentTransactions: {
    id: string;
    amount: number;
    commissionAmount: number;
    status: string;
    createdAt: string;
  }[];
};

type WithdrawalMethod = { id: string; label: string; placeholder: string; method: string };
const METHODS: WithdrawalMethod[] = [
  { id: 'gopay',   label: 'GoPay',                method: 'gopay',          placeholder: '08xxxxxxxxxx' },
  { id: 'ovo',     label: 'OVO',                  method: 'gopay',          placeholder: '08xxxxxxxxxx' },
  { id: 'bca',     label: 'Transfer Bank BCA',    method: 'bank_transfer',  placeholder: 'Nomor rekening BCA' },
  { id: 'bri',     label: 'Transfer Bank BRI',    method: 'bank_transfer',  placeholder: 'Nomor rekening BRI' },
  { id: 'mandiri', label: 'Transfer Bank Mandiri', method: 'bank_transfer', placeholder: 'Nomor rekening Mandiri' },
];

const MIN_WITHDRAW = 50000;

export default function ProfileWalletPage() {
  const router = useRouter();
  const [stats, setStats]           = useState<AffiliateStats | null>(null);
  const [loading, setLoading]       = useState(true);
  const [notAffiliate, setNotAffiliate] = useState(false);

  const [showModal, setShowModal]   = useState(false);
  const [method, setMethod]         = useState(METHODS[0]);
  const [account, setAccount]       = useState('');
  const [amount, setAmount]         = useState('');
  const [step, setStep]             = useState<'form' | 'confirm' | 'success'>('form');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => { fetchStats(); }, []);

  async function fetchStats() {
    try {
      const res  = await fetch('/api/affiliate/stats', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        if (!data.affiliate) setNotAffiliate(true);
        else setStats(data.affiliate);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }

  function handleClose() {
    setShowModal(false); setStep('form'); setAccount(''); setAmount(''); setWithdrawError('');
  }

  async function handleWithdraw() {
    if (!stats) return;
    setWithdrawLoading(true); setWithdrawError('');
    try {
      const res  = await fetch('/api/affiliate/withdraw', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountNum, method: method.method, account }),
      });
      const data = await res.json();
      if (data.success) { setStep('success'); fetchStats(); }
      else setWithdrawError(data.message || 'Gagal memproses pencairan');
    } catch { setWithdrawError('Terjadi kesalahan. Coba lagi.'); }
    finally { setWithdrawLoading(false); }
  }

  const balance   = stats?.balance ?? 0;
  const amountNum = parseInt(amount.replace(/\D/g, ''), 10) || 0;
  const isValid   = account.length >= 8 && amountNum >= MIN_WITHDRAW && amountNum <= balance;
  const canWithdraw = balance >= MIN_WITHDRAW && stats?.status === 'APPROVED';

  const STAT_GRID = stats ? [
    { label: 'Total Commission',  value: formatRp(stats.totalCommission),                                      grad: true  },
    { label: 'Unpaid Commission', value: formatRp(stats.pendingCommission),                                    grad: true  },
    { label: 'Paid Commission',   value: formatRp(Math.max(0, stats.totalCommission - stats.pendingCommission)), grad: true  },
    { label: 'Total Leads',       value: String(stats.totalOrders),                                            grad: true  },
    { label: 'Lead Verified',     value: String(stats.totalOrders),                                            grad: true  },
    { label: 'Lead Unverified',   value: String(stats.totalClicks),                                            grad: false },
  ] : [];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', paddingBottom: '8px' }}>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0', color: '#555', fontSize: '13px' }}>
          Memuat data wallet...
        </div>
      )}

      {!loading && notAffiliate && (
        <div style={{
          background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px',
          padding: '40px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>💰</div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Belum Terdaftar Affiliate</h2>
          <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.6 }}>
            Daftarkan diri sebagai affiliate untuk mulai mendapatkan komisi dari setiap referral.
          </p>
        </div>
      )}

      {!loading && stats && (
        <>
          {/* ── Summary Section ── */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#fff', marginBottom: '14px' }}>Summary</h2>

            {/* 2-col Stats Grid matching design template */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              {STAT_GRID.map((s, i) => (
                <div key={i} style={{
                  background: CARD_BG, border: `1px solid ${BORDER_MID}`,
                  borderRadius: '11px', padding: '12px 14px',
                }}>
                  <p style={{ fontSize: '10px', fontWeight: 600, color: '#535353', marginBottom: '6px' }}>{s.label}</p>
                  {s.grad ? (
                    <p style={{
                      fontSize: '14px', fontWeight: 600,
                      background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>{s.value}</p>
                  ) : (
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{s.value}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Status badge if not approved */}
            {stats.status !== 'APPROVED' && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(251,191,36,0.1)', border: '1px solid #fbbf2433',
                borderRadius: '20px', padding: '6px 14px',
                fontSize: '11px', fontWeight: 700, color: '#fbbf24', marginBottom: '12px',
              }}>
                ⏳ Status: {stats.status}
              </div>
            )}

            {/* Two action buttons — matches design template */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                id="btn-cairkan"
                onClick={() => { setShowModal(true); setStep('form'); }}
                disabled={!canWithdraw}
                style={{
                  height: '52px', borderRadius: '11px', border: 'none',
                  background: canWithdraw ? `linear-gradient(90deg, ${RED}, ${RED_DARK})` : '#1a1a1a',
                  color: canWithdraw ? '#fff' : '#555',
                  fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 600,
                  cursor: canWithdraw ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  boxShadow: canWithdraw ? '0 0 20px rgba(241,48,30,0.3)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                💸 Cairkan Dana
              </button>
              <button
                id="btn-apa-affiliate"
                onClick={() => router.push('/profile/affiliate')}
                style={{
                  height: '52px', borderRadius: '11px',
                  border: `1px solid ${BORDER_MID}`,
                  background: CARD_BG,
                  color: '#ccc',
                  fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                🔗 Apa Itu Affiliate?
              </button>
            </div>
          </div>

          {/* ── History Section ── */}
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>History</h2>

            {stats.recentTransactions.length === 0 ? (
              <div style={{
                background: CARD_BG, border: `1px solid ${BORDER_MID}`, borderRadius: '12px',
                padding: '24px', textAlign: 'center', color: '#555', fontSize: '12px',
              }}>
                Belum ada transaksi
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {stats.recentTransactions.map(tx => (
                  <div key={tx.id} style={{
                    background: CARD_BG, border: `1px solid ${BORDER_MID}`,
                    borderRadius: '12px', padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                  }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '8px', flexShrink: 0,
                      background: `linear-gradient(135deg, rgba(241,48,30,0.15), rgba(0,0,0,0.3))`,
                      border: `1px solid ${RED}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                    }}>💰</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>Komisi Referral</p>
                      <p style={{ fontSize: '10px', color: '#535353' }}>
                        {new Date(tx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                        +{formatRp(tx.commissionAmount)}
                      </p>
                      <span style={{
                        fontSize: '9px', fontWeight: 700,
                        color: tx.status === 'PAID' ? '#4ade80' : '#fbbf24',
                        background: tx.status === 'PAID' ? 'rgba(74,222,128,0.08)' : 'rgba(251,191,36,0.08)',
                        border: `1px solid ${tx.status === 'PAID' ? '#4ade8033' : '#fbbf2433'}`,
                        borderRadius: '20px', padding: '2px 8px',
                      }}>
                        {tx.status === 'PAID' ? '✓ Selesai' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Referral Link ── */}
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER_MID}`, borderRadius: '14px', padding: '16px 18px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#535353', letterSpacing: '1px', marginBottom: '10px' }}>
              LINK REFERRAL KAMU
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{
                flex: 1, background: '#0a0a0a', border: `1px solid ${BORDER_MID}`, borderRadius: '10px',
                padding: '10px 12px', fontFamily: 'monospace', fontSize: '11px', color: '#535353',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {stats.referralLink}
              </div>
              <button
                onClick={() => navigator.clipboard?.writeText(stats.referralLink).catch(() => {})}
                style={{
                  padding: '10px 16px', borderRadius: '10px', border: 'none',
                  background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
                  color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                }}
              >
                Salin
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Withdrawal Modal ── */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div style={{
            background: '#0d0d0d', borderRadius: '24px 24px 0 0', padding: '24px',
            width: '100%', maxWidth: '500px', border: '1px solid #1f1f1f', borderBottom: 'none',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ width: '40px', height: '4px', background: '#333', borderRadius: '2px', margin: '0 auto 24px' }} />

            {step === 'form' && (
              <>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '20px' }}>Cairkan Dana</h2>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#555', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>METODE PEMBAYARAN</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {METHODS.map(m => (
                      <button key={m.id} id={`method-${m.id}`} onClick={() => setMethod(m)} style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px',
                        background: method.id === m.id ? 'rgba(241,48,30,0.08)' : '#0a0a0a',
                        border: `1px solid ${method.id === m.id ? RED + '55' : '#1f1f1f'}`,
                        borderRadius: '12px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', textAlign: 'left',
                      }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: method.id === m.id ? '#fff' : '#888' }}>{m.label}</span>
                        {method.id === m.id && <span style={{ marginLeft: 'auto', color: RED, fontSize: '14px' }}>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#555', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>NOMOR AKUN</label>
                  <input id="input-account" type="text" placeholder={method.placeholder} value={account} onChange={e => setAccount(e.target.value)}
                    style={{ width: '100%', height: '44px', background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '0 14px', color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#555', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>JUMLAH (Saldo: {formatRp(balance)})</label>
                  <input id="input-amount" type="number" placeholder={`Min. ${formatRp(MIN_WITHDRAW)}`} value={amount} onChange={e => setAmount(e.target.value)}
                    style={{ width: '100%', height: '44px', background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '0 14px', color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                  {amountNum > 0 && amountNum < MIN_WITHDRAW && <p style={{ fontSize: '10px', color: '#ef4444', marginTop: '4px' }}>⚠ Minimum {formatRp(MIN_WITHDRAW)}</p>}
                </div>
                {withdrawError && <p style={{ fontSize: '11px', color: '#ef4444', marginBottom: '12px' }}>⚠ {withdrawError}</p>}
                <button id="btn-lanjut" onClick={() => isValid && setStep('confirm')} disabled={!isValid} style={{
                  width: '100%', height: '48px', borderRadius: '60px', border: 'none',
                  background: isValid ? `linear-gradient(90deg, ${RED}, ${RED_DARK})` : '#1a1a1a',
                  color: isValid ? '#fff' : '#444',
                  fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 700, cursor: isValid ? 'pointer' : 'not-allowed',
                }}>Lanjut ke Konfirmasi</button>
              </>
            )}

            {step === 'confirm' && (
              <>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '20px' }}>Konfirmasi Penarikan</h2>
                <div style={{ background: '#0a0a0a', border: '1px solid #1f1f1f', borderRadius: '14px', padding: '18px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[{ label: 'Metode', value: method.label }, { label: 'Nomor Akun', value: account }, { label: 'Jumlah', value: formatRp(amountNum) }].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#555' }}>{r.label}</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{r.value}</span>
                    </div>
                  ))}
                </div>
                {withdrawError && <p style={{ fontSize: '11px', color: '#ef4444', marginBottom: '12px' }}>⚠ {withdrawError}</p>}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setStep('form')} style={{ flex: 1, height: '44px', borderRadius: '12px', background: '#111', border: '1px solid #1f1f1f', color: '#888', fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Kembali</button>
                  <button id="btn-konfirmasi" onClick={handleWithdraw} disabled={withdrawLoading} style={{
                    flex: 2, height: '44px', borderRadius: '12px',
                    background: withdrawLoading ? '#333' : `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
                    border: 'none', color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 700,
                    cursor: withdrawLoading ? 'not-allowed' : 'pointer',
                  }}>
                    {withdrawLoading ? '⏳ Memproses...' : 'Ya, Cairkan'}
                  </button>
                </div>
              </>
            )}

            {step === 'success' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Permintaan Dikirim!</h2>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '24px', lineHeight: 1.6 }}>Dana akan diproses dalam 1×24 jam kerja.</p>
                <button id="btn-selesai" onClick={handleClose} style={{
                  width: '100%', height: '44px', borderRadius: '60px',
                  background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
                  border: 'none', color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                }}>Selesai</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

