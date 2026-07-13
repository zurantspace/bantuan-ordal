'use client';

import { useState } from 'react';

type Period = '1d' | '7d' | '30d' | 'all';

const PERIODS: { key: Period; label: string }[] = [
  { key: '1d',  label: '1 Hari' },
  { key: '7d',  label: '7 Hari' },
  { key: '30d', label: '30 Hari' },
  { key: 'all', label: 'All Time' },
];

const METRICS: Record<Period, { revenue: number; orders: number; visitors: number; abandoned: number; orderBumpRate: number; premiumRate: number }> = {
  '1d':  { revenue: 1250000,  orders: 25,   visitors: 843,   abandoned: 18,  orderBumpRate: 32, premiumRate: 12 },
  '7d':  { revenue: 8750000,  orders: 175,  visitors: 5902,  abandoned: 126, orderBumpRate: 35, premiumRate: 14 },
  '30d': { revenue: 37500000, orders: 750,  visitors: 25308, abandoned: 540, orderBumpRate: 33, premiumRate: 15 },
  'all': { revenue: 125000000,orders: 2500, visitors: 84260, abandoned: 1800,orderBumpRate: 34, premiumRate: 16 },
};

const REVENUE_CHART: Record<Period, number[]> = {
  '1d':  [80, 65, 90, 75, 100, 88, 95],
  '7d':  [60, 75, 85, 70, 90, 95, 80],
  '30d': [55, 60, 70, 65, 80, 75, 85, 90, 88, 95, 70, 75],
  'all': [40, 55, 65, 70, 80, 85, 90, 88, 92, 95, 88, 100],
};

const TRAFFIC_SOURCES = [
  { label: 'Meta Ads',   value: 35, color: '#4267B2' },
  { label: 'Affiliate',  value: 28, color: '#f1301e' },
  { label: 'TikTok Ads', value: 18, color: '#010101' },
  { label: 'Organic',    value: 12, color: '#22c55e' },
  { label: 'Lainnya',    value: 7,  color: '#555' },
];

