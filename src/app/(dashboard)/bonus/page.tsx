'use client';

import { useRouter } from 'next/navigation';

const RED = '#f1301e';
const RED_DARK = '#9f2315';
const CARD_BG = '#101010';
const CARD_BORDER = '#3a3a3a';

const EPISODES = [
  {
    number: 1,
    title: 'Jual Diri',
    description: 'CV bukan riwayat hidup, ini IKLAN. Pelajari cara menjual dirimu agar HRD nggak bisa melewatkan namamu.',
    image: '/design/bonus/images/f7d7057ebdc199b21129a21ba98b1cef8867a64d.png',
  },
  {
    number: 2,
    title: 'Pembuktian',
    description: 'Bukan soal siapa yang paling qualified, tapi siapa yang paling strategis.',
    image: '/design/bonus/images/c24cc39fd63bc306fa3df21baff815eddd56f1dd.png',
  },
  {
    number: 3,
    title: 'Gaji Dolar',
    description: 'Kerja remote bukan cuma soal skill, tapi soal tahu cara masuk ke dalamnya. Ini peta jalannya!',
    image: '/design/bonus/images/e9295c6b0708167e1d59082995d4dbaef4f10cf6.png',
  },
];

export default function BonusPage() {
  const router = useRouter();

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div style={{
        maxWidth: '1000px', margin: '0 auto',
        padding: 'clamp(16px, 3vw, 32px) clamp(16px, 4vw, 40px)',
        paddingBottom: '120px',
      }}>

        {/* Section heading — per Figma: camera icon + "SPECIAL VIDEO" badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'clamp(16px, 2.5vw, 28px)' }}>
          {/* Camera icon */}
          <div style={{
            width: '36px', height: '28px', background: '#1a1a1a',
            border: `1px solid ${CARD_BORDER}`, borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="14" viewBox="0 0 14.625 9.75" fill="none">
              <path d="M2.063 0C1.516 0 .991.217.604.604.217.991 0 1.516 0 2.063V7.688c0 .547.217 1.072.604 1.459.387.387.912.604 1.459.604H8.438c.547 0 1.072-.217 1.459-.604.387-.387.604-.912.604-1.459V6.492L13.064 8.776C13.668 9.314 14.625 8.885 14.625 8.075V1.399C14.625.589 13.668.161 13.064.698L10.5 2.982V2.063C10.5 1.516 10.283.991 9.896.604 9.509.217 8.984 0 8.438 0H2.062z"
                fill={`url(#camGrad)`} />
              <defs>
                <linearGradient id="camGrad" x1="0" y1="0" x2="14.625" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor={RED} /><stop offset="1" stopColor={RED_DARK} />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* SPECIAL VIDEO badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: `linear-gradient(90deg, #49120d 0%, #1a0605 100%)`,
            border: `1px solid ${RED}55`,
            borderRadius: '60px', padding: '6px 18px',
          }}>
            <h1 style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
              background: `linear-gradient(90deg, ${RED} 0%, ${RED_DARK} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              margin: 0,
            }}>SPECIAL VIDEO</h1>
          </div>
        </div>

        {/* Episode cards — same layout as Home per Figma */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 16px)' }}>
          {EPISODES.map(ep => (
            <div
              key={ep.number}
              onClick={() => router.push(`/watch/${ep.number}`)}
              style={{
                background: CARD_BG, border: `1px solid ${CARD_BORDER}`,
                borderRadius: '16px', padding: 'clamp(14px, 2vw, 18px)',
                cursor: 'pointer',
                display: 'flex', gap: 'clamp(12px, 2vw, 16px)', alignItems: 'flex-start',
                transition: 'border-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = RED + '66'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = CARD_BORDER; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
            >
              {/* Thumbnail 163×93 */}
              <div style={{
                width: 'clamp(120px, 18vw, 163px)', height: 'clamp(70px, 10vw, 93px)',
                borderRadius: '8px', overflow: 'hidden', flexShrink: 0, position: 'relative',
                background: '#1a1a1a', border: '1px solid #282828',
              }}>
                <img src={ep.image} alt={ep.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {/* Play button overlay */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.25))',
                  }}>
                    <svg width="12" height="14" viewBox="0 0 6 8" fill="#000"><path d="M0 0v7.583l5.958-3.791L0 0z" /></svg>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 'clamp(10px, 1.1vw, 13px)', color: '#737373', fontWeight: 700, marginBottom: '4px' }}>
                  EPISODE {ep.number}
                </p>
                <h3 style={{ fontSize: 'clamp(13px, 1.5vw, 16px)', fontWeight: 700, color: '#fff', marginBottom: '6px', lineHeight: 1.2 }}>
                  {ep.title}
                </h3>
                <p style={{ fontSize: 'clamp(9px, 1vw, 11px)', color: '#fff', lineHeight: 1.5, fontWeight: 300 }}>
                  {ep.description}
                  <span style={{ color: '#565656', fontWeight: 600 }}> Selengkapnya...</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
