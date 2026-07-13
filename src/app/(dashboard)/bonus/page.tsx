'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BONUS_TEMPLATES } from '@/lib/mockData';
import ScaledIframeCanvas from '@/app/components/ScaledIframeCanvas';

const CANVAS_WIDTH  = 393;
const CANVAS_HEIGHT = 852;

export default function BonusPage() {
  const router = useRouter();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedId,  setDownloadedId]  = useState<string | null>(null);

  const handleDownload = async (tmpl: typeof BONUS_TEMPLATES[number]) => {
    setDownloadingId(tmpl.id);
    await new Promise(r => setTimeout(r, 1200));
    setDownloadingId(null);
    setDownloadedId(tmpl.id);
    setTimeout(() => setDownloadedId(null), 2500);
  };

  return (
    <>
      <ScaledIframeCanvas
        src="/design/bonus/index.html"
        canvasWidth={CANVAS_WIDTH}
        canvasHeight={CANVAS_HEIGHT}
      >
        {/* Download buttons – one per template card */}
        {BONUS_TEMPLATES.map((tmpl, i) => {
          const cardTop = 200 + i * 170;
          return (
            <button
              key={tmpl.id}
              id={`btn-download-${tmpl.id}`}
              onClick={() => handleDownload(tmpl)}
              disabled={downloadingId === tmpl.id || downloadedId === tmpl.id}
              style={{
                position: 'absolute',
                top: cardTop + 100,
                left: 20,
                width: 353,
                height: 40,
                background: 'transparent',
                border: 'none',
                cursor: downloadingId === tmpl.id || downloadedId === tmpl.id ? 'not-allowed' : 'pointer',
                pointerEvents: 'auto',
              }}
              aria-label={downloadedId === tmpl.id ? 'Berhasil Diunduh' : downloadingId === tmpl.id ? 'Mengunduh...' : `Download ${tmpl.title}`}
            />
          );
        })}

        {/* Nav bar handled by (dashboard)/layout.tsx — no duplicate overlay needed */}
      </ScaledIframeCanvas>

      {/* Toast feedback */}
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
    </>
  );
}
