'use client';

import { useState } from 'react';

type StatusFilter = 'all' | 'paid' | 'pending' | 'failed' | 'refunded';

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  paid:     { bg: '#0a2a0a', color: '#4ade80', label: 'Dibayar' },
  pending:  { bg: '#2a1a00', color: '#fbbf24', label: 'Pending' },
  failed:   { bg: '#2a0a0a', color: '#f87171', label: 'Gagal' },
  refunded: { bg: '#0a1a2a', color: '#60a5fa', label: 'Refund' },
};

const MOCK_ORDERS = [
  { id: 'ORD-001', name: 'Andi Firmansyah',  email: 'andi@gmail.com',   wa: '08123456789', product: 'Main Course', bump: true,  total: 97000,  status: 'paid',     date: '2026-07-12' },
  { id: 'ORD-002', name: 'Sari Dewi Lestari', email: 'sari@gmail.com',   wa: '08234567890', product: 'Main Course', bump: false, total: 50000,  status: 'paid',     date: '2026-07-12' },
  { id: 'ORD-003', name: 'Budi Santoso',      email: 'budi@gmail.com',   wa: '08345678901', product: 'Main Course', bump: false, total: 50000,  status: 'pending',  date: '2026-07-12' },
  { id: 'ORD-004', name: 'Lina Marlina',      email: 'lina@gmail.com',   wa: '08456789012', product: 'Main + Bump', bump: true,  total: 97000,  status: 'paid',     date: '2026-07-11' },
  { id: 'ORD-005', name: 'Rizky Maulana',     email: 'rizky@gmail.com',  wa: '08567890123', product: 'Main Course', bump: false, total: 50000,  status: 'failed',   date: '2026-07-11' },
  { id: 'ORD-006', name: 'Diana Putri',       email: 'diana@gmail.com',  wa: '08678901234', product: 'Premium',    bump: false, total: 149000, status: 'paid',     date: '2026-07-11' },
  { id: 'ORD-007', name: 'Fajar Nugraha',     email: 'fajar@gmail.com',  wa: '08789012345', product: 'Main Course', bump: true,  total: 97000,  status: 'refunded', date: '2026-07-10' },
  { id: 'ORD-008', name: 'Maya Sari',         email: 'maya@gmail.com',   wa: '08890123456', product: 'Main Course', bump: false, total: 50000,  status: 'paid',     date: '2026-07-10' },
];

function formatRp(n: number) { return `Rp ${n.toLocaleString('id-ID')}`; }
function formatDate(d: string) { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }); }

