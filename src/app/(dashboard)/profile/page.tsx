'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';

const RED      = '#f1301e';
const RED_DARK = '#9f2315';
const CARD_BG  = '#0d0d0d';
const CARD_BORDER = '#282828';

const WATCH_HISTORY = [
  {
    id: 1, epNum: 2, title: 'Episode 2',
    desc: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: '/design/home/images/c24cc39fd63bc306fa3df21baff815eddd56f1dd.png',
  },
  {
    id: 2, epNum: 2, title: 'Episode 2',
    desc: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    image: '/design/home/images/c24cc39fd63bc306fa3df21baff815eddd56f1dd.png',
  },
];

type ProfileTab = 'watch' | 'wallet' | 'affiliate' | 'settings';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>('watch');

  useEffect(() => {
    (async () => { const u = await getUser(); if (u) setUser(u); })();
  }, []);

  const now = new Date();
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const memberSince = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const username = user?.name ? '@' + user.name.toLowerCase().replace(/\s+/g, '') : '@member';
  const isPremium = user?.tier === 'premium';

  const TABS: { key: ProfileTab; label: string }[] = [
    { key: 'watch',     label: 'Watch' },
    { key: 'wallet',    label: 'Wallet' },
    { key: 'affiliate', label: 'Affiliate' },
    { key: 'settings',  label: 'Settings' },
  ];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', minHeight: '100vh' }}>

      {/* ── Hero Banner ── */}
      <div style={{
        height: '200px', width: '100%', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(119.6deg, #871409 0%, #000 94.7%)',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(241,48,30,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(241,48,30,0.08)', pointerEvents: 'none' }} />
      </div>

      {/* ── Avatar + Info ── */}
      <div style={{ padding: '0 clamp(16px, 4vw, 24px)', maxWidth: '500px', margin: '0 auto' }}>

        {/* Avatar — overlaps hero */}
        <div style={{ marginTop: '-44px', marginBottom: '12px' }}>
          <div style={{
            width: '82px', height: '82px', borderRadius: '50%',
            background: '#212121', border: '3px solid #000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', color: '#fff', flexShrink: 0,
          }}>
            {user?.name?.[0]?.toUpperCase() || '👤'}
          </div>
        </div>

        {/* Name + username */}
        <h1 style={{ fontSize: '20px', fontWeight: 500, color: '#fff', margin: '0 0 4px 0' }}>
          {user?.name || 'Member'}
        </h1>
        <p style={{ fontSize: '12px', color: '#4b4b4b', margin: '0 0 12px 0' }}>{username}</p>

        {/* Member since + VIP badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="10" height="12" viewBox="0 0 7 10" fill="#6c6c6c">
              <path d="M3.5 4.75C3.169 4.75 2.851 4.618 2.616 4.384 2.382 4.15 2.25 3.832 2.25 3.5 2.25 3.169 2.382 2.851 2.616 2.616 2.851 2.382 3.169 2.25 3.5 2.25 3.832 2.25 4.15 2.382 4.384 2.616 4.618 2.851 4.75 3.169 4.75 3.5 4.75 3.664 4.718 3.827 4.655 3.978 4.592 4.13 4.5 4.268 4.384 4.384 4.268 4.5 4.13 4.592 3.978 4.655 3.827 4.718 3.664 4.75 3.5 4.75ZM3.5 0C2.572 0 1.682.369 1.025 1.025.369 1.682 0 2.572 0 3.5 0 6.125 3.5 10 3.5 10 3.5 10 7 6.125 7 3.5 7 2.572 6.631 1.682 5.975 1.025 5.319.369 4.428 0 3.5 0Z" />
            </svg>
            <span style={{ fontSize: '11px', color: '#666565' }}>Member since {memberSince}</span>
          </div>

          {isPremium && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'linear-gradient(90deg, #b6902d 0%, #f6ed88 28.4%, #d2ac47 71.2%, #e1c059 100%)',
              borderRadius: '5px', padding: '3px 8px',
            }}>
              <svg width="10" height="10" viewBox="0 0 6.667 6.667" fill="#000">
                <path d="M2.384 1.136C2.807.379 3.018 0 3.333 0c.316 0 .527.379.949 1.136l.11.196c.12.215.18.323.273.394.093.07.21.097.443.149l.212.048c.82.186 1.23.278 1.327.592.098.313-.181.64-.74 1.294l-.145.169c-.158.186-.238.279-.274.393-.035.115-.023.238.001.487l.022.226c.084.872.126 1.308-.13 1.501-.255.194-.639.017-1.406-.336l-.199-.091C3.558 6.058 3.449 6.008 3.333 6.008c-.116 0-.225.05-.443.151l-.198.091c-.768.353-1.152.53-1.407.337-.255-.194-.213-.63-.128-1.502l.022-.226c.024-.248.036-.372 0-.487C1.143 4.257 1.064 4.165.905 3.979L.76 3.81C.201 3.157-.079 2.83.019 2.516.116 2.202.527 2.11 1.347 1.924l.211-.048c.233-.052.35-.079.443-.15.094-.07.154-.178.274-.393l.109-.197Z" />
              </svg>
              <span style={{ fontSize: '8px', fontWeight: 600, color: '#000' }}>VIP Premium</span>
            </div>
          )}
        </div>

        {/* ── Horizontal Tab Bar ── */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          {/* Bottom border full width */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: '#3a3a3a' }} />
          <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  id={`profile-tab-${tab.key}`}
                  onClick={() => {
                    if (tab.key === 'wallet')    { router.push('/wallet'); return; }
                    if (tab.key === 'affiliate') { router.push('/affiliate'); return; }
                    if (tab.key === 'settings')  { router.push('/settings'); return; }
                    setActiveTab(tab.key);
                  }}
                  style={{
                    flex: '0 0 auto',
                    padding: '10px 16px 12px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '14px', fontWeight: 500,
                    color: isActive ? '#fff' : '#535353',
                    fontFamily: 'Poppins, sans-serif',
                    position: 'relative', whiteSpace: 'nowrap',
                    transition: 'color 0.2s',
                  }}
                >
                  {isActive && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
                      background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
                      borderRadius: '2px 2px 0 0',
                    }} />
                  )}
                  {/* Watch tab gets video icon */}
                  {tab.key === 'watch' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="14" height="10" viewBox="0 0 14.625 9.75" fill={isActive ? RED : '#535353'}>
                        <path d="M2.063 0C1.516 0 .991.217.604.604.217.991 0 1.516 0 2.063V7.688c0 .547.217 1.072.604 1.459.387.387.912.604 1.459.604H8.438c.547 0 1.072-.217 1.459-.604.387-.387.604-.912.604-1.459V6.492L13.064 8.776C13.668 9.314 14.625 8.885 14.625 8.075V1.399C14.625.589 13.668.161 13.064.698L10.5 2.982V2.063C10.5 1.516 10.283.991 9.896.604 9.509.217 8.984 0 8.438 0H2.062z" />
                      </svg>
                      {isActive ? <span style={{ color: RED }}>Watch</span> : 'Watch'}
                    </span>
                  ) : tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tab Content: Watch (History) ── */}
        {activeTab === 'watch' && (
          <div>
            {/* History badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <svg width="16" height="16" viewBox="0 0 14.25 14.25" fill="#535353">
                <path d="M7.125 14.25C5.304 14.25 3.718 13.647 2.366 12.44 1.013 11.232.238 9.725.04 7.917H1.663c.185 1.372.795 2.506 1.831 3.403 1.036.897 2.246 1.346 3.631 1.346 1.544 0 2.853-.538 3.929-1.613 1.076-1.075 1.613-2.385 1.612-3.928-.001-1.545-.539-2.853-1.613-3.927C9.978 2.122 8.67 1.584 7.125 1.583c-.91 0-1.761.211-2.553.634-.79.422-1.457.999-2 1.741H4.75V5.542H0V.792h1.583V2.652C2.256 1.808 3.078 1.155 4.048.693 5.018.231 6.044 0 7.125 0c.99 0 1.917.188 2.78.565.866.376 1.618.884 2.258 1.523.639.639 1.147 1.391 1.523 2.256.376.865.565 1.792.564 2.781-.001.99-.189 1.917-.564 2.782-.376.864-.884 1.616-1.523 2.255-.639.638-1.391 1.147-2.257 1.523-.866.376-1.793.565-2.781.565zM9.342 10.45L6.333 7.442V3.167H7.917V6.808L10.45 9.342 9.342 10.45z" />
              </svg>
              <div style={{
                display: 'inline-flex', background: `linear-gradient(90deg, #49120d, #1a0605)`,
                border: `1px solid ${RED}44`, borderRadius: '60px', padding: '4px 14px',
              }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: RED }}>History</span>
              </div>
            </div>

            {/* History cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {WATCH_HISTORY.map((item, idx) => (
                <div key={item.id}>
                  <div
                    style={{
                      display: 'flex', gap: '14px', alignItems: 'flex-start',
                      padding: '14px 0', cursor: 'pointer',
                    }}
                    onClick={() => router.push(`/watch/${item.epNum}`)}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: '163px', height: '93px', flexShrink: 0,
                      borderRadius: '8px', overflow: 'hidden', position: 'relative',
                      background: '#1a1a1a', border: '1px solid #282828',
                    }}>
                      <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {/* Play overlay */}
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
                        }}>
                          <svg width="10" height="12" viewBox="0 0 6 8" fill="#000"><path d="M0 0v7.583l5.958-3.791L0 0z" /></svg>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '10px', color: '#737373', fontWeight: 700, marginBottom: '4px' }}>1. {item.title}</p>
                      <p style={{ fontSize: '9px', color: '#aaa', lineHeight: 1.5, fontWeight: 300 }}>{item.desc}</p>
                    </div>
                  </div>

                  {idx < WATCH_HISTORY.length - 1 && (
                    <div style={{ height: '0.5px', background: '#1e1e1e' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs — placeholder */}
        {activeTab !== 'watch' && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#444', fontSize: '13px' }}>
            Coming soon…
          </div>
        )}

      </div>
    </div>
  );
}
