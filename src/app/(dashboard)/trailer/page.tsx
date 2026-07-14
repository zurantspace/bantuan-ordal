'use client';

import { useRouter } from 'next/navigation';
import { EPISODES } from '@/lib/mockData';
import { LockKey, ArrowRight, Star, PlayCircle } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

const RED = '#f1301e';
const DARK = '#0d0d0d';
const BORDER = '#1f1f1f';

const PREMIUM_PERKS = [
  '5 episode eksklusif (Ep.5–9) akses seumur hidup',
  'Personal Branding & LinkedIn Optimization',
  'Network Building — Referral Internal tanpa Nepotisme',
  'Interview Mastery — Teknik Jawab Pro',
  'First 90 Days — Survive & Thrive di Kerja Baru',
  'Career Acceleration — Naik Jabatan Cepat',
  'Semua bonus template Pack (senilai Rp 200.000)',
  'Sertifikat Premium + badge alumni eksklusif',
];

const premiumEps = EPISODES.filter(e => e.tier === 'premium');

export default function TrailerPage() {
  const router = useRouter();

  return (
    <div className="dashboard-shell">
      <div className="dashboard-container" style={{ paddingBottom: '100px' }}>

        {/* Hero */}
        <div style={{
          padding: '52px 20px 28px',
          background: 'linear-gradient(160deg, #1a0505 0%, #0d0d0d 100%)',
          position: 'relative', overflow: 'hidden', textAlign: 'center',
        }}>
          {/* Glow */}
          <div style={{
            position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)',
            width: '400px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(241,48,30,0.15) 0%, transparent 70%)',
            filter: 'blur(40px)', pointerEvents: 'none',
          }} />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ position: 'relative' }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(241,48,30,0.1)', border: '1px solid ' + RED + '44',
              borderRadius: '60px', padding: '5px 14px', fontSize: '10px', fontWeight: 700, color: RED,
              marginBottom: '14px', letterSpacing: '1px',
            }}>
              <LockKey size={12} weight="fill" /> KONTEN PREMIUM
            </div>

            <h1 style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: '12px' }}>
              Kamu Sudah di Level Berikutnya.
              <br />
              <span style={{ color: RED }}>Saatnya Upgrade.</span>
            </h1>
            <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto 20px' }}>
              Ep.1–4 sudah cukup untuk lolos interview pertama. Tapi untuk akselerasi karir jangka panjang, kamu butuh lebih.
            </p>
          </motion.div>
        </div>

        {/* Preview video */}
        <div style={{ padding: '20px' }}>
          <div style={{
            borderRadius: '16px', overflow: 'hidden', border: '1px solid ' + BORDER,
            aspectRatio: '16/9', background: '#0a0a0a', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px',
              background: 'linear-gradient(135deg, #0d0d0d 0%, #1a0505 100%)',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'rgba(241,48,30,0.12)', border: '1px solid ' + RED + '44',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <LockKey size={28} weight="fill" style={{ color: RED + '88' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#555', marginBottom: '4px' }}>Preview Dikunci</div>
                <div style={{ fontSize: '11px', color: '#444' }}>Upgrade untuk nonton semua episode premium</div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium episodes list */}
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#555', letterSpacing: '1px', marginBottom: '12px' }}>
            5 EPISODE PREMIUM YANG AKAN KAMU DAPAT
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {premiumEps.map((ep, i) => (
              <motion.div key={ep.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  background: DARK, border: '1px solid ' + BORDER, borderRadius: '12px',
                  padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.75,
                }}
              >
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                  background: '#111', border: '1px solid ' + BORDER,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', fontWeight: 800, color: '#444',
                }}>Ep.{ep.number}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#555', marginBottom: '2px' }}>{ep.title}</div>
                  <div style={{ fontSize: '10px', color: '#333' }}>{ep.subtitle} · {ep.duration}</div>
                </div>
                <LockKey size={16} style={{ color: '#333', flexShrink: 0 }} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* What you get */}
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ background: DARK, border: '1px solid ' + BORDER, borderRadius: '16px', padding: '20px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#555', letterSpacing: '1px', marginBottom: '14px' }}>
              SEMUA YANG KAMU DAPAT DI PAKET PREMIUM
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {PREMIUM_PERKS.map((perk, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: RED, fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>✓</span>
                  <span style={{ fontSize: '12px', color: '#bbb', lineHeight: 1.5 }}>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky CTA */}
        <div style={{ position: 'sticky', bottom: '80px', padding: '0 20px' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'linear-gradient(135deg, #1a0505, #0d0d0d)',
              border: '1px solid ' + RED + '55', borderRadius: '20px', padding: '18px',
              boxShadow: '0 8px 40px rgba(241,48,30,0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '3px' }}>Upgrade ke Premium</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '26px', fontWeight: 900, color: '#fff' }}>Rp 149.000</span>
                  <span style={{ fontSize: '13px', color: '#444', textDecoration: 'line-through' }}>Rp 299.000</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '3px' }}>
                {Array(5).fill(0).map((_, i) => <Star key={i} size={13} weight="fill" style={{ color: '#fbbf24' }} />)}
              </div>
            </div>
            <button
              id="btn-upgrade-trailer"
              onClick={() => router.push('/upgrade')}
              style={{
                width: '100%', height: '50px', borderRadius: '60px', border: 'none', cursor: 'pointer',
                background: `linear-gradient(90deg, ${RED}, #9f2315)`,
                fontFamily: 'Poppins, sans-serif', fontSize: '15px', fontWeight: 700, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 0 30px rgba(241,48,30,0.4)',
              }}
            >
              Upgrade Sekarang <ArrowRight weight="bold" size={16} />
            </button>
            <p style={{ textAlign: 'center', fontSize: '10px', color: '#444', marginTop: '8px' }}>
              🛡️ Garansi 30 hari · ⚡ Akses instan
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
