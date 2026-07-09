'use client';

import { useRouter } from 'next/navigation';

// Trailer HTML canvas: 393×914px
const CANVAS_HEIGHT = 914;

// Posisi CTA "Upgrade" button dari Trailer Premium/index.html
// Mencari tombol upgrade di area bawah sekitar top:840-870
const UPGRADE_BTN_TOP = 840;
const UPGRADE_BTN_LEFT = 21;
const UPGRADE_BTN_WIDTH = 352;
const UPGRADE_BTN_HEIGHT = 50;

// Play buttons for each preview episode
const PLAY_BUTTONS = [
  { id: 'ep-preview-1', top: 503, left: 21, width: 163, height: 93 },
  { id: 'ep-preview-2', top: 625, left: 21, width: 163, height: 93 },
  { id: 'ep-preview-3', top: 746, left: 21, width: 163, height: 93 },
];

export default function TrailerPage() {
  const router = useRouter();

  return (
    <div style={{ position: 'relative', width: '393px', margin: '0 auto' }}>
      {/* ── Pixel-perfect HTML design ── */}
      <iframe
        src="/design/trailer/index.html"
        width="393"
        height={CANVAS_HEIGHT}
        scrolling="no"
        style={{ border: 'none', display: 'block', pointerEvents: 'none' }}
        title="trailer-premium-design"
      />

      {/* ── Interactive overlay ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '393px', height: `${CANVAS_HEIGHT}px`,
        pointerEvents: 'none',
      }}>
        {/* Back/Close button (X button top right) */}
        <button id="btn-close"
          onClick={() => router.push('/home')}
          style={{ position: 'absolute', top: 75, left: 339, width: 35, height: 35, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label="Kembali ke Home" />

        {/* Episode play buttons (click through to locked upsell) */}
        {PLAY_BUTTONS.map(btn => (
          <button
            key={btn.id}
            id={btn.id}
            onClick={() => router.push('/checkout?upgrade=1')}
            style={{ position: 'absolute', top: btn.top, left: btn.left, width: btn.width, height: btn.height, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
            aria-label="Konten Premium - Upgrade untuk akses" />
        ))}

        {/* Upgrade CTA button at bottom */}
        <button id="btn-upgrade"
          onClick={() => router.push('/checkout?upgrade=1')}
          style={{
            position: 'absolute',
            top: UPGRADE_BTN_TOP,
            left: UPGRADE_BTN_LEFT,
            width: UPGRADE_BTN_WIDTH,
            height: UPGRADE_BTN_HEIGHT,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
          aria-label="Upgrade ke Premium" />
      </div>
    </div>
  );
}
