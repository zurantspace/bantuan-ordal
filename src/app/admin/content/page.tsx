'use client';

import { useState } from 'react';

type Episode = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  duration: string;
  tier: 'standard' | 'premium';
  locked: boolean;
  views: number;
  completionRate: number;
  videoUrl: string;
};

const INITIAL_EPISODES: Episode[] = [
  { id: 'ep1', number: 1, title: 'Mindset Cari Kerja Modern',          subtitle: 'Ubah cara pandang dan strategi',             duration: '22:14', tier: 'standard', locked: false, views: 2450, completionRate: 68, videoUrl: '' },
  { id: 'ep2', number: 2, title: 'Resume & CV yang Menonjol',          subtitle: 'Template & copywriting resume',              duration: '18:47', tier: 'standard', locked: false, views: 2210, completionRate: 61, videoUrl: '' },
  { id: 'ep3', number: 3, title: 'Aplikasi Massal yang Efisien',       subtitle: 'Tools & workflow melamar kerja',             duration: '25:33', tier: 'standard', locked: false, views: 1980, completionRate: 55, videoUrl: '' },
  { id: 'ep4', number: 4, title: 'Interview Preparation Dasar',        subtitle: 'Persiapan interview agar percaya diri',      duration: '31:02', tier: 'standard', locked: false, views: 1760, completionRate: 49, videoUrl: '' },
  { id: 'ep5', number: 5, title: 'Personal Branding & LinkedIn',       subtitle: 'Bangun profil yang dilirik recruiter',       duration: '28:15', tier: 'premium',  locked: true,  views: 890,  completionRate: 82, videoUrl: '' },
  { id: 'ep6', number: 6, title: 'Network Building Strategis',         subtitle: '80% lowongan tak dipublish — akses via koneksi', duration: '24:38', tier: 'premium', locked: true, views: 820, completionRate: 79, videoUrl: '' },
  { id: 'ep7', number: 7, title: 'Interview Mastery',                  subtitle: 'Jawab seperti kandidat terbaik',             duration: '35:50', tier: 'premium',  locked: true,  views: 780,  completionRate: 77, videoUrl: '' },
  { id: 'ep8', number: 8, title: '90 Hari Pertama di Tempat Kerja',   subtitle: 'Survive & thrive di tempat baru',            duration: '29:22', tier: 'premium',  locked: true,  views: 760,  completionRate: 75, videoUrl: '' },
  { id: 'ep9', number: 9, title: 'Career Acceleration',                subtitle: 'Naik jabatan lebih cepat',                   duration: '33:44', tier: 'premium',  locked: true,  views: 740,  completionRate: 73, videoUrl: '' },
];

