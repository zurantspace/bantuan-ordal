'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { AFFILIATE_STATS, WITHDRAWAL_HISTORY } from '@/lib/mockData';
import type { AuthUser } from '@/lib/auth';

const RED = '#f1301e';
const RED_DARK = '#9f2315';
const CARD_BG = '#101010';
const BORDER = '#3a3a3a';
const BORDER_DARK = '#1f1f1f';

function formatRp(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

type Method = { id: string; label: string; placeholder: string };
const METHODS: Method[] = [
  { id: 'gopay',   label: 'GoPay',               placeholder: '08xxxxxxxxxx' },
  { id: 'ovo',     label: 'OVO',                 placeholder: '08xxxxxxxxxx' },
  { id: 'bca',     label: 'Transfer Bank BCA',   placeholder: 'Nomor rekening BCA' },
  { id: 'bri',     label: 'Transfer Bank BRI',   placeholder: 'Nomor rekening BRI' },
  { id: 'mandiri', label: 'Transfer Bank Mandiri', placeholder: 'Nomor rekening Mandiri' },
];

const MIN_WITHDRAW = 50000;

function SidebarProfile({ user, router }: { user: AuthUser | null; router: ReturnType<typeof useRouter> }) {
  const now = new Date();
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

  return (
    <div style={{ width: '260px', flexShrink: 0, marginRight: 'clamp(20px, 3vw, 40px)' }}>
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
            background: '#272727', border: `2px solid ${RED}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#fff',
          }}>{user?.name?.[0] || '👤'}</div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'Member'}</p>
            <p style={{ fontSize: '10px', color: '#737373', marginTop: '2px' }}>Member since {months[now.getMonth()]} {now.getDate()}, {now.getFullYear()}</p>
            <p style={{ fontSize: '10px', fontWeight: 700, color: user?.tier === 'premium' ? '#fbbf24' : '#fff', marginTop: '4px' }}>
              {user?.tier === 'premium' ? 'VIP Premium' : 'Standard'}
            </p>
          </div>
        </div>

        {[
          { label: 'Watch',     path: '/home',      icon: '▶' },
          { label: 'Wallet',    path: '/wallet',    icon: '💰' },
          { label: 'Affiliate', path: '/affiliate', icon: '🤝' },
          { label: 'Setting',   path: '/settings',  icon: '⚙️' },
        ].map(item => (
          <button key={item.path} onClick={() => router.push(item.path)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '13px', color: item.path === '/wallet' ? '#fff' : '#888', fontFamily: 'Poppins, sans-serif', textAlign: 'left',
            borderBottom: '1px solid #1a1a1a', transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#fff'}
            onMouseLeave={e => { if (item.path !== '/wallet') (e.currentTarget as HTMLButtonElement).style.color = '#888'; }}
          >
            <span style={{ fontSize: '14px', width: '20px' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function WalletPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [method, setMethod]       = useState(METHODS[0]);
  const [account, setAccount]     = useState('');
  const [amount, setAmount]       = useState('');
  const [step, setStep]           = useState<'form' | 'confirm' | 'success'>('form');

  useEffect(() => {
    (async () => { const u = await getUser(); if (u) setUser(u); })();
  }, []);

  const balance   = AFFILIATE_STATS.unpaidCommission;
  const amountNum = parseInt(amount.replace(/\D/g, ''), 10) || 0;
  const isValid   = account.length >= 8 && amountNum >= MIN_WITHDRAW && amountNum <= balance;

  function handleClose() {
    setShowModal(false); setStep('form'); setAccount(''); setAmount('');
  }

  const STATS = [
    { label: 'Total Commission',    value: formatRp(AFFILIATE_STATS.totalEarned) },
    { label: 'Paid Commission',     value: formatRp(AFFILIATE_STATS.paidCommission) },
    { label: 'Unpaid Commission',   value: formatRp(AFFILIATE_STATS.unpaidCommission) },
    { label: 'Total Leads',         value: String(AFFILIATE_STATS.totalLeads) },
    { label: 'Lead Verified',       value: String(AFFILIATE_STATS.leadsVerified) },
    { label: 'Lead Unverified',     value: String(AFFILIATE_STATS.leadsUnverified) },
  ];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>

      <div style={{
        display: 'flex', maxWidth: '1200px', margin: '0 auto',
        padding: 'clamp(24px, 4vw, 48px) clamp(16px, 4vw, 40px)',
        paddingBottom: '120px', alignItems: 'flex-start',
      }}>
        {/* Sidebar — hidden on mobile */}
        <div style={{ display: 'none' }} className="wallet-sidebar">
          <SidebarProfile user={user} router={router} />
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Summary heading */}
          <h1 style={{ fontSize: 'clamp(18px, 2.5vw, 28px)', fontWeight: 700, color: '#fff', marginBottom: '20px' }}>Summary</h1>

          {/* 6-stat grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))',
            gap: 'clamp(10px, 2vw, 16px)',
            marginBottom: 'clamp(24px, 3vw, 40px)',
          }}>
            {STATS.map(s => (
              <div key={s.label} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '14px 16px' }}>
                <p style={{ fontSize: 'clamp(9px, 1vw, 11px)', color: '#737373', marginBottom: '6px', lineHeight: 1.3 }}>{s.label}</p>
                <p style={{ fontSize: 'clamp(14px, 1.8vw, 20px)', fontWeight: 800, color: '#fff' }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Cairkan Dana button */}
          <button
            id="btn-cairkan"
            onClick={() => { setShowModal(true); setStep('form'); }}
            disabled={balance < MIN_WITHDRAW}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              width: '100%', maxWidth: '320px', height: '48px',
              borderRadius: '60px', border: 'none',
              background: balance >= MIN_WITHDRAW ? `linear-gradient(90deg, ${RED}, ${RED_DARK})` : '#1a1a1a',
              color: balance >= MIN_WITHDRAW ? '#fff' : '#555',
              fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(13px, 1.4vw, 16px)', fontWeight: 700,
              cursor: balance >= MIN_WITHDRAW ? 'pointer' : 'not-allowed',
              boxShadow: balance >= MIN_WITHDRAW ? '0 0 24px rgba(241,48,30,0.35)' : 'none',
              marginBottom: 'clamp(24px, 3vw, 40px)',
            }}
          >
            Cairkan Dana
          </button>

          {/* "Apa Itu Affiliate?" */}
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: 'clamp(16px, 2.5vw, 24px)', marginBottom: 'clamp(20px, 3vw, 32px)' }}>
            <h2 style={{ fontSize: 'clamp(15px, 2vw, 20px)', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>Apa Itu Affiliate?</h2>
            <p style={{ fontSize: 'clamp(12px, 1.3vw, 15px)', color: '#737373', lineHeight: 1.6 }}>
              Program afiliasi Bantuan Ordal memungkinkan kamu mendapatkan komisi <strong style={{ color: '#fff' }}>50% per transaksi</strong> dengan cara mempromosikan link referral kamu kepada orang lain. Setiap kali seseorang membeli melalui link kamu, komisi langsung masuk ke saldo afiliasimu secara otomatis.
            </p>
          </div>

          {/* History */}
          <h2 style={{ fontSize: 'clamp(15px, 2vw, 20px)', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>History</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {WITHDRAWAL_HISTORY.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px', color: '#737373', fontSize: '13px' }}>Belum ada riwayat penarikan</div>
            )}
            {WITHDRAWAL_HISTORY.map(wd => (
              <div key={wd.id} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ fontSize: '22px', flexShrink: 0 }}>💸</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 'clamp(12px, 1.3vw, 14px)', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{wd.method}</p>
                  <p style={{ fontSize: 'clamp(10px, 1.1vw, 12px)', color: '#737373' }}>{wd.date} · {wd.account}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 'clamp(13px, 1.4vw, 16px)', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{formatRp(wd.amount)}</p>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#4ade80', background: 'rgba(74,222,128,0.08)', border: '1px solid #4ade8033', borderRadius: '20px', padding: '2px 8px' }}>✓ Selesai</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div style={{
            background: '#0d0d0d', borderRadius: '24px',
            padding: 'clamp(20px, 3vw, 32px)', width: '100%', maxWidth: '480px',
            border: `1px solid ${BORDER_DARK}`,
          }}>
            <div style={{ width: '40px', height: '4px', background: '#333', borderRadius: '2px', margin: '0 auto 24px' }} />

            {step === 'form' && (
              <>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '20px' }}>Cairkan Dana</h2>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#737373', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>METODE PEMBAYARAN</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {METHODS.map(m => (
                      <button key={m.id} id={`method-${m.id}`} onClick={() => setMethod(m)} style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px',
                        background: method.id === m.id ? 'rgba(241,48,30,0.08)' : '#0a0a0a',
                        border: `1px solid ${method.id === m.id ? RED + '55' : BORDER_DARK}`,
                        borderRadius: '12px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', textAlign: 'left',
                      }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: method.id === m.id ? '#fff' : '#888' }}>{m.label}</span>
                        {method.id === m.id && <span style={{ marginLeft: 'auto', color: RED, fontSize: '14px' }}>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#737373', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>NOMOR AKUN</label>
                  <input id="input-account" type="text" placeholder={method.placeholder} value={account} onChange={e => setAccount(e.target.value)}
                    style={{ width: '100%', height: '44px', background: '#0a0a0a', border: `1px solid ${BORDER_DARK}`, borderRadius: '12px', padding: '0 14px', color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#737373', letterSpacing: '1px', display: 'block', marginBottom: '8px' }}>JUMLAH (Saldo: {formatRp(balance)})</label>
                  <input id="input-amount" type="number" placeholder={`Min. ${formatRp(MIN_WITHDRAW)}`} value={amount} onChange={e => setAmount(e.target.value)}
                    style={{ width: '100%', height: '44px', background: '#0a0a0a', border: `1px solid ${BORDER_DARK}`, borderRadius: '12px', padding: '0 14px', color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                  {amountNum > 0 && amountNum < MIN_WITHDRAW && <p style={{ fontSize: '10px', color: '#ef4444', marginTop: '4px' }}>⚠ Minimum {formatRp(MIN_WITHDRAW)}</p>}
                </div>

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
                <div style={{ background: '#0a0a0a', border: `1px solid ${BORDER_DARK}`, borderRadius: '14px', padding: '18px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[{ label: 'Metode', value: method.label }, { label: 'Nomor Akun', value: account }, { label: 'Jumlah', value: formatRp(amountNum) }].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#737373' }}>{r.label}</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{r.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setStep('form')} style={{ flex: 1, height: '44px', borderRadius: '12px', background: '#111', border: `1px solid ${BORDER_DARK}`, color: '#888', fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Kembali</button>
                  <button id="btn-konfirmasi" onClick={() => setStep('success')} style={{ flex: 2, height: '44px', borderRadius: '12px', background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`, border: 'none', color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Ya, Cairkan</button>
                </div>
              </>
            )}

            {step === 'success' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Permintaan Dikirim!</h2>
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '24px', lineHeight: 1.6 }}>Dana akan diproses dalam 1×24 jam kerja.</p>
                <button id="btn-selesai" onClick={handleClose} style={{ width: '100%', height: '44px', borderRadius: '60px', background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`, border: 'none', color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>Selesai</button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .wallet-sidebar { display: block !important; }
        }
      `}</style>
    </div>
  );
}
