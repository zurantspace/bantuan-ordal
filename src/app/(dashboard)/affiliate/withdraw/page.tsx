'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AFFILIATE_STATS, WITHDRAWAL_HISTORY } from '@/lib/mockData';

type Method = 'gopay' | 'ovo' | 'bank';

const METHODS: { key: Method; label: string; icon: string; placeholder: string }[] = [
  { key: 'gopay', label: 'GoPay',        icon: '💚', placeholder: '0812xxxxxxx' },
  { key: 'ovo',   label: 'OVO',          icon: '💜', placeholder: '0812xxxxxxx' },
  { key: 'bank',  label: 'Bank',         icon: '🏦', placeholder: 'No. Rekening' },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  completed:  { bg: '#0a2a0a', color: '#4ade80', label: 'Selesai' },
  processing: { bg: '#0a1a2a', color: '#60a5fa', label: 'Diproses' },
  pending:    { bg: '#2a1a00', color: '#fbbf24', label: 'Pending' },
};

function formatRp(n: number) {
  return `Rp ${n.toLocaleString('id-ID')}`;
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AffiliateWithdrawPage() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>('gopay');
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const balance = AFFILIATE_STATS.balance;
  const minWithdraw = 50000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const amt = parseInt(amount, 10) || 0;
    if (!account.trim()) { setError('Nomor akun wajib diisi'); return; }
    if (amt < minWithdraw) { setError(`Minimum pencairan ${formatRp(minWithdraw)}`); return; }
    if (amt > balance) { setError('Saldo tidak mencukupi'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const selectedMethod = METHODS.find(m => m.key === method)!;

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
          >←</button>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
              Cairkan Komisi
            </div>
            <div style={{ fontSize: '10px', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
              Transfer ke rekening / e-wallet
            </div>
          </div>
        </div>

        <div style={{ padding: '0 20px' }}>
          {/* Balance card */}
          <div style={{
            borderRadius: '16px', padding: '20px', marginBottom: '20px',
            background: 'linear-gradient(135deg, #1a0505 0%, #0d0d0d 60%)',
            border: '1px solid #3a1a1a', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-30px', right: '-30px',
              width: '150px', height: '150px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(241,48,30,0.1) 0%, transparent 70%)',
              filter: 'blur(20px)', pointerEvents: 'none',
            }} />
            <div style={{ fontSize: '10px', color: '#555', fontFamily: 'Poppins, sans-serif', marginBottom: '6px' }}>
              Saldo Tersedia
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#f1301e', fontFamily: 'Poppins, sans-serif' }}>
              {formatRp(balance)}
            </div>
            <div style={{ fontSize: '9px', color: '#444', fontFamily: 'Poppins, sans-serif', marginTop: '4px' }}>
              Min. pencairan: {formatRp(minWithdraw)} · Proses 1×24 jam kerja
            </div>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              {/* Method selector */}
              <div style={{
                background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '16px',
                padding: '20px', marginBottom: '14px',
              }}>
                <div style={{
                  fontSize: '10px', fontWeight: 700, color: '#555',
                  fontFamily: 'Poppins, sans-serif', letterSpacing: '1px', marginBottom: '14px',
                }}>
                  METODE PENCAIRAN
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {METHODS.map(m => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setMethod(m.key)}
                      style={{
                        height: '64px', borderRadius: '12px', border: 'none',
                        background: method === m.key
                          ? 'linear-gradient(135deg, #1a0505, #2a0808)'
                          : '#080808',
                        outline: method === m.key ? '1.5px solid #f1301e' : '1px solid #2a2a2a',
                        cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        justifyContent: 'center', gap: '4px',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: '22px' }}>{m.icon}</span>
                      <span style={{
                        fontSize: '10px', fontWeight: 700, color: method === m.key ? '#fff' : '#555',
                        fontFamily: 'Poppins, sans-serif',
                      }}>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Account & Amount */}
              <div style={{
                background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '16px',
                padding: '20px', marginBottom: '14px',
              }}>
                {/* Account */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block', fontSize: '10px', fontWeight: 700, color: '#fff',
                    fontFamily: 'Poppins, sans-serif', marginBottom: '8px',
                  }}>
                    {method === 'bank' ? 'Nomor Rekening' : `Nomor ${selectedMethod.label}`}
                  </label>
                  <input
                    type="text"
                    value={account}
                    onChange={e => setAccount(e.target.value)}
                    placeholder={selectedMethod.placeholder}
                    style={{
                      width: '100%', height: '44px', borderRadius: '10px',
                      border: '1px solid #3a3a3a', background: '#080808',
                      color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '13px',
                      padding: '0 14px', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Amount */}
                <div>
                  <label style={{
                    display: 'block', fontSize: '10px', fontWeight: 700, color: '#fff',
                    fontFamily: 'Poppins, sans-serif', marginBottom: '8px',
                  }}>
                    Jumlah Pencairan (Rp)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="50000"
                    min={minWithdraw}
                    max={balance}
                    style={{
                      width: '100%', height: '44px', borderRadius: '10px',
                      border: '1px solid #3a3a3a', background: '#080808',
                      color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '13px',
                      padding: '0 14px', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                  {/* Quick amount buttons */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                    {[50000, 100000, 200000, balance].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setAmount(String(v))}
                        style={{
                          flex: 1, height: '26px', borderRadius: '6px',
                          background: '#0a0a0a', border: '1px solid #2a2a2a',
                          cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                          fontSize: '8px', color: '#888', fontWeight: 600,
                        }}
                      >
                        {v === balance ? 'Semua' : `${v / 1000}k`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <p style={{
                  color: '#ef4444', fontSize: '11px', fontFamily: 'Poppins, sans-serif',
                  marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  ⚠️ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', height: '50px', borderRadius: '14px',
                  background: loading ? '#333' : 'linear-gradient(90deg, #f1301e, #9f2315)',
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 700,
                  color: '#fff', boxShadow: '0 0 20px rgba(241,48,30,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                {loading ? '⏳ Memproses...' : '💸 Ajukan Pencairan'}
              </button>
            </form>
          ) : (
            /* Success state */
            <div style={{
              background: '#0d1a0d', border: '1px solid #1a3a1a', borderRadius: '20px',
              padding: '32px 20px', textAlign: 'center', marginBottom: '20px',
            }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
              <h2 style={{
                fontSize: '16px', fontWeight: 800, color: '#4ade80',
                fontFamily: 'Poppins, sans-serif', marginBottom: '8px',
              }}>
                Permintaan Terkirim!
              </h2>
              <p style={{
                fontSize: '12px', color: '#888', fontFamily: 'Poppins, sans-serif',
                lineHeight: '1.6', marginBottom: '20px',
              }}>
                Pencairanmu sedang diproses. Dana akan masuk dalam <strong style={{ color: '#fff' }}>1×24 jam</strong> hari kerja.
              </p>
              <button
                onClick={() => { setSubmitted(false); setAccount(''); setAmount(''); }}
                style={{
                  height: '40px', borderRadius: '10px', padding: '0 24px',
                  background: 'transparent', border: '1px solid #3a3a3a',
                  cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px', color: '#fff', fontWeight: 600,
                }}
              >
                Ajukan Lagi
              </button>
            </div>
          )}

          {/* History */}
          <div style={{ marginTop: '20px' }}>
            <div style={{
              fontSize: '10px', fontWeight: 700, color: '#555',
              fontFamily: 'Poppins, sans-serif', letterSpacing: '1px', marginBottom: '12px',
            }}>
              RIWAYAT PENCAIRAN
            </div>
            {WITHDRAWAL_HISTORY.map(w => {
              const s = STATUS_STYLE[w.status];
              return (
                <div key={w.id} style={{
                  background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '12px',
                  padding: '14px 16px', marginBottom: '8px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
                      {w.method}
                    </div>
                    <div style={{ fontSize: '9px', color: '#555', fontFamily: 'Poppins, sans-serif', marginTop: '2px' }}>
                      {formatDate(w.date)} · {w.account}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', fontFamily: 'Poppins, sans-serif', marginBottom: '4px' }}>
                      {formatRp(w.amount)}
                    </div>
                    <div style={{
                      display: 'inline-block', background: s.bg, color: s.color,
                      borderRadius: '6px', padding: '2px 8px',
                      fontSize: '9px', fontWeight: 700, fontFamily: 'Poppins, sans-serif',
                    }}>
                      {s.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
