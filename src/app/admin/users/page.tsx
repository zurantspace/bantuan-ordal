'use client';

import { useState } from 'react';

type PlanFilter = 'all' | 'standard' | 'premium';

const MOCK_USERS = [
  { id: 'USR-001', name: 'Andi Firmansyah',   email: 'andi@gmail.com',   plan: 'standard', progress: 75, episodes: 3, joined: '2026-07-01', lastActive: '2026-07-12', status: 'active' },
  { id: 'USR-002', name: 'Sari Dewi Lestari',  email: 'sari@gmail.com',   plan: 'premium',  progress: 45, episodes: 5, joined: '2026-07-02', lastActive: '2026-07-11', status: 'active' },
  { id: 'USR-003', name: 'Budi Santoso',        email: 'budi@gmail.com',   plan: 'standard', progress: 25, episodes: 1, joined: '2026-07-03', lastActive: '2026-07-08', status: 'active' },
  { id: 'USR-004', name: 'Lina Marlina',        email: 'lina@gmail.com',   plan: 'premium',  progress: 90, episodes: 8, joined: '2026-06-20', lastActive: '2026-07-12', status: 'active' },
  { id: 'USR-005', name: 'Rizky Maulana',       email: 'rizky@gmail.com',  plan: 'standard', progress: 0,  episodes: 0, joined: '2026-07-05', lastActive: '2026-07-05', status: 'inactive' },
  { id: 'USR-006', name: 'Diana Putri',         email: 'diana@gmail.com',  plan: 'premium',  progress: 60, episodes: 6, joined: '2026-06-25', lastActive: '2026-07-10', status: 'active' },
  { id: 'USR-007', name: 'Fajar Nugraha',       email: 'fajar@gmail.com',  plan: 'standard', progress: 50, episodes: 2, joined: '2026-07-01', lastActive: '2026-07-09', status: 'active' },
  { id: 'USR-008', name: 'Maya Sari Andini',    email: 'maya@gmail.com',   plan: 'standard', progress: 100,episodes: 4, joined: '2026-06-15', lastActive: '2026-07-07', status: 'completed' },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' });
}

const PLAN_STYLE: Record<string, { bg: string; color: string }> = {
  standard: { bg: '#1a1a0a', color: '#fbbf24' },
  premium:  { bg: '#0a1a2a', color: '#60a5fa' },
};

const STATUS_STYLE: Record<string, { color: string; label: string }> = {
  active:    { color: '#4ade80', label: '● Aktif' },
  inactive:  { color: '#f87171', label: '● Tidak Aktif' },
  completed: { color: '#a78bfa', label: '● Selesai' },
};

