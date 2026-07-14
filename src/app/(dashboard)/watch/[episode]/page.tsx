'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EPISODES } from '@/lib/mockData';
import { setEpisodeProgress } from '@/lib/auth';
import { ArrowLeft, ArrowLeft as PrevIcon, ArrowRight, Lock, CheckCircle } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

const RED = '#f1301e';
const DARK = '#0d0d0d';
const BORDER = '#1f1f1f';

export default function WatchPage() {
  const router   = useRouter();
  const params   = useParams();
  const episodeNum = parseInt(params.episode as string, 10) || 1;
  const episode  = EPISODES.find(e => e.number === episodeNum) || EPISODES[0];
  const isPremium = episode.tier === 'premium';

  const [progress, setProgress] = useState(episode.progress || 0);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Redirect premium episodes to trailer/upgrade page
  useEffect(() => {
    if (isPremium) { router.replace('/trailer'); }
  }, [isPremium, router]);

  // Mark as complete when progress reaches 100
  useEffect(() => {
    if (progress >= 100) {
      setEpisodeProgress(String(episode.id), 100, 100).catch(console.error);
    }
  }, [progress, episode.id]);

  const prevEp = EPISODES.find(e => e.number === episodeNum - 1 && e.tier === 'standard');
  const nextEp = EPISODES.find(e => e.number === episodeNum + 1);
  const isCompleted = progress >= 100;

  if (isPremium) return null;

  return (
    <div className="dashboard-shell">
      <div className="dashboard-container" style={{ paddingBottom: '100px' }}>

        {/* ── Top Bar ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '20px 20px 0',
        }}>
          <button
            id="btn-back"
            onClick={() => router.back()}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#111', border: '1px solid ' + BORDER,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            <ArrowLeft size={16} style={{ color: '#ccc' }} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '10px', color: '#555', marginBottom: '1px', fontWeight: 600, letterSpacing: '0.5px' }}>
              EP. {episode.number} — STANDAR
            </div>
            <h1 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {episode.title}
            </h1>
          </div>
          {isCompleted && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#4ade80', fontWeight: 700, flexShrink: 0 }}>
              <CheckCircle size={16} weight="fill" /> Selesai
            </div>
          )}
        </div>

        {/* ── Putar + Template buttons (per Figma) ── */}
        <div style={{ display: 'flex', gap: '10px', padding: '14px 20px 8px' }}>
          <button
            id="btn-putar"
            style={{
              flex: 1, height: '36px', borderRadius: '8px',
              background: 'none', border: '1px solid #3a3a3a',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              cursor: 'pointer', color: '#ccc', fontSize: '12px', fontWeight: 600,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            <svg width="10" height="12" viewBox="0 0 6 8" fill="currentColor"><path d="M0 0v7.583l5.958-3.791L0 0z" /></svg>
            Putar
          </button>
          <button
            id="btn-go-template"
            onClick={() => router.push('/template')}
            style={{
              flex: 1, height: '36px', borderRadius: '8px',
              background: `linear-gradient(90deg, #f1301e, #9f2315)`,
              border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              cursor: 'pointer', color: '#fff', fontSize: '12px', fontWeight: 600,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            <svg width="12" height="14" viewBox="0 0 18 18.375" fill="none">
              <rect x="0" y="0" width="18" height="18.375" rx="1.969" fill="rgba(255,255,255,0.25)" />
              <path d="M5.9 5.465c.79 0 1.49.278 2.007.696.477.388.701.775.896 1.123l-1.363.695c-.097-.228-.215-.466-.516-.725-.323-.269-.653-.349-.936-.349-1.11 0-1.694 1.054-1.694 2.227 0 1.541.77 2.306 1.694 2.306.896 0 1.257-.636 1.49-1.043l1.354.706c-.253.407-.497.805-1.042 1.192-.292.21-.963.618-1.917.618-1.822 0-3.292-1.352-3.292-3.729 0-2.077 1.383-3.717 3.33-3.717zm3.033.218h1.831l1.421 4.991 1.411-4.991H15.43l-2.386 7.018H11.32L8.933 5.683z" fill="white" />
            </svg>
            Template
          </button>
        </div>

        {/* ── Video Player ── */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{
            borderRadius: '16px', overflow: 'hidden',
            border: '1px solid ' + BORDER, position: 'relative',
            aspectRatio: '16/9', background: '#0a0a0a',
            boxShadow: '0 0 40px rgba(241,48,30,0.08)',
          }}>
            {episode.videoUrl ? (
              <iframe
                src={episode.videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setVideoLoaded(true)}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                title={`Episode ${episode.number} — ${episode.title}`}
              />
            ) : (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '12px',
              }}>
                <div style={{ fontSize: '48px', opacity: 0.3 }}>▶</div>
                <p style={{ fontSize: '13px', color: '#444' }}>Video belum tersedia</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Apa yang dipelajari disini? (per Figma 170:210) ── */}
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{
            background: DARK, border: '1px solid ' + BORDER,
            borderRadius: '14px', padding: '16px 18px',
          }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
              Apa yang dipelajari disini?
            </p>
            <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(episode.learnings || [
                'Cara membangun personal brand yang kuat',
                'Strategi melamar kerja yang efektif',
                'Teknik interview yang terbukti berhasil',
              ]).map((item: string, i: number) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: RED, fontWeight: 700, fontSize: '10px', marginTop: '2px', flexShrink: 0 }}>•</span>
                  <span style={{ fontSize: '11px', color: '#ccc', lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Progress Bar (manual, user-controlled) ── */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{
            background: DARK, border: '1px solid ' + BORDER,
            borderRadius: '14px', padding: '16px 18px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#ccc' }}>Progress Menonton</span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: isCompleted ? '#4ade80' : RED }}>{progress}%</span>
            </div>
            <div style={{ height: '6px', background: '#1a1a1a', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
              <motion.div
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                style={{
                  height: '100%',
                  background: isCompleted
                    ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                    : `linear-gradient(90deg, ${RED}, #9f2315)`,
                  borderRadius: '3px',
                }}
              />
            </div>
            {!isCompleted && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {[25, 50, 75, 100].map(pct => (
                  <button
                    key={pct}
                    id={`progress-${pct}`}
                    onClick={() => { setProgress(pct); setEpisodeProgress(String(episode.id), pct, 100).catch(console.error); }}
                    style={{
                      flex: 1, height: '28px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                      background: progress >= pct ? RED + '22' : '#111',
                      color: progress >= pct ? RED : '#444',
                      fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: 700,
                      transition: 'all 0.15s',
                    }}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            )}
            {isCompleted && (
              <div style={{ textAlign: 'center', fontSize: '12px', color: '#4ade80', fontWeight: 700 }}>
                ✓ Episode ini sudah selesai ditonton!
              </div>
            )}
          </div>
        </div>

        {/* ── Episode Info ── */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{
            background: DARK, border: '1px solid ' + BORDER,
            borderRadius: '14px', padding: '18px',
          }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#555', letterSpacing: '1px', marginBottom: '10px' }}>
              TENTANG EPISODE INI
            </div>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{episode.title}</h2>
            <div style={{ fontSize: '11px', color: RED, fontWeight: 700, marginBottom: '10px' }}>{episode.subtitle}</div>
            <p style={{ fontSize: '12px', color: '#888', lineHeight: 1.7 }}>{episode.description}</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '14px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10px', color: '#444' }}>⏱ {episode.duration}</span>
              <span style={{ fontSize: '10px', color: '#444' }}>📺 Self-paced</span>
              <span style={{ fontSize: '10px', color: '#444' }}>🔁 Bisa diputar ulang</span>
            </div>
          </div>
        </div>

        {/* ── Prev / Next Navigation ── */}
        <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {prevEp ? (
            <button
              id="btn-prev"
              onClick={() => router.push(`/watch/${prevEp.number}`)}
              style={{
                background: DARK, border: '1px solid ' + BORDER, borderRadius: '14px',
                padding: '14px', cursor: 'pointer', textAlign: 'left', fontFamily: 'Poppins, sans-serif',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = RED + '44'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = BORDER; }}
            >
              <div style={{ fontSize: '10px', color: '#444', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <PrevIcon size={10} /> Episode Sebelumnya
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Ep.{prevEp.number} — {prevEp.title}
              </div>
            </button>
          ) : <div />}

          {nextEp && (
            <button
              id="btn-next"
              onClick={() => nextEp.tier === 'premium' ? router.push('/trailer') : router.push(`/watch/${nextEp.number}`)}
              style={{
                background: nextEp.tier === 'premium' ? 'linear-gradient(135deg, #1a0505, #0d0d0d)' : DARK,
                border: '1px solid ' + (nextEp.tier === 'premium' ? RED + '44' : BORDER),
                borderRadius: '14px', padding: '14px', cursor: 'pointer',
                textAlign: 'right', fontFamily: 'Poppins, sans-serif',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ fontSize: '10px', color: '#444', marginBottom: '3px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                Episode Berikutnya <ArrowRight size={10} />
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: nextEp.tier === 'premium' ? RED : '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {nextEp.tier === 'premium' ? '🔒 ' : ''}Ep.{nextEp.number} — {nextEp.title}
              </div>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