export default function AdminContent() {
  const [episodes, setEpisodes] = useState<Episode[]>(INITIAL_EPISODES);
  const [editing, setEditing] = useState<Episode | null>(null);
  const [showForm, setShowForm] = useState(false);

  const toggleLock = (id: string) => {
    setEpisodes(prev => prev.map(ep => ep.id === id ? { ...ep, locked: !ep.locked } : ep));
  };

  const handleEdit = (ep: Episode) => {
    setEditing({ ...ep });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!editing) return;
    setEpisodes(prev => prev.map(ep => ep.id === editing.id ? editing : ep));
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0 }}>Kelola Konten</h1>
          <p style={{ fontSize: '11px', color: '#555', margin: '4px 0 0' }}>
            {episodes.length} episode · {episodes.filter(e => !e.locked).length} terbuka · {episodes.filter(e => e.locked).length} terkunci
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          style={{
            height: '38px', padding: '0 18px', borderRadius: '10px',
            background: 'linear-gradient(90deg, #f1301e, #9f2315)', border: 'none',
            cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: 700, color: '#fff',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >
          ＋ Tambah Episode
        </button>
      </div>

      {/* Episode grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {episodes.map(ep => (
          <div key={ep.id} style={{
            background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '14px', padding: '16px',
            display: 'flex', gap: '16px', alignItems: 'center',
          }}>
            {/* Episode number badge */}
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
              background: ep.tier === 'premium' ? 'linear-gradient(135deg, #0a1a2a, #1a2a3a)' : 'linear-gradient(135deg, #1a0505, #2a0808)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${ep.tier === 'premium' ? '#1a3a5a' : '#3a1a1a'}`,
            }}>
              <span style={{ fontSize: '8px', color: ep.tier === 'premium' ? '#60a5fa' : '#f1301e', fontWeight: 700, letterSpacing: '0.5px' }}>EP</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>{ep.number}</span>
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{ep.title}</span>
                <span style={{
                  fontSize: '8px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px',
                  background: ep.tier === 'premium' ? '#0a1a2a' : '#1a0505',
                  color: ep.tier === 'premium' ? '#60a5fa' : '#f1301e',
                  textTransform: 'uppercase',
                }}>
                  {ep.tier}
                </span>
              </div>
              <div style={{ fontSize: '10px', color: '#555', marginBottom: '8px' }}>{ep.subtitle} · {ep.duration}</div>
              {/* Stats row */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '9px', color: '#555' }}>👁 {ep.views.toLocaleString('id-ID')} views</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '9px', color: '#555' }}>Completion:</span>
                  <div style={{ width: '50px', height: '4px', background: '#1a1a1a', borderRadius: '2px' }}>
                    <div style={{ width: `${ep.completionRate}%`, height: '100%', borderRadius: '2px', background: '#4ade80' }} />
                  </div>
                  <span style={{ fontSize: '9px', color: '#4ade80', fontWeight: 700 }}>{ep.completionRate}%</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
              {/* Lock toggle */}
              <button
                onClick={() => toggleLock(ep.id)}
                title={ep.locked ? 'Buka' : 'Kunci'}
                style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: ep.locked ? '#2a1a00' : '#0a2a0a',
                  border: `1px solid ${ep.locked ? '#3a2a00' : '#1a4a1a'}`,
                  cursor: 'pointer', fontSize: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {ep.locked ? '🔒' : '🔓'}
              </button>
              <button onClick={() => handleEdit(ep)} style={{
                height: '36px', padding: '0 12px', borderRadius: '8px',
                background: 'transparent', border: '1px solid #2a2a2a',
                cursor: 'pointer', fontSize: '11px', color: '#888', fontFamily: 'Poppins, sans-serif', fontWeight: 600,
              }}>Edit</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add form modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }} onClick={() => setShowForm(false)}>
          <div style={{
            width: '100%', maxWidth: '520px', background: '#0d0d0d',
            borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
            padding: '24px', border: '1px solid #2a2a2a', maxHeight: '90dvh', overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                {editing ? 'Edit Episode' : 'Tambah Episode'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '18px' }}>✕</button>
            </div>

            {[
              { field: 'title',    label: 'Judul Episode', type: 'text' },
              { field: 'subtitle', label: 'Subtitle',       type: 'text' },
              { field: 'duration', label: 'Durasi',         type: 'text' },
              { field: 'videoUrl', label: 'Video URL',      type: 'text' },
            ].map(({ field, label, type }) => (
              <div key={field} style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#888', fontFamily: 'Poppins, sans-serif', marginBottom: '6px' }}>
                  {label}
                </label>
                <input
                  type={type}
                  value={editing ? ((editing as unknown) as Record<string, string>)[field] ?? '' : ''}
                  onChange={e => setEditing(prev => prev ? { ...prev, [field]: e.target.value } : prev)}
                  style={{
                    width: '100%', height: '40px', borderRadius: '10px',
                    border: '1px solid #2a2a2a', background: '#080808',
                    color: '#fff', fontSize: '12px', padding: '0 12px',
                    outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif',
                  }}
                />
              </div>
            ))}

            {/* Tier select */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#888', fontFamily: 'Poppins, sans-serif', marginBottom: '6px' }}>Tier</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['standard', 'premium'] as const).map(t => (
                  <button key={t} type="button"
                    onClick={() => setEditing(prev => prev ? { ...prev, tier: t } : prev)}
                    style={{
                      flex: 1, height: '36px', borderRadius: '8px', cursor: 'pointer',
                      background: editing?.tier === t ? 'linear-gradient(90deg, #f1301e, #9f2315)' : '#0a0a0a',
                      border: editing?.tier === t ? 'none' : '1px solid #2a2a2a',
                      color: editing?.tier === t ? '#fff' : '#555', fontSize: '11px', fontWeight: 700, fontFamily: 'Poppins, sans-serif',
                      textTransform: 'capitalize',
                    }}
                  >{t}</button>
                ))}
              </div>
            </div>

            <button onClick={handleSave} style={{
              width: '100%', height: '46px', borderRadius: '12px',
              background: 'linear-gradient(90deg, #f1301e, #9f2315)', border: 'none',
              cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 700, color: '#fff',
              marginTop: '8px',
            }}>
              💾 Simpan Episode
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
