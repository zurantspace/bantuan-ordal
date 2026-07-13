'use client';

import { useState } from 'react';

type Tab = 'pricing' | 'templates' | 'integrations' | 'account';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'pricing',      label: 'Harga & Produk',    icon: '🏷️' },
  { key: 'templates',    label: 'Template Pesan',    icon: '📝' },
  { key: 'integrations', label: 'Integrasi',         icon: '🔌' },
  { key: 'account',      label: 'Akun Admin',        icon: '👤' },
];

const INIT_PRICING = {
  main: '50000', bump: '47000', premium: '149000', bundle: '199000',
};

const INIT_TEMPLATES = {
  welcomeEmail: `Halo {{nama}}! 🎉

Selamat bergabung di Bantuan Ordal!

Login ke member area:
👉 https://bantuanordal.com/login

Email: {{email}}
Password: {{password}}

Selamat belajar!`,
  abandonedWA: `Halo {{nama}}! 👋

Kami lihat kamu sempat mampir ke kelas Bantuan Ordal tadi.

Ada pertanyaan? Atau butuh diskon khusus? 😊

Cek: https://bantuanordal.com/?ref=reminder`,
  commissionEmail: `Halo {{nama}}!

Kabar baik — kamu baru saja mendapatkan komisi!

💰 Komisi: Rp {{amount}}
📊 Total saldo: Rp {{balance}}

Cek dashboard affiliate: https://bantuanordal.com/affiliate`,
};

const INIT_INTEGRATIONS = {
  paymentGateway: 'Midtrans',
  midtransKey: 'SB-Mid-client-xxxxxxxxxxxx',
  emailProvider: 'Brevo (SendinBlue)',
  emailApiKey: 'xkeysib-xxxxxxxxxx',
  waProvider: 'Wablas',
  waToken: 'xxxxxxxxxxxxxxxx',
  pixelId: '123456789012345',
  gtmId: 'GTM-XXXXXXX',
};

const INIT_ACCOUNT = {
  adminName: 'Administrator',
  adminEmail: 'admin@bantuanordal.com',
  currentPassword: '',
  newPassword: '',
};

