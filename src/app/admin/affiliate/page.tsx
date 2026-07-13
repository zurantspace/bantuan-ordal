'use client';

import { useState } from 'react';

type AffStatus = 'active' | 'suspended' | 'pending';
type WithdrawStatus = 'pending' | 'processing' | 'paid' | 'rejected';

const AFFILIATES = [
  { id: 'AFF-001', name: 'Budi Santoso',    code: 'BUDI50',   email: 'budi@gmail.com',   clicks: 1240, transactions: 48, balance: 875000,  earned: 2400000, status: 'active' as AffStatus,    joined: '2026-05-01' },
  { id: 'AFF-002', name: 'Sari Dewi',       code: 'SARI25',   email: 'sari@gmail.com',   clicks: 893,  transactions: 31, balance: 612500,  earned: 1550000, status: 'active' as AffStatus,    joined: '2026-05-10' },
  { id: 'AFF-003', name: 'Yoga Pratama',    code: 'YOGA99',   email: 'yoga@gmail.com',   clicks: 456,  transactions: 12, balance: 237500,  earned: 600000,  status: 'active' as AffStatus,    joined: '2026-06-01' },
  { id: 'AFF-004', name: 'Diana Marlina',   code: 'DIANA10',  email: 'diana@gmail.com',  clicks: 234,  transactions: 7,  balance: 137500,  earned: 350000,  status: 'pending' as AffStatus,  joined: '2026-07-01' },
  { id: 'AFF-005', name: 'Rizky Maulana',   code: 'RIZKY77',  email: 'rizky@gmail.com',  clicks: 89,   transactions: 3,  balance: 62500,   earned: 150000,  status: 'suspended' as AffStatus, joined: '2026-06-15' },
];

const WITHDRAWALS = [
  { id: 'WD-001', affiliateName: 'Budi Santoso',  method: 'GoPay',  account: '0812345678', amount: 500000, status: 'pending' as WithdrawStatus,    date: '2026-07-11' },
  { id: 'WD-002', affiliateName: 'Sari Dewi',      method: 'OVO',    account: '0823456789', amount: 400000, status: 'processing' as WithdrawStatus, date: '2026-07-10' },
  { id: 'WD-003', affiliateName: 'Yoga Pratama',   method: 'Bank',   account: '1234567890', amount: 200000, status: 'paid' as WithdrawStatus,       date: '2026-07-08' },
];

const AFF_STATUS: Record<AffStatus, { bg: string; color: string; label: string }> = {
  active:    { bg: '#0a2a0a', color: '#4ade80', label: '● Aktif' },
  suspended: { bg: '#2a0a0a', color: '#f87171', label: '● Suspended' },
  pending:   { bg: '#2a1a00', color: '#fbbf24', label: '● Pending' },
};

const WD_STATUS: Record<WithdrawStatus, { bg: string; color: string; label: string }> = {
  pending:    { bg: '#2a1a00', color: '#fbbf24', label: 'Pending' },
  processing: { bg: '#0a1a2a', color: '#60a5fa', label: 'Diproses' },
  paid:       { bg: '#0a2a0a', color: '#4ade80', label: 'Dibayar' },
  rejected:   { bg: '#2a0a0a', color: '#f87171', label: 'Ditolak' },
};

function formatRp(n: number) { return `Rp ${n.toLocaleString('id-ID')}`; }