export default function AdminOrders() {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = MOCK_ORDERS.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search && !o.name.toLowerCase().includes(search.toLowerCase()) && !o.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalRevenue = MOCK_ORDERS.filter(o => o.status === 'paid').reduce((s, o) => s + o.total, 0);
  const selectedOrder = MOCK_ORDERS.find(o => o.id === selected);

  const FILTER_TABS: { key: StatusFilter; label: string }[] = [
    { key: 'all',      label: `Semua (${MOCK_ORDERS.length})` },
    { key: 'paid',     label: 'Dibayar' },
    { key: 'pending',  label: 'Pending' },
    { key: 'failed',   label: 'Gagal' },
    { key: 'refunded', label: 'Refund' },
  ];

  return (
    <div style={{ padding: '24px', fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0 }}>Orders</h1>
        <p style={{ fontSize: '11px', color: '#555', margin: '4px 0 0' }}>
          Total revenue: <strong style={{ color: '#f1301e' }}>{formatRp(totalRevenue)}</strong>
        </p>
      </div>

      {/* Search */}
      <div style={{
        display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center',
      }}>
        <div style={{
          flex: 1, height: '40px', background: '#0d0d0d', border: '1px solid #2a2a2a',
          borderRadius: '10px', display: 'flex', alignItems: 'center', padding: '0 14px', gap: '8px',
        }}>
          <span style={{ color: '#555' }}>🔍</span>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama atau email..."
            style={{
              background: 'none', border: 'none', outline: 'none',
              color: '#fff', fontSize: '12px', width: '100%', fontFamily: 'Poppins, sans-serif',
            }}
          />
        </div>
        <button style={{
          height: '40px', padding: '0 16px', borderRadius: '10px',
          background: '#0d0d0d', border: '1px solid #2a2a2a',
          cursor: 'pointer', color: '#888', fontSize: '11px', fontWeight: 600,
          fontFamily: 'Poppins, sans-serif',
        }}>
          ⬇️ Export CSV
        </button>
      </div>

      {/* Status Tabs */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap',
      }}>
        {FILTER_TABS.map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
            height: '30px', padding: '0 14px', borderRadius: '8px',
            background: filter === tab.key ? 'linear-gradient(90deg, #f1301e, #9f2315)' : '#0d0d0d',
            border: filter === tab.key ? 'none' : '1px solid #2a2a2a',
            cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '10px',
            fontWeight: 700, color: filter === tab.key ? '#fff' : '#555', transition: 'all 0.2s',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead style={{ background: '#080808' }}>
              <tr>
                {['ID', 'Pembeli', 'Produk', 'Order Bump', 'Total', 'Status', 'Tanggal', 'Aksi'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '12px 16px',
                    fontSize: '9px', fontWeight: 700, color: '#444',
                    fontFamily: 'Poppins, sans-serif', letterSpacing: '0.5px',
                    borderBottom: '1px solid #1a1a1a',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const s = STATUS_STYLE[o.status];
                return (
                  <tr key={o.id} style={{
                    borderBottom: '1px solid #111',
                    background: selected === o.id ? 'rgba(241,48,30,0.05)' : 'transparent',
                    transition: 'background 0.2s',
                  }}>
                    <td style={{ padding: '14px 16px', fontSize: '10px', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                      {o.id}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '11px', color: '#ccc', fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>{o.name}</div>
                      <div style={{ fontSize: '9px', color: '#444', fontFamily: 'Poppins, sans-serif' }}>{o.email}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '10px', color: '#aaa', fontFamily: 'Poppins, sans-serif' }}>
                      {o.product}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-block', borderRadius: '4px', padding: '2px 8px',
                        fontSize: '9px', fontWeight: 700, fontFamily: 'Poppins, sans-serif',
                        background: o.bump ? '#0a1a0a' : '#111',
                        color: o.bump ? '#4ade80' : '#333',
                      }}>
                        {o.bump ? '✓ Ya' : '—'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
                      {formatRp(o.total)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-block', borderRadius: '6px', padding: '3px 10px',
                        fontSize: '9px', fontWeight: 700, fontFamily: 'Poppins, sans-serif',
                        background: s.bg, color: s.color,
                      }}>{s.label}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '10px', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                      {formatDate(o.date)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => setSelected(selected === o.id ? null : o.id)} style={{
                          height: '28px', padding: '0 10px', borderRadius: '6px',
                          background: 'transparent', border: '1px solid #2a2a2a',
                          cursor: 'pointer', fontSize: '9px', color: '#888', fontFamily: 'Poppins, sans-serif', fontWeight: 600,
                        }}>Detail</button>
                        {o.status === 'paid' && (
                          <button style={{
                            height: '28px', padding: '0 10px', borderRadius: '6px',
                            background: 'transparent', border: '1px solid #2a2a2a',
                            cursor: 'pointer', fontSize: '9px', color: '#f87171', fontFamily: 'Poppins, sans-serif', fontWeight: 600,
                          }}>Refund</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#444', fontSize: '12px', fontFamily: 'Poppins, sans-serif' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>📭</div>
            Tidak ada order ditemukan
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selectedOrder && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }} onClick={() => setSelected(null)}>
          <div style={{
            width: '100%', maxWidth: '480px', background: '#0d0d0d',
            borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
            padding: '24px', border: '1px solid #2a2a2a',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                Detail Order
              </h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '18px' }}>✕</button>
            </div>
            {[
              { label: 'Order ID',    value: selectedOrder.id },
              { label: 'Nama',        value: selectedOrder.name },
              { label: 'Email',       value: selectedOrder.email },
              { label: 'WhatsApp',    value: selectedOrder.wa },
              { label: 'Produk',      value: selectedOrder.product },
              { label: 'Order Bump',  value: selectedOrder.bump ? 'Ya' : 'Tidak' },
              { label: 'Total',       value: formatRp(selectedOrder.total) },
              { label: 'Status',      value: STATUS_STYLE[selectedOrder.status].label },
              { label: 'Tanggal',     value: selectedOrder.date },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid #1a1a1a',
              }}>
                <span style={{ fontSize: '10px', color: '#555', fontFamily: 'Poppins, sans-serif' }}>{row.label}</span>
                <span style={{ fontSize: '11px', color: '#ccc', fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button style={{
                flex: 1, height: '40px', borderRadius: '10px',
                background: 'linear-gradient(90deg, #f1301e, #9f2315)', border: 'none',
                cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: 700, color: '#fff',
              }}>
                📧 Kirim Ulang Email
              </button>
              <button style={{
                flex: 1, height: '40px', borderRadius: '10px',
                background: 'transparent', border: '1px solid #2a2a2a',
                cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: 600, color: '#888',
              }}>
                💬 Hubungi via WA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
