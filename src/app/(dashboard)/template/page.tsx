'use client';

import { useRouter } from 'next/navigation';

const RED      = '#f1301e';
const RED_DARK = '#9f2315';
const CARD_BG  = '#111111';
const CARD_BORDER = '#2a2a2a';

const TEMPLATES = [
  {
    id: 'cv-ats-id',
    title: 'Template CV ATS Bahasa Indonesia',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="2" width="18" height="20" rx="2" fill={`${RED}22`} stroke={RED} strokeWidth="1.5" />
        <path d="M7 7h10M7 11h10M7 15h6" stroke={RED} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    available: true,
    action: () => {},
  },
  {
    id: 'cv-ats-en',
    title: 'Template CV ATS Bahasa Inggris',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="2" width="18" height="20" rx="2" fill={`${RED}22`} stroke={RED} strokeWidth="1.5" />
        <path d="M7 7h10M7 11h10M7 15h6" stroke={RED} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="18" cy="6" r="5" fill="#1a1a1a" stroke={RED} strokeWidth="1.5" />
        <text x="15.5" y="8" fontSize="5" fill={RED} fontWeight="bold">EN</text>
      </svg>
    ),
    available: true,
    action: () => {},
  },
  {
    id: 'pertanyaan-hrd',
    title: 'Template Pertanyaan HRD',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="5" stroke={RED} strokeWidth="1.5" />
        <path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke={RED} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="18" cy="6" r="5" fill="#1a1a1a" stroke={RED} strokeWidth="1.5" />
        <path d="M18 4v2M18 8v.5" stroke={RED} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    available: true,
    action: () => {},
  },
  {
    id: 'certificate',
    title: 'Certificate',
    icon: null,
    available: false,
    comingSoon: true,
  },
];

const CV_TOOLS = [
  {
    id: 'bikin-cv-ats',
    label: 'Bikin CV ATS',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="2" width="18" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 7h10M7 11h10M7 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M17 18l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    path: '/template/bikin-cv',
  },
  {
    id: 'review-cv-ats',
    label: 'Review CV ATS',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    path: '/template/review-cv',
  },
];

export default function TemplatePage() {
  const router = useRouter();

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div style={{
        maxWidth: '500px', margin: '0 auto',
        padding: 'clamp(16px, 3vw, 28px) clamp(16px, 4vw, 24px)',
        paddingBottom: '100px',
      }}>

        {/* ── 2×2 Template Grid ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(10px, 2vw, 14px)',
          marginBottom: 'clamp(24px, 4vw, 32px)',
        }}>
          {TEMPLATES.map(tmpl => (
            <div
              key={tmpl.id}
              id={`template-${tmpl.id}`}
              onClick={tmpl.available ? tmpl.action : undefined}
              style={{
                background: CARD_BG,
                border: `1px solid ${CARD_BORDER}`,
                borderRadius: '16px',
                padding: 'clamp(14px, 3vw, 20px) clamp(12px, 2.5vw, 16px)',
                cursor: tmpl.available ? 'pointer' : 'default',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                gap: '10px', minHeight: '110px',
                transition: 'border-color 0.2s, transform 0.15s',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (tmpl.available) {
                  (e.currentTarget as HTMLDivElement).style.borderColor = RED + '66';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = CARD_BORDER;
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              {tmpl.comingSoon ? (
                /* Coming Soon card */
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', flex: 1, gap: '6px' }}>
                  <p style={{
                    fontSize: 'clamp(16px, 5vw, 22px)', fontWeight: 800, textAlign: 'center',
                    background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    lineHeight: 1.2,
                  }}>COMING<br />SOON</p>
                  <p style={{ fontSize: '10px', color: '#555', textAlign: 'center' }}>{tmpl.title}</p>
                </div>
              ) : (
                <>
                  {/* Icon */}
                  <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {tmpl.icon}
                  </div>
                  {/* Title */}
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#ccc', lineHeight: 1.4, margin: 0 }}>
                    {tmpl.title}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* ── CV Tools Section ── */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(16px, 3vw, 24px)' }}>
          <h2 style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 700, color: '#fff', margin: 0 }}>
            CV <span style={{
              background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Tools</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(10px, 2vw, 14px)' }}>
          {CV_TOOLS.map(tool => (
            <button
              key={tool.id}
              id={tool.id}
              onClick={() => router.push(tool.path)}
              style={{
                background: CARD_BG,
                border: `1px solid ${CARD_BORDER}`,
                borderRadius: '12px',
                padding: 'clamp(14px, 3vw, 18px) clamp(10px, 2vw, 16px)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                color: '#ccc', fontSize: 'clamp(11px, 2.5vw, 13px)', fontWeight: 600,
                fontFamily: 'Poppins, sans-serif',
                transition: 'border-color 0.2s, transform 0.15s, color 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = RED + '66';
                (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = CARD_BORDER;
                (e.currentTarget as HTMLButtonElement).style.color = '#ccc';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
            >
              {tool.icon}
              {tool.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
