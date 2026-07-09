'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AFFILIATE_STATS, WITHDRAWAL_HISTORY } from '@/lib/mockData';

// Wallet HTML canvas: 393×936px
const CANVAS_HEIGHT = 936;

export default function WalletPage() {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [method, setMethod] = useState('gopay');
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(amount, 10);
    if (amt < 50000) { setError('Minimum pencairan Rp50.000'); return; }
    if (amt > AFFILIATE_STATS.balance) { setError('Saldo tidak mencukupi'); return; }
    if (!account.trim()) { setError('Nomor akun wajib diisi'); return; }
    setSubmitted(true);
    setError('');
  };

  return (
    <div style={{ position: 'relative', width: '393px', margin: '0 auto' }}>
      {/* ── Pixel-perfect HTML design ── */}
      <iframe
        src="/design/wallet/index.html"
        width="393"
        height={CANVAS_HEIGHT}
        scrolling="no"
        style={{ border: 'none', display: 'block', pointerEvents: 'none' }}
        title="wallet-design"
      />

      {/* ── Interactive overlay ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '393px', height: `${CANVAS_HEIGHT}px`,
        pointerEvents: 'none',
      }}>
        {/* Tab nav – Watch */}
        <button id="tab-watch" onClick={() => router.push('/watch/1')}
          style={{ position: 'absolute', top: 428, left: 20, width: 90, height: 34, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }} />
        {/* Tab nav – Wallet (active, stays) */}
        <button id="tab-wallet" onClick={() => {}}
          style={{ position: 'absolute', top: 428, left: 118, width: 90, height: 34, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }} />
        {/* Tab nav – Affiliate */}
        <button id="tab-affiliate" onClick={() => router.push('/affiliate')}
          style={{ position: 'absolute', top: 428, left: 218, width: 90, height: 34, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }} />
        {/* Tab nav – Setting */}
        <button id="tab-setting" onClick={() => router.push('/settings')}
          style={{ position: 'absolute', top: 428, left: 318, width: 75, height: 34, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }} />

        {/* Cairkan Dana button (red gradient button) */}
        <button id="btn-cairkan"
          onClick={() => setModal(true)}
          style={{ position: 'absolute', top: 753, left: 203, width: 169, height: 53, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label="Cairkan Dana" />

        {/* Apa Itu Affiliate? button */}
        <button id="btn-affiliate-info"
          onClick={() => router.push('/affiliate')}
          style={{ position: 'absolute', top: 753, left: 20, width: 168, height: 53, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label="Apa Itu Affiliate?" />
      </div>

      {/* ══ Withdrawal Modal ══ */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}>
          <div style={{
            width: '393px', background: '#0d0d0d',
            borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
            padding: '24px 20px 40px',
            border: '1px solid #2a2a2a',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>
                Cairkan Dana
              </h2>
              <button onClick={() => { setModal(false); setSubmitted(false); setError(''); }}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>

            {!submitted ? (
              <form onSubmit={handleWithdraw}>
                {/* Method */}
                <label style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: 700, color: '#fff', display: 'block', marginBottom: '8px' }}>Metode Pembayaran</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                  {[{ val: 'gopay', label: 'GoPay 💚' }, { val: 'ovo', label: 'OVO 💜' }, { val: 'bank', label: 'Bank 🏦' }].map(m => (
                    <button key={m.val} type="button" onClick={() => setMethod(m.val)}
                      style={{
                        height: '36px', borderRadius: '8px',
                        border: method === m.val ? 'none' : '1px solid #2a2a2a',
                        background: method === m.val ? 'linear-gradient(90deg, #f1301e, #9f2315)' : '#0a0a0a',
                        cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '9px', fontWeight: 600, color: '#fff',
                      }}>
                      {m.label}
                    </button>
                  ))}
                </div>

                <label style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: 700, color: '#fff', display: 'block', marginBottom: '6px' }}>
                  {method === 'bank' ? 'Nomor Rekening' : 'Nomor Akun'}
                </label>
                <input type="text" placeholder={method === 'bank' ? '1234567890' : '08xxxxxxxxx'}
                  value={account} onChange={e => setAccount(e.target.value)}
                  style={{ width: '100%', height: '40px', borderRadius: '10px', border: '1px solid #3a3a3a', background: '#0a0a0a', color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '13px', padding: '0 12px', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }} />

                <label style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: 700, color: '#fff', display: 'block', marginBottom: '6px' }}>Jumlah (Rp)</label>
                <input type="number" placeholder="50000" value={amount} onChange={e => setAmount(e.target.value)}
                  style={{ width: '100%', height: '40px', borderRadius: '10px', border: '1px solid #3a3a3a', background: '#0a0a0a', color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '13px', padding: '0 12px', outline: 'none', boxSizing: 'border-box', marginBottom: '4px' }} />
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '9px', color: '#555', marginBottom: '14px' }}>
                  Saldo: Rp{AFFILIATE_STATS.balance.toLocaleString('id-ID')} | Min. Rp50.000
                </p>

                {error && <p style={{ color: '#ef4444', fontSize: '11px', marginBottom: '10px' }}>⚠️ {error}</p>}

                <button type="submit" style={{
                  width: '100%', height: '44px', borderRadius: '12px',
                  background: 'linear-gradient(90deg, #f1301e, #9f2315)',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 700, color: '#fff',
                }}>
                  Ajukan Pencairan
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>✅</span>
                <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 700, color: '#4ade80', marginBottom: '8px' }}>
                  Permintaan Terkirim!
                </h3>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', color: '#888' }}>
                  Dana akan masuk dalam 1×24 jam kerja.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
