'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';

const RED      = '#f1301e';
const RED_DARK = '#9f2315';
const CARD_BG  = '#101010';
const CARD_BORDER = '#3a3a3a';

type Episode = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  thumbnail?: string;
  tier: 'standard' | 'premium';
  isLocked: boolean;
  progress: number;
  completed: boolean;
};

const EP_DESCS: Record<number, string> = {
  1: 'CV bukan riwayat hidup, ini IKLAN. Pelajari cara menjual dirimu agar HRD nggak bisa melewatkan namamu.',
  2: 'Bukan soal siapa yang paling qualified, tapi siapa yang paling strategis.',
  3: 'Kerja remote bukan cuma soal skill, tapi soal tahu cara masuk ke dalamnya. Ini peta jalannya!',
};
const EP_IMAGES: Record<number, string> = {
  1: '/design/home/images/f7d7057ebdc199b21129a21ba98b1cef8867a64d.png',
  2: '/design/home/images/c24cc39fd63bc306fa3df21baff815eddd56f1dd.png',
  3: '/design/home/images/e9295c6b0708167e1d59082995d4dbaef4f10cf6.png',
};
const EP_TITLES: Record<number, string> = {
  1: 'Jual Diri',
  2: 'Pembuktian',
  3: 'Gaji Dolar',
};

