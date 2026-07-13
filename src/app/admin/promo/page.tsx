'use client';

import { useState } from 'react';

type Product = {
  id: string;
  name: string;
  normalPrice: number;
  currentPrice: number;
  bump: boolean;
  bumpPrice?: number;
  promoActive: boolean;
  promoLabel: string;
  promoEnd: string;
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'main',
    name: 'Kursus Utama (Ep 1–4)',
    normalPrice: 200000,
    currentPrice: 50000,
    bump: true,
    bumpPrice: 47000,
    promoActive: true,
    promoLabel: 'Harga Spesial — Early Bird',
    promoEnd: '2026-08-01',
  },
  {
    id: 'premium',
    name: 'Episode Premium (Ep 5–9)',
    normalPrice: 349000,
    currentPrice: 149000,
    bump: false,
    promoActive: false,
    promoLabel: '',
    promoEnd: '',
  },
  {
    id: 'bundle',
    name: 'Bundle Lengkap (Ep 1–9)',
    normalPrice: 549000,
    currentPrice: 199000,
    bump: false,
    promoActive: true,
    promoLabel: 'Bundle Hemat',
    promoEnd: '2026-08-15',
  },
];

function formatRp(n: number) { return `Rp ${n.toLocaleString('id-ID')}`; }

export default function AdminPromo() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saved, setSaved] = useState(false);

  const togglePromo = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, promoActive: !p.promoActive } : p));
  };

  const handleSave = () => {
    if (!editing) return;
    setProducts(prev => prev.map(p => p.id === editing.id ? editing : p));
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0 }}>Promo & Harga</h1>
        <p style={{ fontSize: '11px', color: '#555', margin: '4px 0 0' }}>
          Kelola harga dan promo aktif untuk setiap produk
        </p>
      </div>

      {/* Product cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
        {products.map(p => (
          <div key={p.id} style={{
            background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '20px',
          }}>
            {/* Product header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{p.name}</div>
                {p.promoActive && p.promoLabel && (
                  <span style={{
                    display: 'inline-block', background: 'rgba(241,48,30,0.15)', border: '1px solid rgba(241,48,30,0.3)',
                    borderRadius: '6px', padding: '2px 8px', fontSize: '9px', fontWeight: 700, color: '#f1301e',
                  }}>
                    🏷️ {p.promoLabel}
                  </span>
                )}
              </div>
              {/* Promo toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '9px', color: '#555' }}>Promo</span>
                <button
                  onClick={() => togglePromo(p.id)}
                  style={{
                    width: '44px', height: '24px', borderRadius: '12px', border: 'none',
                    background: p.promoActive ? 'linear-gradient(90deg, #f1301e, #9f2315)' : '#1a1a1a',
                    cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: '3px', left: p.promoActive ? '22px' : '3px',
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: '#fff', transition: 'left 0.2s',
                  }} />
                </button>
              </div>
            </div>

            {/* Pricing grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: '#080808', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '9px', color: '#555', marginBottom: '4px' }}>Harga Normal</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#888', textDecoration: 'line-through' }}>
                  {formatRp(p.normalPrice)}
                </div>
              </div>
              <div style={{ background: '#0a0505', border: '1px solid #2a1010', borderRadius: '10px', padding: '12px' }}>
                <div style={{ fontSize: '9px', color: '#f1301e', marginBottom: '4px', fontWeight: 700 }}>Harga Jual Aktif</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#f1301e' }}>
                  {formatRp(p.currentPrice)}
                </div>
              </div>
            </div>

            {p.bump && (
              <div style={{ background: '#080808', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '12px', marginBottom: '14px' }}>
                <div style={{ fontSize: '9px', color: '#555', marginBottom: '4px' }}>Order Bump Price</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#a78bfa' }}>{formatRp(p.bumpPrice ?? 0)}</div>
              </div>
            )}

            {p.promoEnd && (
              <div style={{ fontSize: '10px', color: '#555', marginBottom: '12px' }}>
                ⏰ Promo berakhir: <strong style={{ color: '#fff' }}>{new Date(p.promoEnd).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
              </div>
            )}

            <button onClick={() => setEditing({ ...p })} style={{
              height: '36px', padding: '0 20px', borderRadius: '8px',
              background: 'transparent', border: '1px solid #2a2a2a',
              cursor: 'pointer', fontSize: '11px', color: '#888', fontFamily: 'Poppins, sans-serif', fontWeight: 600,
            }}>
              ✏️ Edit Harga
            </button>
          </div>
        ))}
      </div>

      {/* Promo Schedule table */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
          Jadwal Promo Aktif
        </div>
        {products.filter(p => p.promoActive && p.promoEnd).length === 0 ? (
          <p style={{ fontSize: '11px', color: '#444' }}>Tidak ada promo aktif dengan jadwal.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Produk', 'Label', 'Berakhir', 'Status'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '8px 12px',
                    fontSize: '9px', fontWeight: 700, color: '#444',
                    letterSpacing: '0.5px', borderBottom: '1px solid #1a1a1a',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.filter(p => p.promoActive && p.promoEnd).map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #111' }}>
                  <td style={{ padding: '12px', fontSize: '11px', color: '#ccc' }}>{p.name}</td>
                  <td style={{ padding: '12px', fontSize: '10px', color: '#f1301e' }}>{p.promoLabel}</td>
                  <td style={{ padding: '12px', fontSize: '10px', color: '#aaa' }}>{p.promoEnd}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      display: 'inline-block', background: '#0a2a0a', color: '#4ade80',
                      borderRadius: '6px', padding: '2px 8px', fontSize: '9px', fontWeight: 700,
                    }}>● Aktif</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Toast */}
      {saved && (
        <div style={{
          position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
          background: '#4ade80', color: '#000', borderRadius: '20px', padding: '10px 24px',
          fontSize: '12px', fontWeight: 700, zIndex: 300, fontFamily: 'Poppins, sans-serif',
          boxShadow: '0 4px 20px rgba(74,222,128,0.4)',
        }}>
          ✓ Perubahan disimpan
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }} onClick={() => setEditing(null)}>
          <div style={{
            width: '100%', maxWidth: '480px', background: '#0d0d0d',
            borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
            padding: '24px', border: '1px solid #2a2a2a',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                Edit Harga: {editing.name}
              </h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '18px' }}>✕</button>
            </div>

            {[
              { key: 'normalPrice',  label: 'Harga Normal (Rp)',     type: 'number' },
              { key: 'currentPrice', label: 'Harga Jual Aktif (Rp)', type: 'number' },
              { key: 'promoLabel',   label: 'Label Promo',           type: 'text' },
              { key: 'promoEnd',     label: 'Berakhir (YYYY-MM-DD)', type: 'date' },
            ].map(({ key, label, type }) => (
              <div key={key} style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#888', marginBottom: '6px', fontFamily: 'Poppins, sans-serif' }}>
                  {label}
                </label>
                <input
                  type={type}
                  value={String((editing as Record<string, string | number | boolean>)[key] ?? '')}
                  onChange={e => setEditing(prev => prev ? { ...prev, [key]: type === 'number' ? parseInt(e.target.value) || 0 : e.target.value } : prev)}
                  style={{
                    width: '100%', height: '40px', borderRadius: '10px',
                    border: '1px solid #2a2a2a', background: '#080808',
                    color: '#fff', fontSize: '12px', padding: '0 12px',
                    outline: 'none', boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif',
                  }}
                />
              </div>
            ))}

            <button onClick={handleSave} style={{
              width: '100%', height: '46px', borderRadius: '12px',
              background: 'linear-gradient(90deg, #f1301e, #9f2315)', border: 'none',
              cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 700, color: '#fff',
            }}>
              💾 Simpan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