export default function AdminUsers() {
  const [filter, setFilter] = useState<PlanFilter>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = MOCK_USERS.filter(u => {
    if (filter !== 'all' && u.plan !== filter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedUser = MOCK_USERS.find(u => u.id === selected);
  const totalUsers = MOCK_USERS.length;
  const premiumUsers = MOCK_USERS.filter(u => u.plan === 'premium').length;
  const avgProgress = Math.round(MOCK_USERS.reduce((s, u) => s + u.progress, 0) / totalUsers);

  return (
    <div style={{ padding: '24px', fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0 }}>Users / Member</h1>
        <p style={{ fontSize: '11px', color: '#555', margin: '4px 0 0' }}>
          {totalUsers} total member · {premiumUsers} premium · Avg progress {avgProgress}%
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px', maxWidth: '500px' }}>
        {[
          { label: 'Total Member', value: totalUsers, icon: '👥', color: '#60a5fa' },
          { label: 'Premium',      value: premiumUsers, icon: '⭐', color: '#fbbf24' },
          { label: 'Avg Progress', value: `${avgProgress}%`, icon: '📊', color: '#a78bfa' },
        ].map((c, i) => (
          <div key={i} style={{
            background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '14px',
          }}>
            <div style={{ fontSize: '18px', marginBottom: '4px' }}>{c.icon}</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: '9px', color: '#444' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <div style={{
          flex: 1, minWidth: '200px', height: '40px', background: '#0d0d0d', border: '1px solid #2a2a2a',
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
        {(['all', 'standard', 'premium'] as PlanFilter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            height: '40px', padding: '0 14px', borderRadius: '10px',
            background: filter === f ? 'linear-gradient(90deg, #f1301e, #9f2315)' : '#0d0d0d',
            border: filter === f ? 'none' : '1px solid #2a2a2a',
            cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '10px',
            fontWeight: 700, color: filter === f ? '#fff' : '#555', transition: 'all 0.2s',
            textTransform: 'capitalize',
          }}>
            {f === 'all' ? 'Semua' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '750px' }}>
            <thead style={{ background: '#080808' }}>
              <tr>
                {['Member', 'Paket', 'Progress', 'Episode', 'Status', 'Bergabung', 'Aksi'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '12px 16px',
                    fontSize: '9px', fontWeight: 700, color: '#444',
                    letterSpacing: '0.5px', borderBottom: '1px solid #1a1a1a',
                    fontFamily: 'Poppins, sans-serif',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const plan = PLAN_STYLE[u.plan];
                const status = STATUS_STYLE[u.status];
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid #111', transition: 'background 0.2s' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                          background: 'linear-gradient(135deg, #1a0505, #2a0808)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '14px',
                        }}>
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#ccc', fontWeight: 600, fontFamily: 'Poppins, sans-serif' }}>{u.name}</div>
                          <div style={{ fontSize: '9px', color: '#444', fontFamily: 'Poppins, sans-serif' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-block', borderRadius: '6px', padding: '3px 10px',
                        fontSize: '9px', fontWeight: 700, fontFamily: 'Poppins, sans-serif',
                        background: plan.bg, color: plan.color, textTransform: 'capitalize',
                      }}>{u.plan}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '4px', background: '#1a1a1a', borderRadius: '2px' }}>
                          <div style={{
                            width: `${u.progress}%`, height: '100%', borderRadius: '2px',
                            background: u.progress === 100 ? '#4ade80' : 'linear-gradient(90deg, #f1301e, #9f2315)',
                          }} />
                        </div>
                        <span style={{ fontSize: '10px', color: '#666', fontFamily: 'Poppins, sans-serif' }}>{u.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '11px', color: '#888', fontFamily: 'Poppins, sans-serif' }}>
                      {u.episodes}/9
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '10px', color: status.color, fontFamily: 'Poppins, sans-serif' }}>
                      {status.label}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '10px', color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                      {formatDate(u.joined)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => setSelected(selected === u.id ? null : u.id)} style={{
                          height: '28px', padding: '0 10px', borderRadius: '6px',
                          background: 'transparent', border: '1px solid #2a2a2a',
                          cursor: 'pointer', fontSize: '9px', color: '#888', fontFamily: 'Poppins, sans-serif', fontWeight: 600,
                        }}>Detail</button>
                        <button style={{
                          height: '28px', padding: '0 10px', borderRadius: '6px',
                          background: 'transparent', border: '1px solid #2a0a0a',
                          cursor: 'pointer', fontSize: '9px', color: '#f87171', fontFamily: 'Poppins, sans-serif', fontWeight: 600,
                        }}>Revoke</button>
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
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>👥</div>
            Tidak ada member ditemukan
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      {selectedUser && (
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
                Detail Member
              </h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '18px' }}>✕</button>
            </div>
            {/* Progress bar */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', color: '#555', fontFamily: 'Poppins, sans-serif' }}>Progress Keseluruhan</span>
                <span style={{ fontSize: '10px', color: '#f1301e', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>{selectedUser.progress}%</span>
              </div>
              <div style={{ height: '6px', background: '#1a1a1a', borderRadius: '3px' }}>
                <div style={{
                  width: `${selectedUser.progress}%`, height: '100%', borderRadius: '3px',
                  background: 'linear-gradient(90deg, #f1301e, #9f2315)',
                  transition: 'width 0.5s',
                }} />
              </div>
            </div>
            {[
              { label: 'ID',          value: selectedUser.id },
              { label: 'Nama',        value: selectedUser.name },
              { label: 'Email',       value: selectedUser.email },
              { label: 'Paket',       value: selectedUser.plan },
              { label: 'Episode Ditonton', value: `${selectedUser.episodes}/9` },
              { label: 'Status',      value: STATUS_STYLE[selectedUser.status].label },
              { label: 'Bergabung',   value: selectedUser.joined },
              { label: 'Terakhir Aktif', value: selectedUser.lastActive },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: '1px solid #1a1a1a',
              }}>
                <span style={{ fontSize: '10px', color: '#555', fontFamily: 'Poppins, sans-serif' }}>{row.label}</span>
                <span style={{ fontSize: '11px', color: '#ccc', fontFamily: 'Poppins, sans-serif', fontWeight: 600, textTransform: 'capitalize' }}>{row.value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button style={{
                flex: 1, height: '40px', borderRadius: '10px',
                background: 'linear-gradient(90deg, #f1301e, #9f2315)', border: 'none',
                cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: 700, color: '#fff',
              }}>
                📧 Kirim Email
              </button>
              <button style={{
                flex: 1, height: '40px', borderRadius: '10px',
                background: 'transparent', border: '1px solid #2a0a0a',
                cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: 600, color: '#f87171',
              }}>
                🚫 Revoke Akses
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
