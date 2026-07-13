'use client';

import { useState } from 'react';

type FollowUpStatus = 'pending' | 'contacted' | 'converted' | 'lost';

const ABANDONED = [
  { id: 'AB-001', name: 'Hendra Setiawan',    email: 'hendra@gmail.com',  wa: '08123111222', step: 'Nama & Email', time: '2026-07-12T18:35', followUp: 'pending',   notes: '' },
  { id: 'AB-002', name: 'Wulan Permatasari',  email: 'wulan@gmail.com',   wa: '08234222333', step: 'Isi Form',     time: '2026-07-12T15:20', followUp: 'contacted', notes: 'Sudah WA, belum balas' },
  { id: 'AB-003', name: 'Yoga Pratama',       email: 'yoga@gmail.com',    wa: '08345333444', step: 'Payment',      time: '2026-07-12T13:10', followUp: 'pending',   notes: '' },
  { id: 'AB-004', name: 'Indah Rahayu',       email: 'indah@gmail.com',   wa: '08456444555', step: 'Payment',      time: '2026-07-11T22:05', followUp: 'converted', notes: 'Berhasil closing via WA' },
  { id: 'AB-005', name: 'Teguh Wibowo',       email: 'teguh@gmail.com',   wa: '08567555666', step: 'Nama & Email', time: '2026-07-11T19:45', followUp: 'lost',      notes: 'Tidak bisa dihubungi' },
  { id: 'AB-006', name: 'Sinta Agustina',     email: 'sinta@gmail.com',   wa: '08678666777', step: 'Isi Form',     time: '2026-07-11T17:30', followUp: 'pending',   notes: '' },
];

const FU_STYLE: Record<FollowUpStatus, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#2a1a00', color: '#fbbf24', label: 'Belum' },
  contacted: { bg: '#0a1a2a', color: '#60a5fa', label: 'Sudah Dihubungi' },
  converted: { bg: '#0a2a0a', color: '#4ade80', label: '✓ Converted' },
  lost:      { bg: '#2a0a0a', color: '#f87171', label: 'Lost' },
};

function timeSince(isoDate: string) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return `${Math.floor(diff / 60000)}m lalu`;
  if (hours < 24) return `${hours}j lalu`;
  return `${Math.floor(hours / 24)}h lalu`;
}

