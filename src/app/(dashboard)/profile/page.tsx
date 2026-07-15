'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RED      = '#f1301e';
const RED_DARK = '#9f2315';
const CARD_BG  = '#0d0d0d';
const CARD_BORDER = '#282828';

type EpisodeProgress = {
  id: string;
  number: number;
  title: string;
  thumbnail?: string;
  progress: number;
  completed: boolean;
  tier: string;
};

export default function ProfileWatchPage() {
  const router = useRouter();
  const [episodes, setEpisodes] = useState<EpisodeProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/member/episodes', { credentials: 'include' });
        const data = await res.json();
        if (data.success) setEpisodes(data.episodes);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    })();
  }, []);

  const watchedEpisodes = episodes.filter(ep => ep.progress > 0);

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Watch History */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#555', letterSpacing: '1px', marginBottom: '14px' }}>
          RIWAYAT MENONTON
        </div>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2].map(i => (
              <div key={i} style={{
                background: CARD_BG, border: `1px solid ${CARD_BORDER}`,
                borderRadius: '14px', padding: '16px',
                display: 'flex', gap: '14px', alignItems: 'center',
              }}>
                <div style={{ width: '100px', height: '60px', borderRadius: '8px', background: '#1a1a1a', flexShrink: 0, animation: 'pulse 1.5s infinite' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: '12px', background: '#1a1a1a', borderRadius: '4px', width: '60%', marginBottom: '8px' }} />
                  <div style={{ height: '8px', background: '#1a1a1a', borderRadius: '4px', width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && watchedEpisodes.length === 0 && (
          <div style={{
            background: CARD_BG, border: `1px solid ${CARD_BORDER}`,
            borderRadius: '14px', padding: '40px 20px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>📺</div>
            <p style={{ fontSize: '13px', color: '#555', marginBottom: '16px' }}>Belum ada riwayat tontonan</p>
            <button
              onClick={() => router.push('/home')}
              style={{
                padding: '10px 24px', borderRadius: '60px', border: 'none',
                background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
                color: '#fff', fontFamily: 'Poppins, sans-serif',
                fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              }}
            >
              Mulai Menonton
            </button>
          </div>
        )}

        {!loading && watchedEpisodes.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {watchedEpisodes.map(ep => (
              <div
                key={ep.id}
                onClick={() => router.push(`/watch/${ep.number}`)}
                style={{
                  background: CARD_BG, border: `1px solid ${CARD_BORDER}`,
                  borderRadius: '14px', padding: '14px 16px',
                  display: 'flex', gap: '14px', alignItems: 'center',
                  cursor: 'pointer', transition: 'border-color 0.2s',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = RED + '55'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = CARD_BORDER; }}
              >
                {/* Thumbnail */}
                <div style={{
                  width: '100px', height: '60px', borderRadius: '8px',
                  background: '#1a1a1a', flexShrink: 0, overflow: 'hidden',
                  position: 'relative',
                }}>
                  {ep.thumbnail
                    ? <img src={ep.thumbnail} alt={ep.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '24px' }}>▶</div>
                  }
                  {ep.completed && (
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: '18px' }}>✓</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '10px', color: '#555', marginBottom: '3px', fontWeight: 600 }}>
                    EPISODE {ep.number}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ep.title}
                  </div>

                  {/* Progress bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, height: '3px', background: '#2a2a2a', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${ep.progress}%`,
                        background: ep.completed
                          ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                          : `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
                        borderRadius: '2px', transition: 'width 0.4s',
                      }} />
                    </div>
                    <span style={{
                      fontSize: '9px', fontWeight: 700, flexShrink: 0,
                      color: ep.completed ? '#4ade80' : RED,
                    }}>
                      {ep.completed ? '✓ Selesai' : `${Math.round(ep.progress)}%`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Episodes overview */}
      {!loading && episodes.length > 0 && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#555', letterSpacing: '1px', marginBottom: '14px' }}>
            SEMUA EPISODE
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
            {episodes.map(ep => (
              <div
                key={ep.id}
                onClick={() => router.push(`/watch/${ep.number}`)}
                style={{
                  background: CARD_BG, border: `1px solid ${ep.completed ? '#4ade8033' : CARD_BORDER}`,
                  borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                  transition: 'transform 0.15s, border-color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ height: '80px', background: '#1a1a1a', position: 'relative', overflow: 'hidden' }}>
                  {ep.thumbnail && <img src={ep.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  {ep.progress > 0 && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      height: '3px', background: '#111',
                    }}>
                      <div style={{
                        height: '100%', width: `${ep.progress}%`,
                        background: ep.completed ? '#4ade80' : RED,
                      }} />
                    </div>
                  )}
                </div>
                <div style={{ padding: '10px' }}>
                  <div style={{ fontSize: '9px', color: '#555', marginBottom: '2px' }}>EP. {ep.number}</div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ep.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