export default function AdminAffiliate() {
  const [affiliates, setAffiliates] = useState(AFFILIATES);
  const [withdrawals, setWithdrawals] = useState(WITHDRAWALS);
  const [activeTab, setActiveTab] = useState<'affiliates' | 'withdrawals'>('affiliates');
  const [search, setSearch] = useState('');

  const toggleStatus = (id: string) => {
    setAffiliates(prev => prev.map(a => a.id === id
      ? { ...a, status: a.status === 'active' ? 'suspended' as AffStatus : 'active' as AffStatus }
      : a
    ));
  };

  const approveWithdraw = (id: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'paid' as WithdrawStatus } : w));
  };

  const filtered = affiliates.filter(a =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.code.toLowerCase().includes(search.toLowerCase())
  );

  const totalEarned = affiliates.reduce((s, a) => s + a.earned, 0);
  const totalPending = withdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + w.amount, 0);

  return (
    <div style={{ padding: '24px', fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0 }}>Manajemen Affiliate</h1>
        <p style={{ fontSize: '11px', color: '#555', margin: '4px 0 0' }}>
          {affiliates.length} affiliator · Komisi terbayar: {formatRp(totalEarned)}
        </p>
      </div>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Affiliator', value: affiliates.length, icon: '🤝', color: '#60a5fa' },
          { label: 'Aktif',      value: affiliates.filter(a => a.status === 'active').length, icon: '✅', color: '#4ade80' },
          { label: 'Komisi Total', value: formatRp(totalEarned), icon: '💰', color: '#f1301e' },
          { label: 'Antrian Cair', value: formatRp(totalPending), icon: '⏳', color: '#fbbf24' },
        ].map((c, i) => (
          <div key={i} style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '14px' }}>
            <div style={{ fontSize: '18px', marginBottom: '4px' }}>{c.icon}</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: '9px', color: '#444' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', background: '#0d0d0d', borderRadius: '12px',
        padding: '4px', marginBottom: '20px', border: '1px solid #1f1f1f', width: 'fit-content',
      }}>
        {[
          { key: 'affiliates', label: `Affiliator (${affiliates.length})` },
          { key: 'withdrawals', label: `Pencairan (${withdrawals.filter(w => w.status === 'pending').length} pending)` },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)} style={{
            padding: '8px 20px', borderRadius: '9px',
            background: activeTab === tab.key ? 'linear-gradient(90deg, #f1301e, #9f2315)' : 'transparent',
            border: 'none', cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: 700,
            color: activeTab === tab.key ? '#fff' : '#555', transition: 'all 0.2s',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'affiliates' ? (
        <>
          {/* Search */}
          <div style={{
            height: '40px', background: '#0d0d0d', border: '1px solid #2a2a2a',
            borderRadius: '10px', display: 'flex', alignItems: 'center', padding: '0 14px', gap: '8px',
            marginBottom: '16px',
          }}>
            <span style={{ color: '#555' }}>🔍</span>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama atau kode..."
              style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '12px', width: '100%', fontFamily: 'Poppins, sans-serif' }}
            />
          </div>

          {/* Table */}
          <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                <thead style={{ background: '#080808' }}>
                  <tr>
                    {['Affiliator', 'Kode', 'Klik', 'Transaksi', 'Saldo', 'Total Earned', 'Status', 'Aksi'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '9px', fontWeight: 700, color: '#444', letterSpacing: '0.5px', borderBottom: '1px solid #1a1a1a' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => {
                    const s = AFF_STATUS[a.status];
                    return (
                      <tr key={a.id} style={{ borderBottom: '1px solid #111' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontSize: '11px', color: '#ccc', fontWeight: 600 }}>{a.name}</div>
                          <div style={{ fontSize: '9px', color: '#444' }}>{a.email}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            background: 'rgba(241,48,30,0.1)', border: '1px solid rgba(241,48,30,0.3)',
                            borderRadius: '6px', padding: '2px 8px', fontSize: '10px', fontWeight: 700, color: '#f1301e',
                          }}>{a.code}</span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '11px', color: '#888' }}>{a.clicks.toLocaleString('id-ID')}</td>
                        <td style={{ padding: '14px 16px', fontSize: '11px', color: '#888' }}>{a.transactions}</td>
                        <td style={{ padding: '14px 16px', fontSize: '11px', fontWeight: 700, color: '#fbbf24' }}>{formatRp(a.balance)}</td>
                        <td style={{ padding: '14px 16px', fontSize: '11px', fontWeight: 700, color: '#4ade80' }}>{formatRp(a.earned)}</td>
                        <td style={{ padding: '14px 16px', fontSize: '10px', color: s.color }}>{s.label}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <button onClick={() => toggleStatus(a.id)} style={{
                            height: '28px', padding: '0 12px', borderRadius: '6px',
                            background: 'transparent',
                            border: `1px solid ${a.status === 'active' ? '#2a0a0a' : '#0a2a0a'}`,
                            cursor: 'pointer', fontSize: '9px',
                            color: a.status === 'active' ? '#f87171' : '#4ade80',
                            fontFamily: 'Poppins, sans-serif', fontWeight: 600,
                          }}>
                            {a.status === 'active' ? 'Suspend' : 'Aktifkan'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Withdrawals tab */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {withdrawals.map(w => {
            const s = WD_STATUS[w.status];
            return (
              <div key={w.id} style={{
                background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '14px', padding: '16px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px',
              }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{w.affiliateName}</div>
                  <div style={{ fontSize: '10px', color: '#555', marginBottom: '6px' }}>{w.method} · {w.account} · {w.date}</div>
                  <span style={{
                    display: 'inline-block', background: s.bg, color: s.color,
                    borderRadius: '6px', padding: '2px 8px', fontSize: '9px', fontWeight: 700,
                  }}>{s.label}</span>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#f1301e', marginBottom: '8px' }}>
                    {formatRp(w.amount)}
                  </div>
                  {w.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => approveWithdraw(w.id)} style={{
                        height: '30px', padding: '0 14px', borderRadius: '8px',
                        background: 'linear-gradient(90deg, #22c55e, #16a34a)', border: 'none',
                        cursor: 'pointer', fontSize: '10px', fontWeight: 700, color: '#fff', fontFamily: 'Poppins, sans-serif',
                      }}>✓ Approve</button>
                      <button style={{
                        height: '30px', padding: '0 14px', borderRadius: '8px',
                        background: 'transparent', border: '1px solid #2a0a0a',
                        cursor: 'pointer', fontSize: '10px', color: '#f87171', fontFamily: 'Poppins, sans-serif', fontWeight: 600,
                      }}>✕ Tolak</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