function formatRp(n: number) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}rb`;
  return `Rp ${n}`;
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState<Period>('7d');
  const m = METRICS[period];
  const chart = REVENUE_CHART[period];
  const maxBar = Math.max(...chart);

  const CARDS = [
    { icon: '💰', label: 'Total Revenue', value: formatRp(m.revenue), sub: `${m.orders} transaksi berhasil`, color: '#f1301e' },
    { icon: '🛒', label: 'Total Orders', value: m.orders.toLocaleString('id-ID'), sub: `${m.abandoned} abandoned`, color: '#fbbf24' },
    { icon: '👁️', label: 'Visitors', value: m.visitors.toLocaleString('id-ID'), sub: 'Unique pageviews', color: '#60a5fa' },
    { icon: '📦', label: 'Order Bump Rate', value: `${m.orderBumpRate}%`, sub: `${m.premiumRate}% upgrade premium`, color: '#a78bfa' },
  ];

  const RECENT_ORDERS = [
    { name: 'Andi Firmansyah',    email: 'andi@gmail.com',    amount: 97000,  status: 'paid',    bump: true },
    { name: 'Sari Dewi',          email: 'sari@gmail.com',    amount: 50000,  status: 'paid',    bump: false },
    { name: 'Budi Santoso',       email: 'budi@gmail.com',    amount: 50000,  status: 'pending', bump: false },
    { name: 'Lina Marlina',       email: 'lina@gmail.com',    amount: 97000,  status: 'paid',    bump: true },
    { name: 'Rizky Maulana',      email: 'rizky@gmail.com',   amount: 50000,  status: 'failed',  bump: false },
  ];

  const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
    paid:    { bg: '#0a2a0a', color: '#4ade80', label: 'Dibayar' },
    pending: { bg: '#2a1a00', color: '#fbbf24', label: 'Pending' },
    failed:  { bg: '#2a0a0a', color: '#f87171', label: 'Gagal' },
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page title */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
          Dashboard
        </h1>
        <p style={{ fontSize: '11px', color: '#555', margin: '4px 0 0', fontFamily: 'Poppins, sans-serif' }}>
          Ringkasan performa platform
        </p>
      </div>

      {/* Period filter */}
      <div style={{
        display: 'flex', background: '#0d0d0d', borderRadius: '12px',
        padding: '4px', marginBottom: '24px', border: '1px solid #1f1f1f',
        width: 'fit-content', gap: '2px',
      }}>
        {PERIODS.map(p => (
          <button key={p.key} onClick={() => setPeriod(p.key)} style={{
            padding: '8px 18px', borderRadius: '9px',
            background: period === p.key ? 'linear-gradient(90deg, #f1301e, #9f2315)' : 'transparent',
            border: 'none', cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: 700,
            color: period === p.key ? '#fff' : '#555', transition: 'all 0.2s',
          }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {CARDS.map((card, i) => (
          <div key={i} style={{
            background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '16px',
            padding: '20px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${card.color}20 0%, transparent 70%)`,
              filter: 'blur(15px)',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span style={{ fontSize: '22px' }}>{card.icon}</span>
              <span style={{ fontSize: '11px', color: '#555', fontFamily: 'Poppins, sans-serif' }}>{card.label}</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: card.color, fontFamily: 'Poppins, sans-serif', marginBottom: '4px' }}>
              {card.value}
            </div>
            <div style={{ fontSize: '10px', color: '#444', fontFamily: 'Poppins, sans-serif' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', marginBottom: '24px' }}>
        {/* Revenue Chart */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', fontFamily: 'Poppins, sans-serif', marginBottom: '20px' }}>
            Grafik Revenue
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
            {chart.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '100%', borderRadius: '4px 4px 0 0',
                  height: `${(val / maxBar) * 100}px`,
                  background: `linear-gradient(180deg, #f1301e ${100 - val}%, #9f2315 100%)`,
                  transition: 'height 0.3s',
                  minHeight: '4px',
                }} />
                <span style={{ fontSize: '8px', color: '#444', fontFamily: 'Poppins, sans-serif' }}>
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', fontFamily: 'Poppins, sans-serif', marginBottom: '16px' }}>
            Traffic Source
          </div>
          {TRAFFIC_SOURCES.map((s, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', color: '#aaa', fontFamily: 'Poppins, sans-serif' }}>{s.label}</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff', fontFamily: 'Poppins, sans-serif' }}>{s.value}%</span>
              </div>
              <div style={{ height: '6px', background: '#1a1a1a', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${s.value}%`, height: '100%', borderRadius: '3px',
                  background: s.color === '#010101' ? 'linear-gradient(90deg, #6366f1, #8b5cf6)' : s.color,
                  transition: 'width 0.5s',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '20px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px',
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
            Order Terbaru
          </div>
          <button onClick={() => {}} style={{
            fontSize: '10px', color: '#f1301e', background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 600,
          }}>
            Lihat Semua →
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Nama', 'Email', 'Total', 'Order Bump', 'Status'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '8px 12px',
                    fontSize: '9px', fontWeight: 700, color: '#444',
                    fontFamily: 'Poppins, sans-serif', letterSpacing: '0.5px',
                    borderBottom: '1px solid #1a1a1a',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((o, i) => {
                const s = STATUS_STYLE[o.status];
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #111' }}>
                    <td style={{ padding: '12px', fontSize: '11px', color: '#ccc', fontFamily: 'Poppins, sans-serif' }}>
                      {o.name}
                    </td>
                    <td style={{ padding: '12px', fontSize: '10px', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                      {o.email}
                    </td>
                    <td style={{ padding: '12px', fontSize: '11px', fontWeight: 700, color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
                      Rp {o.amount.toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-block', borderRadius: '4px', padding: '2px 8px',
                        fontSize: '9px', fontWeight: 700, fontFamily: 'Poppins, sans-serif',
                        background: o.bump ? '#0a1a0a' : '#1a1a1a',
                        color: o.bump ? '#4ade80' : '#444',
                      }}>
                        {o.bump ? '✓ Ya' : '— Tidak'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-block', borderRadius: '6px', padding: '3px 10px',
                        fontSize: '9px', fontWeight: 700, fontFamily: 'Poppins, sans-serif',
                        background: s.bg, color: s.color,
                      }}>
                        {s.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
