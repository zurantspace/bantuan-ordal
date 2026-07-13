'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AFFILIATE_TRANSACTIONS, AFFILIATE_STATS } from '@/lib/mockData';
import type { AffiliateTransaction } from '@/lib/mockData';

type FilterType = 'all' | 'transaction' | 'click';

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  approved: { bg: '#0a2a0a', color: '#4ade80', label: 'Disetujui' },
  pending:  { bg: '#2a1a00', color: '#fbbf24', label: 'Pending' },
  paid:     { bg: '#0a1a2a', color: '#60a5fa', label: 'Dibayar' },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatRp(n: number) {
  return `Rp ${n.toLocaleString('id-ID')}`;
}

export default function AffiliateTransactionsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered: AffiliateTransaction[] = AFFILIATE_TRANSACTIONS.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const totalComm = AFFILIATE_TRANSACTIONS.reduce((sum, t) => sum + t.commission, 0);
  const pendingComm = AFFILIATE_TRANSACTIONS
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.commission, 0);

  const TABS: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Semua' },
    { key: 'transaction', label: 'Transaksi' },
    { key: 'click', label: 'Klik' },
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
          >←</button>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
              Riwayat Transaksi
            </div>
            <div style={{ fontSize: '10px', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
              Komisi & klik affiliate
            </div>
          </div>
        </div>

        <div style={{ padding: '0 20px' }}>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'Total Komisi', value: formatRp(totalComm), icon: '💰', color: '#f1301e' },
              { label: 'Pending Cair', value: formatRp(pendingComm), icon: '⏳', color: '#fbbf24' },
            ].map((c, i) => (
              <div key={i} style={{
                background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: '14px',
                padding: '16px',
              }}>
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>{c.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: c.color, fontFamily: 'Poppins, sans-serif' }}>
                  {c.value}
                </div>
                <div style={{ fontSize: '9px', color: '#555', fontFamily: 'Poppins, sans-serif', marginTop: '2px' }}>
                  {c.label}
                </div>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div style={{
            display: 'flex', background: '#0d0d0d', borderRadius: '12px',
            padding: '4px', marginBottom: '16px', border: '1px solid #1f1f1f',
          }}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                style={{
                  flex: 1, height: '36px', borderRadius: '9px',
                  background: filter === tab.key
                    ? 'linear-gradient(90deg, #f1301e, #9f2315)'
                    : 'transparent',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif', fontSize: '11px',
                  fontWeight: 700, color: filter === tab.key ? '#fff' : '#555',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Transactions list */}
          {filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '40px 0',
              fontFamily: 'Poppins, sans-serif', color: '#444', fontSize: '12px',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
              Belum ada transaksi
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map((t) => {
                const s = STATUS_STYLE[t.status] ?? STATUS_STYLE.pending;
                return (
                  <div key={t.id} style={{
                    background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '14px',
                    padding: '14px 16px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      {/* Left */}
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                          background: t.type === 'transaction' ? '#0a1a0a' : '#0a0a1a',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '18px',
                          border: `1px solid ${t.type === 'transaction' ? '#1a3a1a' : '#1a1a3a'}`,
                        }}>
                          {t.type === 'transaction' ? '💳' : '👆'}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '11px', fontWeight: 700, color: '#fff',
                            fontFamily: 'Poppins, sans-serif', marginBottom: '2px',
                          }}>
                            {t.type === 'transaction' ? 'Transaksi Berhasil' : 'Klik Unik'}
                          </div>
                          <div style={{ fontSize: '9px', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                            {formatDate(t.date)}
                          </div>
                          {t.amount > 0 && (
                            <div style={{ fontSize: '9px', color: '#666', fontFamily: 'Poppins, sans-serif', marginTop: '2px' }}>
                              Order: {formatRp(t.amount)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '13px', fontWeight: 800, color: '#4ade80',
                          fontFamily: 'Poppins, sans-serif', marginBottom: '4px',
                        }}>
                          +{formatRp(t.commission)}
                        </div>
                        <div style={{
                          display: 'inline-block',
                          background: s.bg, color: s.color,
                          borderRadius: '6px', padding: '2px 8px',
                          fontSize: '9px', fontWeight: 700, fontFamily: 'Poppins, sans-serif',
                        }}>
                          {s.label}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer info */}
          <div style={{
            marginTop: '16px', padding: '12px 14px',
            background: '#080808', border: '1px solid #1a1a1a', borderRadius: '10px',
            display: 'flex', gap: '10px', alignItems: 'center',
          }}>
            <span style={{ fontSize: '14px' }}>ℹ️</span>
            <p style={{
              fontSize: '9px', color: '#444', fontFamily: 'Poppins, sans-serif',
              margin: 0, lineHeight: '1.6',
            }}>
              Komisi berstatus <strong style={{ color: '#fbbf24' }}>Pending</strong> akan disetujui otomatis setelah 7 hari (masa refund habis).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