export default function AdminSettings() {
  const [tab, setTab] = useState<Tab>('pricing');
  const [pricing, setPricing] = useState(INIT_PRICING);
  const [templates, setTemplates] = useState(INIT_TEMPLATES);
  const [integrations, setIntegrations] = useState(INIT_INTEGRATIONS);
  const [account, setAccount] = useState(INIT_ACCOUNT);
  const [saved, setSaved] = useState(false);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleReveal = (key: string) => {
    setRevealed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const maskKey = (key: string, field: string) =>
    revealed[field] ? key : key.replace(/(?<=.{6}).(?=.{4})/g, '*');

  const InputStyle: React.CSSProperties = {
    width: '100%', height: '44px', borderRadius: '10px',
    border: '1px solid #2a2a2a', background: '#080808',
    color: '#fff', fontSize: '12px', padding: '0 14px',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Poppins, sans-serif',
  };

  const TextareaStyle: React.CSSProperties = {
    width: '100%', borderRadius: '10px',
    border: '1px solid #2a2a2a', background: '#080808',
    color: '#aaa', fontSize: '11px', padding: '12px 14px',
    outline: 'none', boxSizing: 'border-box', resize: 'vertical',
    fontFamily: 'Courier New, monospace', lineHeight: '1.6',
  };

  const LabelStyle: React.CSSProperties = {
    display: 'block', fontSize: '10px', fontWeight: 700,
    color: '#888', marginBottom: '6px', fontFamily: 'Poppins, sans-serif',
  };

  const SectionCard = ({ children }: { children: React.ReactNode }) => (
    <div style={{
      background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '16px',
      padding: '24px', marginBottom: '16px',
    }}>
      {children}
    </div>
  );

  return (
    <div style={{ padding: '24px', fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0 }}>Pengaturan</h1>
        <p style={{ fontSize: '11px', color: '#555', margin: '4px 0 0' }}>Konfigurasi platform Bantuan Ordal</p>
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            height: '38px', padding: '0 16px', borderRadius: '10px',
            background: tab === t.key ? 'linear-gradient(90deg, #f1301e, #9f2315)' : '#0d0d0d',
            border: tab === t.key ? 'none' : '1px solid #2a2a2a',
            cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '11px',
            fontWeight: 700, color: tab === t.key ? '#fff' : '#555', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* ── Pricing Tab ── */}
      {tab === 'pricing' && (
        <SectionCard>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>Konfigurasi Harga</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {[
              { key: 'main',    label: 'Harga Kursus Utama (Rp)' },
              { key: 'bump',    label: 'Harga Order Bump (Rp)' },
              { key: 'premium', label: 'Harga Episode Premium (Rp)' },
              { key: 'bundle',  label: 'Harga Bundle Lengkap (Rp)' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label style={LabelStyle}>{label}</label>
                <input
                  type="number"
                  value={pricing[key as keyof typeof pricing]}
                  onChange={e => setPricing(p => ({ ...p, [key]: e.target.value }))}
                  style={InputStyle}
                />
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ── Templates Tab ── */}
      {tab === 'templates' && (
        <>
          {[
            { key: 'welcomeEmail', label: '📧 Email Selamat Datang', note: 'Variabel: {{nama}}, {{email}}, {{password}}' },
            { key: 'abandonedWA',  label: '💬 WA Abandoned Checkout', note: 'Variabel: {{nama}}' },
            { key: 'commissionEmail', label: '📧 Email Notifikasi Komisi', note: 'Variabel: {{nama}}, {{amount}}, {{balance}}' },
          ].map(({ key, label, note }) => (
            <SectionCard key={key}>
              <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>{label}</h2>
              <p style={{ fontSize: '9px', color: '#555', margin: '0 0 12px' }}>{note}</p>
              <textarea
                rows={8}
                value={templates[key as keyof typeof templates]}
                onChange={e => setTemplates(p => ({ ...p, [key]: e.target.value }))}
                style={TextareaStyle}
              />
            </SectionCard>
          ))}
        </>
      )}

      {/* ── Integrations Tab ── */}
      {tab === 'integrations' && (
        <>
          <SectionCard>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>💳 Payment Gateway</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={LabelStyle}>Provider</label>
                <input type="text" value={integrations.paymentGateway} readOnly style={{ ...InputStyle, color: '#555' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <label style={LabelStyle}>Midtrans Client Key</label>
                <input
                  type="text"
                  value={maskKey(integrations.midtransKey, 'midtrans')}
                  onChange={e => setIntegrations(p => ({ ...p, midtransKey: e.target.value }))}
                  style={InputStyle}
                />
                <button
                  onClick={() => toggleReveal('midtrans')}
                  style={{
                    position: 'absolute', right: '10px', top: '28px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#555', fontSize: '12px',
                  }}
                >{revealed.midtrans ? '🙈' : '👁'}</button>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>📧 Email Provider</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={LabelStyle}>Provider</label>
                <input type="text" value={integrations.emailProvider} readOnly style={{ ...InputStyle, color: '#555' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <label style={LabelStyle}>API Key</label>
                <input
                  type="text"
                  value={maskKey(integrations.emailApiKey, 'email')}
                  onChange={e => setIntegrations(p => ({ ...p, emailApiKey: e.target.value }))}
                  style={InputStyle}
                />
                <button onClick={() => toggleReveal('email')} style={{ position: 'absolute', right: '10px', top: '28px', background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '12px' }}>
                  {revealed.email ? '🙈' : '👁'}
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>💬 WhatsApp API</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={LabelStyle}>Provider</label>
                <input type="text" value={integrations.waProvider} readOnly style={{ ...InputStyle, color: '#555' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <label style={LabelStyle}>Token</label>
                <input
                  type="text"
                  value={maskKey(integrations.waToken, 'wa')}
                  onChange={e => setIntegrations(p => ({ ...p, waToken: e.target.value }))}
                  style={InputStyle}
                />
                <button onClick={() => toggleReveal('wa')} style={{ position: 'absolute', right: '10px', top: '28px', background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '12px' }}>
                  {revealed.wa ? '🙈' : '👁'}
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>📊 Tracking</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={LabelStyle}>Meta Pixel ID</label>
                <input type="text" value={integrations.pixelId} onChange={e => setIntegrations(p => ({ ...p, pixelId: e.target.value }))} style={InputStyle} />
              </div>
              <div>
                <label style={LabelStyle}>GTM Container ID</label>
                <input type="text" value={integrations.gtmId} onChange={e => setIntegrations(p => ({ ...p, gtmId: e.target.value }))} style={InputStyle} />
              </div>
            </div>
          </SectionCard>
        </>
      )}

      {/* ── Account Tab ── */}
      {tab === 'account' && (
        <>
          <SectionCard>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>Profil Admin</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={LabelStyle}>Nama Admin</label>
                <input type="text" value={account.adminName} onChange={e => setAccount(p => ({ ...p, adminName: e.target.value }))} style={InputStyle} />
              </div>
              <div>
                <label style={LabelStyle}>Email Admin</label>
                <input type="email" value={account.adminEmail} onChange={e => setAccount(p => ({ ...p, adminEmail: e.target.value }))} style={InputStyle} />
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>Ganti Password</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={LabelStyle}>Password Saat Ini</label>
                <input type="password" value={account.currentPassword} onChange={e => setAccount(p => ({ ...p, currentPassword: e.target.value }))} placeholder="••••••••" style={InputStyle} />
              </div>
              <div>
                <label style={LabelStyle}>Password Baru</label>
                <input type="password" value={account.newPassword} onChange={e => setAccount(p => ({ ...p, newPassword: e.target.value }))} placeholder="Min. 8 karakter" style={InputStyle} />
              </div>
            </div>
          </SectionCard>
        </>
      )}

      {/* Save button */}
      <button onClick={save} style={{
        height: '48px', padding: '0 32px', borderRadius: '12px',
        background: 'linear-gradient(90deg, #f1301e, #9f2315)', border: 'none',
        cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 700, color: '#fff',
        boxShadow: '0 0 20px rgba(241,48,30,0.3)',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        💾 Simpan Perubahan
      </button>

      {/* Toast */}
      {saved && (
        <div style={{
          position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
          background: '#4ade80', color: '#000', borderRadius: '20px', padding: '10px 28px',
          fontSize: '12px', fontWeight: 700, zIndex: 300, fontFamily: 'Poppins, sans-serif',
          boxShadow: '0 4px 20px rgba(74,222,128,0.4)',
        }}>
          ✓ Pengaturan disimpan!
        </div>
      )}
    </div>
  );
}
