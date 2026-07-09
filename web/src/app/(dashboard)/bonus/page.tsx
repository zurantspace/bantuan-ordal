'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BONUS_TEMPLATES } from '@/lib/mockData';

// Bonus HTML canvas: 393×852px
const CANVAS_HEIGHT = 852;

export default function BonusPage() {
  const router = useRouter();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const handleDownload = async (tmpl: typeof BONUS_TEMPLATES[number]) => {
    setDownloadingId(tmpl.id);
    await new Promise(r => setTimeout(r, 1200));
    setDownloadingId(null);
    setDownloadedId(tmpl.id);
    setTimeout(() => setDownloadedId(null), 2500);
  };

  return (
    <div style={{ position: 'relative', width: '393px', margin: '0 auto' }}>
      {/* ── Pixel-perfect HTML design ── */}
      <iframe
        src="/design/bonus/index.html"
        width="393"
        height={CANVAS_HEIGHT}
        scrolling="no"
        style={{ border: 'none', display: 'block', pointerEvents: 'none' }}
        title="bonus-design"
      />

      {/* ── Interactive overlay ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '393px', height: `${CANVAS_HEIGHT}px`,
        pointerEvents: 'none',
      }}>
        {/* Download Template buttons - positioned at each template card */}
        {BONUS_TEMPLATES.map((tmpl, i) => {
          const isDownloading = downloadingId === tmpl.id;
          const isDownloaded = downloadedId === tmpl.id;
          // Template cards in Bonus HTML are stacked vertically starting around top:200
          // Each card is approximately 150px tall with gaps
          const cardTop = 200 + i * 170;
          return (
            <button
              key={tmpl.id}
              id={`btn-download-${tmpl.id}`}
              onClick={() => handleDownload(tmpl)}
              disabled={isDownloading || isDownloaded}
              style={{
                position: 'absolute',
                top: cardTop + 100, // bottom area of each card (download button position)
                left: 20,
                width: 353,
                height: 40,
                background: 'transparent',
                border: 'none',
                cursor: isDownloading || isDownloaded ? 'not-allowed' : 'pointer',
                pointerEvents: 'auto',
              }}
              aria-label={isDownloaded ? 'Berhasil Diunduh' : isDownloading ? 'Mengunduh...' : `Download ${tmpl.title}`}
            />
          );
        })}

        {/* Nav – Home */}
        <button id="nav-home" onClick={() => router.push('/home')}
          style={{ position: 'absolute', top: 792, left: 39, width: 64, height: 59, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }} />
        <button id="nav-kelas" onClick={() => router.push('/watch/1')}
          style={{ position: 'absolute', top: 792, left: 103, width: 64, height: 59, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }} />
        <button id="nav-affiliate" onClick={() => router.push('/affiliate')}
          style={{ position: 'absolute', top: 792, left: 167, width: 64, height: 59, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }} />
        <button id="nav-profile" onClick={() => router.push('/settings')}
          style={{ position: 'absolute', top: 792, left: 231, width: 64, height: 59, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }} />
      </div>

      {/* Download feedback toast */}
      {(downloadingId || downloadedId) && (
        <div style={{
          position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
          background: downloadedId ? '#4ade80' : '#f1301e',
          color: downloadedId ? '#000' : '#fff',
          fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: 700,
          padding: '10px 20px', borderRadius: '20px', zIndex: 300, pointerEvents: 'none',
        }}>
          {downloadedId ? '✓ Template Berhasil Diunduh!' : '⏳ Mengunduh template...'}
        </div>
      )}
    </div>
  );
}