/* ─── Episode Card ─── */
function EpisodeCard({ ep, isLocked, onClick }: { ep: Episode; isLocked: boolean; onClick: () => void }) {
  const progress = ep.progress || 0;
  const isDone   = ep.completed || progress >= 100;
  const epDesc   = EP_DESCS[ep.number] || ep.subtitle;
  const epTitle  = EP_TITLES[ep.number] || ep.title;
  const epImg    = ep.thumbnail || EP_IMAGES[ep.number];

  return (
    <div
      onClick={onClick}
      style={{
        background: CARD_BG, border: `1px solid ${CARD_BORDER}`,
        borderRadius: '16px', padding: 'clamp(14px, 2vw, 18px)',
        cursor: 'pointer',
        display: 'flex', gap: 'clamp(12px, 2vw, 16px)', alignItems: 'flex-start',
        position: 'relative', overflow: 'hidden',
        transition: 'border-color 0.2s, transform 0.15s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = RED + '66'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = CARD_BORDER; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
    >
      {/* Thumbnail */}
      <div style={{
        width: 'clamp(100px, 140px, 163px)', height: 'clamp(60px, 80px, 93px)',
        borderRadius: '8px', overflow: 'hidden', flexShrink: 0, position: 'relative',
        background: '#1a1a1a', border: '1px solid #282828',
      }}>
        {epImg && <img src={epImg} alt={epTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        {!isLocked && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.25))',
            }}>
              <svg width="12" height="14" viewBox="0 0 6 8" fill="#000"><path d="M0 0v7.583l5.958-3.791L0 0z" /></svg>
            </div>
          </div>
        )}
        {isLocked && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '10px', color: '#737373', fontWeight: 700, fontFamily: 'Poppins, sans-serif', marginBottom: '4px' }}>
          EPISODE {ep.number}
        </p>
        <h3 style={{ fontSize: 'clamp(13px, 1.5vw, 16px)', fontWeight: 700, color: isLocked ? '#888' : '#fff', marginBottom: '6px', lineHeight: 1.2 }}>
          {epTitle}
        </h3>
        <p style={{ fontSize: 'clamp(9px, 1vw, 11px)', color: isLocked ? '#555' : '#fff', lineHeight: 1.5, fontWeight: 300 }}>
          {epDesc}
          {!isLocked && <span style={{ color: '#565656', fontWeight: 600 }}> Selengkapnya...</span>}
        </p>
        {progress > 0 && !isDone && !isLocked && (
          <div style={{ height: '3px', background: '#2a2a2a', borderRadius: '2px', overflow: 'hidden', marginTop: '10px' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`, borderRadius: '2px' }} />
          </div>
        )}
        {isDone && <span style={{ fontSize: '10px', color: '#4ade80', fontWeight: 700, marginTop: '6px', display: 'inline-block' }}>✓ Selesai</span>}
        {isLocked && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <svg width="10" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#aaa' }}>Unlock</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Section header ─── */
function SectionHeader({ label, isPremium }: { label: string; isPremium?: boolean }) {
  const gradText = isPremium
    ? 'linear-gradient(90deg, #b6902d 0%, #f6ed88 28.4%, #d2ac47 71.2%, #e1c059 100%)'
    : `linear-gradient(90deg, ${RED} 0%, ${RED_DARK} 100%)`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'clamp(14px, 2vw, 20px)' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: '#0d0d0d',
        border: `0.5px solid ${isPremium ? '#b6902d44' : '#3a3a3a'}`,
        borderRadius: '60px',
        padding: '6px 20px',
      }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
          background: isPremium
            ? 'linear-gradient(90deg, #b6902d 0%, #f6ed88 50%, #e1c059 100%)'
            : `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
        }} />
        <span style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
          fontFamily: 'Poppins, sans-serif',
          background: gradText,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>{label}</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [epLoading, setEpLoading] = useState(true);

  useEffect(() => {
    (async () => { const u = await getUser(); if (u) setUser(u); })();
  }, []);

  // Fetch real episode progress from API
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/member/episodes', { credentials: 'include' });
        const data = await res.json();
        if (data.success) setEpisodes(data.episodes);
      } catch { /* ignore */ }
      finally { setEpLoading(false); }
    })();
  }, []);

  const now = new Date();
  const days   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const standardEps   = episodes.filter(e => e.tier === 'standard');
  const premiumEps    = episodes.filter(e => e.tier === 'premium');
  const isPremiumUser = user?.tier === 'premium';

  // Continue watching: first episode with progress > 0 and < 100, or first episode
  const continueEp = standardEps.find(e => e.progress > 0 && !e.completed) || standardEps[0];
  const continueProgress = continueEp ? (continueEp.progress || 0) : 0;

  function handleEpisodeClick(ep: Episode) {
    if (ep.isLocked) { router.push('/trailer'); return; }
    router.push(`/watch/${ep.number}`);
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', position: 'relative' }}>

      {/* Red blob decorations */}
      <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', borderRadius: '50%', background: `radial-gradient(circle, rgba(241,48,30,0.12) 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '600px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: `radial-gradient(circle, rgba(241,48,30,0.08) 0%, transparent 70%)`, pointerEvents: 'none', zIndex: 0 }} />

      <div style={{
        padding: 'clamp(16px, 3vw, 32px) clamp(16px, 4vw, 24px)',
        paddingBottom: '40px', position: 'relative', zIndex: 1,
        maxWidth: '960px', margin: '0 auto',
      }}>

        {/* Greeting */}
        <div style={{ marginBottom: 'clamp(20px, 3vw, 28px)' }}>
          <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>{dateStr}</p>
          <p style={{ fontSize: 'clamp(18px, 5vw, 24px)', color: '#fff', marginBottom: '2px', lineHeight: 1.3 }}>
            <span style={{ fontWeight: 300 }}>Halo, Pagi </span><strong>{user?.name || 'Member'}</strong>
          </p>
          <p style={{
            fontSize: 'clamp(20px, 6vw, 28px)', fontWeight: 700, lineHeight: 1,
            background: `linear-gradient(90deg, ${RED} 0%, ${RED_DARK} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Mari kita mulai</p>
        </div>

        {/* Continue watching card — full width always */}
        {continueEp && !epLoading && (
          <div
            id="card-continue-watching"
            style={{
              background: `linear-gradient(110.8deg, ${RED} 2.6%, ${RED_DARK} 97.3%)`,
              borderRadius: '16px', padding: 'clamp(16px, 4vw, 22px)',
              marginBottom: 'clamp(24px, 4vw, 36px)', cursor: 'pointer',
              position: 'relative', overflow: 'hidden',
            }}
            onClick={() => router.push(`/watch/${continueEp.number}`)}
          >
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff9000', flexShrink: 0 }} />
              <span style={{ fontSize: '8px', fontWeight: 700, color: '#fff', letterSpacing: '1.5px', fontFamily: 'Montserrat, Poppins, sans-serif' }}>LANJUTKAN MENONTON</span>
            </div>
            <h2 style={{ fontSize: 'clamp(22px, 6vw, 32px)', fontWeight: 700, color: '#fff', marginBottom: '6px', lineHeight: 1.1 }}>
              {EP_TITLES[continueEp.number] || continueEp.title}
            </h2>
            <p style={{ fontSize: '8px', fontWeight: 400, color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
              Strategi Rahasia Dapat Kerja • Episode {continueEp.number} • Bantuan Ordal
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ flex: 1, height: '5px', background: '#470d0d', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${continueProgress}%`, background: '#fff', borderRadius: '5px', transition: 'width 0.4s' }} />
              </div>
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{Math.round(continueProgress)}%</span>
            </div>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#fff', border: 'none', borderRadius: '5px',
              padding: '7px 20px', cursor: 'pointer',
              fontSize: '10px', fontWeight: 500, color: '#000', fontFamily: 'Poppins, sans-serif',
            }}>
              <svg width="6" height="8" viewBox="0 0 6 8" fill="#000"><path d="M0 0v7.583l5.958-3.791L0 0z" /></svg>
              Lanjutkan menonton
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {epLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
            {[1, 2].map(i => (
              <div key={i} style={{
                background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: '16px',
                padding: '18px', display: 'flex', gap: '14px',
              }}>
                <div style={{ width: '120px', height: '70px', borderRadius: '8px', background: '#1a1a1a', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: '10px', background: '#1a1a1a', borderRadius: '4px', width: '40%', marginBottom: '8px' }} />
                  <div style={{ height: '14px', background: '#1a1a1a', borderRadius: '4px', width: '70%', marginBottom: '6px' }} />
                  <div style={{ height: '10px', background: '#1a1a1a', borderRadius: '4px', width: '90%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!epLoading && (
          <>
            {/* STANDARD SECTION */}
            <SectionHeader label="STANDART" />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))',
              gap: 'clamp(10px, 2vw, 14px)',
              marginBottom: 'clamp(24px, 4vw, 36px)',
            }}>
              {standardEps.map(ep => (
                <EpisodeCard key={ep.id} ep={ep} isLocked={false} onClick={() => handleEpisodeClick(ep)} />
              ))}
            </div>

            {/* PREMIUM SECTION */}
            <SectionHeader label="PREMIUM" isPremium />
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))',
              gap: 'clamp(10px, 2vw, 14px)',
            }}>
              {premiumEps.map(ep => (
                <EpisodeCard key={ep.id} ep={ep} isLocked={ep.isLocked} onClick={() => handleEpisodeClick(ep)} />
              ))}
              {premiumEps.length === 0 && standardEps.map(ep => (
                <EpisodeCard
                  key={`prem-${ep.id}`}
                  ep={{ ...ep, id: `prem-${ep.id}`, tier: 'premium', isLocked: !isPremiumUser, progress: 0, completed: false }}
                  isLocked={!isPremiumUser}
                  onClick={() => router.push('/trailer')}
                />
              ))}
            </div>

            {/* Upgrade CTA */}
            {!isPremiumUser && (
              <div style={{
                marginTop: 'clamp(20px, 4vw, 28px)',
                background: 'linear-gradient(135deg, #1a0505, #0d0d0d)',
                border: `1px solid ${RED}44`, borderRadius: '16px',
                padding: 'clamp(16px, 4vw, 24px)', textAlign: 'center',
              }}>
                <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '12px', lineHeight: 1.5 }}>
                  Upgrade ke Premium untuk buka semua episode eksklusif.
                </p>
                <button
                  id="btn-upgrade"
                  onClick={() => router.push('/upgrade')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '12px 28px', borderRadius: '60px',
                    background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
                    border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#fff',
                    boxShadow: '0 0 20px rgba(241,48,30,0.3)', fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  🔓 Upgrade ke Premium
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
