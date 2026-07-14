'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import type { AuthUser } from '@/lib/auth';

const RED = '#f1301e';
const RED_DARK = '#9f2315';
const CARD_BG = '#101010';
const BORDER = '#3a3a3a';

/* ─── Sidebar Profile ────────────────────────────────────────── */
function SidebarProfile({ user, router }: { user: AuthUser | null; router: ReturnType<typeof useRouter> }) {
  const now = new Date();
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return (
    <div style={{ width: '240px', flexShrink: 0, marginRight: 'clamp(20px, 3vw, 40px)' }}>
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
            background: '#272727', border: `2px solid ${RED}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#fff',
          }}>{user?.name?.[0] || '👤'}</div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Member'}
            </p>
            <p style={{ fontSize: '9px', color: '#737373' }}>@{user?.email?.split('@')[0] || 'member'}</p>
            <p style={{ fontSize: '9px', color: '#737373', marginTop: '2px' }}>Member since {months[now.getMonth()]} {now.getDate()}, {now.getFullYear()}</p>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#fbbf24', marginTop: '4px' }}>VIP Premium</p>
          </div>
        </div>

        {[
          { label: 'Watch',     path: '/home',      icon: '▶' },
          { label: 'Wallet',    path: '/wallet',    icon: '💰' },
          { label: 'Affiliate', path: '/affiliate', icon: '🤝' },
          { label: 'Setting',   path: '/settings',  icon: '⚙️' },
        ].map(item => (
          <button key={item.path} onClick={() => router.push(item.path)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '13px', color: item.path === '/affiliate' ? '#fff' : '#888',
            fontFamily: 'Poppins, sans-serif', textAlign: 'left',
            borderBottom: '1px solid #1a1a1a', transition: 'color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#fff'}
            onMouseLeave={e => { if (item.path !== '/affiliate') (e.currentTarget as HTMLButtonElement).style.color = '#888'; }}
          >
            <span style={{ fontSize: '14px', width: '20px' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── FAQ Item ────────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: `1px solid ${open ? BORDER : '#1f1f1f'}`, borderRadius: '12px',
      overflow: 'hidden', transition: 'border-color 0.2s',
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px', background: open ? '#151515' : CARD_BG,
        border: 'none', cursor: 'pointer', textAlign: 'left', gap: '12px',
        fontFamily: 'Poppins, sans-serif', transition: 'background 0.2s',
      }}>
        <span style={{ fontSize: 'clamp(12px, 1.3vw, 14px)', fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>{q}</span>
        <span style={{ fontSize: '16px', color: '#737373', flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.25s' }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 18px 16px', background: '#151515' }}>
          <p style={{ fontSize: 'clamp(11px, 1.2vw, 13px)', color: '#737373', lineHeight: 1.6 }}>{a}</p>
        </div>
      )}
    </div>
  );
}

const FAQ = [
  { q: 'Liat komisinya dimana?', a: 'Otomatis tercatat tiap ada transaksi lewat link kamu. Bisa kamu pantau real-time di Wallet.' },
  { q: 'Gimana cara cairin komisi?', a: 'Masuk ke halaman Wallet, klik tombol "Cairkan Dana", pilih metode pembayaran (GoPay, OVO, Transfer Bank), dan ikuti instruksinya. Dana diproses dalam 1×24 jam kerja.' },
  { q: 'Link affiliate-nya bisa dipakai berkali-kali atau cuma sekali pakai?', a: 'Bisa berkali-kali! Link kamu adalah unik dan permanen. Setiap kali ada yang checkout lewat link itu, kamu dapat komisi.' },
  { q: 'Apa bedanya saya share dibanding orang lain yang nggak pernah ikut kelasnya?', a: 'Kamu punya kredibilitas nyata. Cerita kamu lebih dipercaya karena bukan sekadar iklan — kamu udah merasakan manfaatnya sendiri. Itu yang bikin konversi lebih tinggi.' },
  { q: 'Bonus reach itu maksudnya apa?', a: 'Setiap 1.000 klik dari link yang kamu share, kamu dapat bonus tambahan Rp 1.000 — berlaku kelipatan tanpa batas.' },
  { q: 'Kalau cuma share sekali ke grup angkatan, worth it nggak?', a: 'Worth it banget. Banyak alumni yang dapat komisi ratusan ribu hanya dari satu kali share ke grup angkatan. Hasilnya bergantung seberapa banyak yang beli lewat link kamu.' },
  { q: 'Worth it nggak sih dibanding kerja sampingan lain?', a: 'Nggak ada modal, nggak ada stok, nggak ada target. Cukup share link dan dapat komisi 50% per transaksi. Nggak ada kerja sampingan yang se-simple ini.' },
  { q: 'Apa ini cuma buat yang udah dapat kerja bagus aja?', a: 'Sama sekali nggak. Justru kalau kamu masih jobseeking pun bisa ikut. Kamu bisa earn sambil belajar.' },
];

/* ─── Calculator ─────────────────────────────────────────────── */
function Calculator() {
  const [basic, setBasic]     = useState(100);
  const [addon, setAddon]     = useState(95);
  const [extra, setExtra]     = useState(95);
  const [clicks, setClicks]   = useState(1000);

  const basicComm  = basic  * 50000 * 0.5;
  const addonComm  = addon  * 47000 * 0.5;
  const extraComm  = extra  * 149000 * 0.5;
  const bonusReach = Math.floor(clicks / 1000) * 1000;
  const total      = basicComm + addonComm + extraComm + bonusReach;

  function SliderRow({ label, sub, value, min, max, onChange, rp }: {
    label: string; sub?: string; value: number; min: number; max: number;
    onChange: (v: number) => void; rp: number;
  }) {
    return (
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '4px' }}>
          <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>{label} <span style={{ color: '#737373', fontSize: '10px' }}>{sub}</span></span>
          <span style={{ fontSize: '12px', color: '#fff', fontWeight: 700 }}>{value} Orang</span>
        </div>
        <input type="range" min={min} max={max} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ width: '100%', accentColor: RED, cursor: 'pointer', height: '4px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: '9px', color: '#737373' }}>Rp {rp.toLocaleString('id-ID')} × 50%</span>
          <span style={{ fontSize: '10px', color: '#fff', fontWeight: 700 }}>= Rp {(value * rp * 0.5).toLocaleString('id-ID')}</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: 'clamp(16px, 3vw, 28px)' }}>
      <p style={{ fontSize: '10px', fontWeight: 700, color: '#737373', letterSpacing: '1px', marginBottom: '20px' }}>RINCIAN KOMISI (50% PER TRANSAKSI)</p>

      <SliderRow label="Paket Biasa" sub="Akses 4 episode pertama" value={basic} min={0} max={500} onChange={setBasic} rp={50000} />
      <SliderRow label="Paket Tambahan" value={addon} min={0} max={500} onChange={setAddon} rp={47000} />
      <SliderRow label="Bonus Tambahan" value={extra} min={0} max={500} onChange={setExtra} rp={149000} />

      {/* Bonus Reach */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '4px' }}>
          <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>Bonus Reach <span style={{ fontSize: '9px', color: '#737373' }}>Rp 1.000/1.000 klik</span></span>
          <span style={{ fontSize: '12px', color: '#fff', fontWeight: 700 }}>{clicks.toLocaleString()} klik</span>
        </div>
        <input type="range" min={0} max={10000} step={100} value={clicks}
          onChange={e => setClicks(Number(e.target.value))}
          style={{ width: '100%', accentColor: RED, cursor: 'pointer', height: '4px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: '9px', color: '#737373' }}>Rp 1.000/1.000 klik *berlaku kelipatan</span>
          <span style={{ fontSize: '10px', color: '#fff', fontWeight: 700 }}>= Rp {bonusReach.toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* Summary context */}
      <p style={{ fontSize: '10px', color: '#737373', marginBottom: '14px', lineHeight: 1.6 }}>
        dari <span style={{ color: '#fff', fontWeight: 700 }}>{basic + addon + extra} orang</span> yang bertransaksi lewat link kamu, ditambah bonus reach dari <span style={{ color: '#fff', fontWeight: 700 }}>{clicks.toLocaleString()} klik</span>
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#0a0a0a', borderRadius: '12px', border: `1px solid #1f1f1f` }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#0dd30b' }}>Total Komisi Kamu</span>
        <span style={{
          fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800, color: '#fff',
        }}>Rp {total.toLocaleString('id-ID')}</span>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function AffiliatePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    (async () => { const u = await getUser(); if (u) setUser(u); })();
  }, []);

  const refLink = `https://bantuanordal/referral/${Math.random().toString(36).slice(2, 8)}`;

  function copyLink() {
    navigator.clipboard?.writeText(refLink).catch(() => {});
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div style={{
        display: 'flex', maxWidth: '1200px', margin: '0 auto',
        padding: 'clamp(24px, 4vw, 48px) clamp(16px, 4vw, 40px)',
        paddingBottom: '120px', alignItems: 'flex-start',
      }}>
        {/* Sidebar */}
        <div style={{ display: 'none' }} className="affiliate-sidebar">
          <SidebarProfile user={user} router={router} />
        </div>

        {/* Main long-form content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ── Hero ── */}
          <div style={{ marginBottom: 'clamp(28px, 4vw, 48px)' }}>
            <p style={{ fontSize: 'clamp(11px, 1.3vw, 14px)', color: '#737373', marginBottom: '6px' }}>
              khusus untuk alumni Ceritamu sudah bantu kamu mudah cari kerja.
            </p>
            <p style={{ fontSize: 'clamp(10px, 1.1vw, 13px)', color: '#737373', marginBottom: '12px' }}>Sekarang giliran ceritamu yang dibayar.</p>
            <p style={{ fontSize: 'clamp(11px, 1.2vw, 13px)', color: '#737373', marginBottom: '8px' }}>Apa itu</p>
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, lineHeight: 1.1, marginBottom: '16px',
              background: `linear-gradient(156deg, ${RED} 15%, #fff 84%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Affiliate Alumni?</h1>
          </div>

          {/* ── Description paragraphs ── */}
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: 'clamp(16px, 2.5vw, 24px)', marginBottom: '20px' }}>
            <p style={{ fontSize: 'clamp(12px, 1.3vw, 15px)', color: '#b1b1b1', lineHeight: 1.7, marginBottom: '14px' }}>
              <span style={{ color: '#fff', fontWeight: 600 }}>Bagikan ke orang lain yang butuh</span>, dan dapat komisi setiap kali mereka ikut berubah. Cerita kamu ternyata bisa jadi inspirasi buat banyak orang.
            </p>
            <p style={{ fontSize: 'clamp(12px, 1.3vw, 15px)', color: '#737373', lineHeight: 1.7 }}>
              Program Affiliate Alumni dirancang khusus untuk kamu. Karena kamu sudah merasakan langsung manfaatnya, kamu yang paling pas buat bagikan cerita ini ke orang lain — dan kali ini, kamu juga dapat bagian.
            </p>
          </div>

          {/* ── Dua sumber penghasilan ── */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: 'clamp(16px, 2.2vw, 24px)', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
              Dua sumber penghasilan, satu link
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))', gap: '12px' }}>
              {[
                { icon: '💰', title: 'Komisi Transaksi', desc: '"setiap orang yang daftar lewat link kamu, kamu akan dapat komisi dari transaksi mereka." (transaksi apapun kamu dapat 50%)' },
                { icon: '🔗', title: 'Bonus Reach', desc: 'Setiap ada 1000 klik dari link yang kamu share, kamu dapet bonus tambahan Rp.1.000. /1000 klik *berlaku kelipatan' },
              ].map(item => (
                <div key={item.title} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '18px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>{item.icon}</div>
                  <p style={{ fontSize: 'clamp(12px, 1.4vw, 15px)', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{item.title}</p>
                  <p style={{ fontSize: 'clamp(11px, 1.2vw, 13px)', color: '#737373', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Tiga langkah ── */}
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: 'clamp(16px, 2.5vw, 24px)', marginBottom: '20px' }}>
            <h2 style={{ fontSize: 'clamp(15px, 2vw, 20px)', fontWeight: 700, color: '#fff', marginBottom: '20px' }}>Tiga langkah, langsung jalan</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { step: '1', icon: '🔗', title: 'Link Referral', desc: 'Tidak perlu daftar, langsung dapat link unik kamu sendiri. (Gratis)' },
                { step: '2', icon: '📊', title: 'Rate Komisi', desc: 'Share ke yang membutuhkan — teman seangkatan, junior, atau siapapun yang cari kerja. (Bisa juga bagikan ke media sosial yang kamu punya)' },
                { step: '3', icon: '👥', title: 'Lead', desc: 'Nggak perlu jualan keras. Cukup share pengalaman kamu sendiri — orang lebih percaya cerita nyata dibanding iklan.' },
              ].map(item => (
                <div key={item.step} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg, ${RED}, ${RED_DARK})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 800, color: '#fff',
                  }}>{item.step}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 'clamp(13px, 1.5vw, 16px)', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{item.title}</p>
                    <p style={{ fontSize: 'clamp(11px, 1.2vw, 13px)', color: '#737373', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Struktur Komisi ── */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: 'clamp(15px, 2vw, 20px)', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Struktur Komisi</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px, 100%), 1fr))', gap: '12px' }}>
              {[
                { name: 'Paket Biasa', price: 'Rp 50.000', pct: '50%', earn: 'Rp 25.000', sub: 'Akses 4 episode pertama', accent: RED },
                { name: 'Paket Tambahan', price: 'Rp 47.000', pct: '50%', earn: 'Rp 23.500', sub: 'Add-on upgrade', accent: '#b6902d' },
                { name: 'Bonus Tambahan', price: 'Rp 149.000', pct: '50%', earn: 'Rp 74.500', sub: 'Premium full access', accent: '#b6902d' },
              ].map(pkg => (
                <div key={pkg.name} style={{ background: CARD_BG, border: `1px solid ${pkg.accent}55`, borderRadius: '14px', padding: '18px' }}>
                  <p style={{ fontSize: '11px', color: '#737373', marginBottom: '6px' }}>{pkg.sub}</p>
                  <p style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{pkg.name}</p>
                  <p style={{ fontSize: 'clamp(14px, 1.8vw, 18px)', fontWeight: 800, color: '#7a7a7a', textDecoration: 'line-through', marginBottom: '4px' }}>{pkg.price}</p>
                  <p style={{ fontSize: '12px', color: '#737373', marginBottom: '8px' }}>× {pkg.pct}</p>
                  <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: 800, color: '#fff' }}>{pkg.earn}</p>
                  <p style={{ fontSize: '10px', color: '#0dd30b', marginTop: '4px' }}>per transaksi</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Calculator ── */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: 'clamp(15px, 2vw, 20px)', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Atur skenario kamu</h2>
            <Calculator />
          </div>

          {/* ── Referral Link ── */}
          <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: 'clamp(16px, 2.5vw, 24px)', marginBottom: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#737373', letterSpacing: '1px', marginBottom: '12px' }}>LINK REFERRAL KAMU</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px', background: '#0a0a0a', border: `1px solid #1f1f1f`, borderRadius: '10px', padding: '12px 14px', fontFamily: 'monospace', fontSize: '12px', color: '#737373', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {refLink}
              </div>
              <button id="btn-copy-link" onClick={copyLink} style={{
                padding: '12px 20px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
                color: '#fff', fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              }}>Salin Link</button>
            </div>
          </div>

          {/* ── Testimonials ── */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: 'clamp(15px, 2vw, 20px)', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Sudah duluan coba</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '12px' }}>
              {[
                { name: 'Jhon Khresnanda', commission: 'Rp 875.000', quote: '"Awalnya cuma share ke grup angkatan buat bantu temen yang masih nganggur. Eh ternyata kepake juga buat nambah penghasilan."' },
                { name: 'Valencia Calandra', commission: 'Rp 560.000', quote: '"gak nyangka cerita pengalaman sendiri bisa dibayar, Tinggal post story, udah ada yang checkout."' },
              ].map(t => (
                <div key={t.name} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '18px' }}>
                  <p style={{ fontSize: 'clamp(11px, 1.2vw, 13px)', color: '#b1b1b1', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '14px' }}>{t.quote}</p>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '3px' }}>{t.name}</p>
                  <p style={{ fontSize: '11px', color: '#2daa17', fontWeight: 400 }}>Komisi bulan pertama : {t.commission}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQ ── */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: 'clamp(14px, 1.8vw, 18px)', fontWeight: 700, letterSpacing: '2px',
              background: `linear-gradient(156deg, ${RED} 15%, #fff 84%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              marginBottom: '16px',
            }}>FREQUENTLY ASKED QUESTION</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {FAQ.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
            </div>
          </div>

          {/* ── CTA ── */}
          <div style={{
            background: `linear-gradient(135deg, rgba(241,48,30,0.12) 0%, rgba(0,0,0,0) 100%)`,
            border: `1px solid ${RED}44`, borderRadius: '20px',
            padding: 'clamp(24px, 4vw, 48px)', textAlign: 'center',
          }}>
            <h2 style={{ fontSize: 'clamp(16px, 2.5vw, 28px)', fontWeight: 600, color: '#fff', marginBottom: '20px', lineHeight: 1.3 }}>
              Dapatkan penghasilan tambahan sekarang!
            </h2>
            <button id="btn-affiliate-cta" onClick={copyLink} style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: 'clamp(12px, 1.5vw, 16px) clamp(24px, 3vw, 40px)',
              borderRadius: '60px', border: 'none',
              background: `linear-gradient(90deg, ${RED}, ${RED_DARK})`,
              color: '#fff', fontFamily: 'Poppins, sans-serif',
              fontSize: 'clamp(13px, 1.5vw, 16px)', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 0 40px rgba(241,48,30,0.35)',
            }}>
              Salin Link Referral Kamu
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .affiliate-sidebar { display: block !important; }
        }
        input[type=range] { -webkit-appearance: none; border-radius: 4px; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px; height: 16px; border-radius: 50%;
          background: ${RED}; cursor: pointer; border: 2px solid #fff;
        }
        input[type=range]::-webkit-slider-runnable-track {
          height: 4px; border-radius: 4px; background: #2a2a2a;
        }
      `}</style>
    </div>
  );
}