export default function AdminAbandoned() {
  const [data, setData] = useState(ABANDONED);
  const [filterFU, setFilterFU] = useState<FollowUpStatus | 'all'>('all');
  const [sending, setSending] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>(
    Object.fromEntries(ABANDONED.map(a => [a.id, a.notes]))
  );

  const filtered = data.filter(a => filterFU === 'all' || a.followUp === filterFU);

  const sendWA = async (id: string, waNum: string, name: string) => {
    setSending(id);
    await new Promise(r => setTimeout(r, 600));
    const msg = encodeURIComponent(
      `Halo ${name}! 👋\n\nSaya dari Bantuan Ordal.\n\nSaya lihat kamu sempat tertarik dengan kelas persiapan karir kami tadi. Ada pertanyaan? Kami siap bantu! 🚀\n\nCek kembali: https://bantuanordal.com/?ref=admin`
    );
    window.open(`https://wa.me/${waNum.replace(/^0/, '62')}?text=${msg}`, '_blank');
    setData(prev => prev.map(a => a.id === id ? { ...a, followUp: 'contacted' as FollowUpStatus } : a));
    setSending(null);
  };

  const updateNote = (id: string, note: string) => {
    setNotes(prev => ({ ...prev, [id]: note }));
  };

  const pendingCount = data.filter(a => a.followUp === 'pending').length;
  const convertedCount = data.filter(a => a.followUp === 'converted').length;

  const TABS: { key: FollowUpStatus | 'all'; label: string }[] = [
    { key: 'all',       label: `Semua (${data.length})` },
    { key: 'pending',   label: `Belum (${pendingCount})` },
    { key: 'contacted', label: 'Dihubungi' },
    { key: 'converted', label: 'Converted' },
    { key: 'lost',      label: 'Lost' },
  ];

  return (
    <div style={{ padding: '24px', fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0 }}>Abandoned Checkout</h1>
        <p style={{ fontSize: '11px', color: '#555', margin: '4px 0 0' }}>
          {pendingCount} belum dihubungi · {convertedCount} converted hari ini
        </p>
      </div>

      {/* Stats mini */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px', maxWidth: '600px' }}>
        {[
          { label: 'Total',     value: data.length,       color: '#888' },
          { label: 'Pending',   value: pendingCount,       color: '#fbbf24' },
          { label: 'Converted', value: convertedCount,     color: '#4ade80' },
          { label: 'Conv Rate', value: `${Math.round(convertedCount / data.length * 100)}%`, color: '#a78bfa' },
        ].map((c, i) => (
          <div key={i} style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '12px' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: '9px', color: '#444' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setFilterFU(tab.key)} style={{
            height: '30px', padding: '0 14px', borderRadius: '8px',
            background: filterFU === tab.key ? 'linear-gradient(90deg, #f1301e, #9f2315)' : '#0d0d0d',
            border: filterFU === tab.key ? 'none' : '1px solid #2a2a2a',
            cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '10px',
            fontWeight: 700, color: filterFU === tab.key ? '#fff' : '#555', transition: 'all 0.2s',
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(a => {
          const fu = FU_STYLE[a.followUp as FollowUpStatus];
          return (
            <div key={a.id} style={{
              background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '18px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                    {a.name}
                  </div>
                  <div style={{ fontSize: '10px', color: '#555' }}>{a.email} · {a.wa}</div>
                </div>
                <span style={{
                  display: 'inline-block', borderRadius: '6px', padding: '3px 10px',
                  fontSize: '9px', fontWeight: 700,
                  background: fu.bg, color: fu.color,
                }}>
                  {fu.label}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '9px', color: '#888',
                  background: '#151515', borderRadius: '6px', padding: '3px 8px',
                }}>
                  Berhenti di: <strong style={{ color: '#ccc' }}>{a.step}</strong>
                </span>
                <span style={{ fontSize: '9px', color: '#555' }}>
                  ⏱ {timeSince(a.time)}
                </span>
              </div>

              {/* Notes input */}
              <input
                type="text"
                value={notes[a.id] || ''}
                onChange={e => updateNote(a.id, e.target.value)}
                placeholder="Tambah catatan..."
                style={{
                  width: '100%', height: '34px', background: '#080808',
                  border: '1px solid #1f1f1f', borderRadius: '8px',
                  color: '#888', fontSize: '11px', padding: '0 12px',
                  outline: 'none', marginBottom: '12px', boxSizing: 'border-box',
                  fontFamily: 'Poppins, sans-serif',
                }}
              />

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => sendWA(a.id, a.wa, a.name)}
                  disabled={sending === a.id || a.followUp === 'converted'}
                  style={{
                    flex: 1, height: '36px', borderRadius: '8px',
                    background: sending === a.id ? '#333' : 'linear-gradient(90deg, #25d366, #128c7e)',
                    border: 'none', cursor: sending === a.id || a.followUp === 'converted' ? 'not-allowed' : 'pointer',
                    fontSize: '11px', fontWeight: 700, color: '#fff', fontFamily: 'Poppins, sans-serif',
                    opacity: a.followUp === 'converted' ? 0.4 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}
                >
                  {sending === a.id ? '⏳...' : '💬 Kirim WA'}
                </button>
                <button
                  onClick={() => setData(prev => prev.map(x => x.id === a.id ? { ...x, followUp: 'converted' as FollowUpStatus } : x))}
                  disabled={a.followUp === 'converted'}
                  style={{
                    height: '36px', padding: '0 14px', borderRadius: '8px',
                    background: 'transparent', border: '1px solid #2a2a2a',
                    cursor: a.followUp === 'converted' ? 'not-allowed' : 'pointer',
                    fontSize: '10px', color: '#4ade80', fontFamily: 'Poppins, sans-serif', fontWeight: 600,
                    opacity: a.followUp === 'converted' ? 0.4 : 1,
                  }}
                >
                  ✓ Mark Converted
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
