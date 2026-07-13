'use client';

import { useRouter } from 'next/navigation';
import ScaledIframeCanvas from '@/app/components/ScaledIframeCanvas';

const CANVAS_WIDTH  = 393;
const CANVAS_HEIGHT = 914;

const PLAY_BUTTONS = [
  { id: 'ep-preview-1', top: 503, left: 21, width: 163, height: 93 },
  { id: 'ep-preview-2', top: 625, left: 21, width: 163, height: 93 },
  { id: 'ep-preview-3', top: 746, left: 21, width: 163, height: 93 },
];

export default function TrailerPage() {
  const router = useRouter();

  return (
    <ScaledIframeCanvas
      src="/design/trailer/index.html"
      canvasWidth={CANVAS_WIDTH}
      canvasHeight={CANVAS_HEIGHT}
    >
      {/* Close/Back */}
      <button id="btn-close" onClick={() => router.push('/home')}
        style={{ position: 'absolute', top: 75, left: 339, width: 35, height: 35, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
        aria-label="Kembali ke Home" />

      {/* Preview play buttons */}
      {PLAY_BUTTONS.map(btn => (
        <button key={btn.id} id={btn.id}
          onClick={() => router.push('/checkout?upgrade=1')}
          style={{ position: 'absolute', top: btn.top, left: btn.left, width: btn.width, height: btn.height, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label="Konten Premium – Upgrade untuk akses" />
      ))}

      {/* Upgrade CTA */}
      <button id="btn-upgrade" onClick={() => router.push('/checkout?upgrade=1')}
        style={{ position: 'absolute', top: 840, left: 21, width: 352, height: 50, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
        aria-label="Upgrade ke Premium" />
    </ScaledIframeCanvas>
  );
}
