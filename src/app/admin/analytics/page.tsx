'use client';

import { useState } from 'react';

type Period = '7d' | '30d' | 'all';

const COMPLETION_RATES = [
  { ep: 1, title: 'Mindset Cari Kerja',      rate: 68, views: 2450 },
  { ep: 2, title: 'Resume & CV',             rate: 61, views: 2210 },
  { ep: 3, title: 'Aplikasi Massal',         rate: 55, views: 1980 },
  { ep: 4, title: 'Interview Preparation',  rate: 49, views: 1760 },
  { ep: 5, title: 'Personal Branding',       rate: 82, views: 890 },
  { ep: 6, title: 'Network Building',        rate: 79, views: 820 },
  { ep: 7, title: 'Interview Mastery',       rate: 77, views: 780 },
  { ep: 8, title: '90 Hari Pertama',         rate: 75, views: 760 },
  { ep: 9, title: 'Career Acceleration',    rate: 73, views: 740 },
];

const EMAIL_STATS: Record<Period, { sent: number; opened: number; clicked: number; converted: number }> = {
  '7d':  { sent: 1200, opened: 648,  clicked: 174, converted: 49 },
  '30d': { sent: 5100, opened: 2754, clicked: 714, converted: 204 },
  'all': { sent: 18000,opened: 9720, clicked: 2520, converted: 720 },
};

const WA_STATS: Record<Period, { sent: number; delivered: number; read: number; replied: number }> = {
  '7d':  { sent: 320, delivered: 304, read: 243, replied: 64 },
  '30d': { sent: 1380,delivered: 1311,read: 1050, replied: 276 },
  'all': { sent: 4800,delivered: 4560,read: 3648, replied: 960 },
};

const TRAFFIC_DATA: Record<Period, { source: string; visits: number; orders: number; revenue: number; color: string }[]> = {
  '7d': [
    { source: 'Meta Ads',   visits: 2067, orders: 88, revenue: 4400000, color: '#4267B2' },
    { source: 'Affiliate',  visits: 1650, orders: 61, revenue: 3050000, color: '#f1301e' },
    { source: 'TikTok Ads', visits: 1062, orders: 40, revenue: 2000000, color: '#6366f1' },
    { source: 'Organic',    visits: 709,  orders: 20, revenue: 1000000, color: '#22c55e' },
    { source: 'Email',      visits: 414,  orders: 13, revenue: 650000,  color: '#fbbf24' },
  ],
  '30d': [
    { source: 'Meta Ads',   visits: 8850, orders: 378, revenue: 18900000, color: '#4267B2' },
    { source: 'Affiliate',  visits: 7080, orders: 262, revenue: 13100000, color: '#f1301e' },
    { source: 'TikTok Ads', visits: 4560, orders: 171, revenue: 8550000,  color: '#6366f1' },
    { source: 'Organic',    visits: 3040, orders: 86,  revenue: 4300000,  color: '#22c55e' },
    { source: 'Email',      visits: 1778, orders: 55,  revenue: 2750000,  color: '#fbbf24' },
  ],
  'all': [
    { source: 'Meta Ads',   visits: 29490, orders: 1260, revenue: 63000000, color: '#4267B2' },
    { source: 'Affiliate',  visits: 23592, orders: 875,  revenue: 43750000, color: '#f1301e' },
    { source: 'TikTok Ads', visits: 15204, orders: 570,  revenue: 28500000, color: '#6366f1' },
    { source: 'Organic',    visits: 10136, orders: 287, revenue: 14350000, color: '#22c55e' },
    { source: 'Email',      visits: 5928,  orders: 183,  revenue: 9150000,  color: '#fbbf24' },
  ],
};

function formatRp(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}rb`;
  return String(n);
}

function pct(a: number, b: number) { return b === 0 ? '0' : `${Math.round(a / b * 100)}`; }

export default function AdminAnalytics() {
  const [period, setPeriod] = useState<Period>('7d');

  const email = EMAIL_STATS[period];
  const wa = WA_STATS[period];
  const traffic = TRAFFIC_DATA[period];
  const maxVisits = Math.max(...traffic.map(t => t.visits));

  return (
    <div style={{ padding: '24px', fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0 }}>Analytics</h1>
        <p style={{ fontSize: '11px', color: '#555', margin: '4px 0 0' }}>Performa konten, traffic, dan komunikasi</p>
      </div>

      {/* Period picker */}
      <div style={{
        display: 'flex', background: '#0d0d0d', borderRadius: '12px',
        padding: '4px', marginBottom: '24px', border: '1px solid #1f1f1f', width: 'fit-content',
      }}>
        {([['7d', '7 Hari'], ['30d', '30 Hari'], ['all', 'All Time']] as [Period, string][]).map(([k, l]) => (
          <button key={k} onClick={() => setPeriod(k)} style={{
            padding: '8px 20px', borderRadius: '9px',
            background: period === k ? 'linear-gradient(90deg, #f1301e, #9f2315)' : 'transparent',
            border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700,
            color: period === k ? '#fff' : '#555', transition: 'all 0.2s',
            fontFamily: 'Poppins, sans-serif',
          }}>{l}</button>
        ))}
      </div>

      {/* Episode Completion Rates */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
          📊 Episode Completion Rate
        </div>
        {COMPLETION_RATES.map(ep => (
          <div key={ep.ep} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{
                  fontSize: '8px', fontWeight: 700, color: ep.ep > 4 ? '#60a5fa' : '#f1301e',
                  background: ep.ep > 4 ? '#0a1a2a' : '#1a0505',
                  borderRadius: '4px', padding: '2px 5px',
                }}>
                  EP{ep.ep}
                </span>
                <span style={{ fontSize: '10px', color: '#aaa' }}>{ep.title}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '9px', color: '#555' }}>{ep.views.toLocaleString('id-ID')} views</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: ep.rate >= 70 ? '#4ade80' : ep.rate >= 50 ? '#fbbf24' : '#f87171' }}>
                  {ep.rate}%
                </span>
              </div>
            </div>
            <div style={{ height: '6px', background: '#1a1a1a', borderRadius: '3px' }}>
              <div style={{
                width: `${ep.rate}%`, height: '100%', borderRadius: '3px',
                background: ep.rate >= 70 ? '#4ade80' : ep.rate >= 50 ? '#fbbf24' : '#f87171',
                transition: 'width 0.5s',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Traffic Sources */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
          🌐 Traffic Sources
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
            <thead>
              <tr>
                {['Source', 'Visits', 'Orders', 'Revenue', 'Conv. Rate'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '9px', fontWeight: 700, color: '#444', letterSpacing: '0.5px', borderBottom: '1px solid #1a1a1a' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {traffic.map(t => (
                <tr key={t.source} style={{ borderBottom: '1px solid #111' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: t.color }} />
                      <span style={{ fontSize: '11px', color: '#ccc' }}>{t.source}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '4px', background: '#1a1a1a', borderRadius: '2px' }}>
                        <div style={{ width: `${(t.visits / maxVisits) * 100}%`, height: '100%', background: t.color, borderRadius: '2px' }} />
                      </div>
                      <span style={{ fontSize: '10px', color: '#888' }}>{t.visits.toLocaleString('id-ID')}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: '11px', color: '#888' }}>{t.orders}</td>
                  <td style={{ padding: '12px', fontSize: '11px', fontWeight: 700, color: '#fff' }}>Rp {formatRp(t.revenue)}</td>
                  <td style={{ padding: '12px', fontSize: '11px', color: '#4ade80', fontWeight: 700 }}>{pct(t.orders, t.visits)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Email stats */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>📧 Email Marketing</div>
          {[
            { label: 'Terkirim',  value: email.sent,      color: '#888' },
            { label: 'Dibuka',    value: email.opened,    color: '#60a5fa', rate: pct(email.opened, email.sent) },
            { label: 'Diklik',    value: email.clicked,   color: '#fbbf24', rate: pct(email.clicked, email.sent) },
            { label: 'Converted', value: email.converted, color: '#4ade80', rate: pct(email.converted, email.sent) },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1a1a1a' }}>
              <span style={{ fontSize: '11px', color: '#555' }}>{row.label}</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: row.color }}>
                  {row.value.toLocaleString('id-ID')}
                </span>
                {row.rate && <span style={{ fontSize: '9px', color: '#444', marginLeft: '6px' }}>({row.rate}%)</span>}
              </div>
            </div>
          ))}
        </div>

        {/* WA stats */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>💬 WhatsApp Blast</div>
          {[
            { label: 'Terkirim',  value: wa.sent,      color: '#888' },
            { label: 'Diterima',  value: wa.delivered, color: '#60a5fa', rate: pct(wa.delivered, wa.sent) },
            { label: 'Dibaca',    value: wa.read,      color: '#25d366', rate: pct(wa.read, wa.sent) },
            { label: 'Dibalas',   value: wa.replied,   color: '#4ade80', rate: pct(wa.replied, wa.sent) },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1a1a1a' }}>
              <span style={{ fontSize: '11px', color: '#555' }}>{row.label}</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: row.color }}>
                  {row.value.toLocaleString('id-ID')}
                </span>
                {row.rate && <span style={{ fontSize: '9px', color: '#444', marginLeft: '6px' }}>({row.rate}%)</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
