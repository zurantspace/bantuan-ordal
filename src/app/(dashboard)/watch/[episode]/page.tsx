'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EPISODES } from '@/lib/mockData';
import { setEpisodeProgress } from '@/lib/auth';
import ScaledIframeCanvas from '@/app/components/ScaledIframeCanvas';

const CANVAS_WIDTH  = 393;
const CANVAS_HEIGHT = 852;

export default function WatchPage() {
  const router = useRouter();
  const params = useParams();
  const episodeNum = parseInt(params.episode as string, 10) || 1;
  const episode = EPISODES.find(e => e.number === episodeNum) || EPISODES[0];
  const isPremium = episode.tier === 'premium';
  const [progress, setProgress] = useState(episode.progress || 0);

  useEffect(() => {
    if (isPremium) {
      router.replace('/trailer');
      return;
    }
    const timer = setInterval(() => {
      setProgress(p => {
        const next = Math.min(p + 1, 100);
        setEpisodeProgress(episode.id, next);
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [episode.id, isPremium, router]);

  const prevEp = EPISODES.find(e => e.number === episodeNum - 1 && e.tier === 'standard');
  const nextEp = EPISODES.find(e => e.number === episodeNum + 1);

  return (
    <ScaledIframeCanvas
      src="/design/watch/index.html"
      canvasWidth={CANVAS_WIDTH}
      canvasHeight={CANVAS_HEIGHT}
    >
      {/* Back button */}
      <button id="btn-back" onClick={() => router.back()}
        style={{ position: 'absolute', top: 75, left: 316, width: 35, height: 35, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
        aria-label="Tutup" />

      {/* Video player area */}
      {episode.videoUrl ? (
        <div style={{ position: 'absolute', top: 110, left: 0, width: CANVAS_WIDTH, height: 221, pointerEvents: 'auto', overflow: 'hidden' }}>
          <iframe src={episode.videoUrl} width={CANVAS_WIDTH} height="221"
            style={{ border: 'none', display: 'block' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen />
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 110, left: 0, width: CANVAS_WIDTH, height: 221, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}>
          <span style={{ fontSize: '48px', opacity: 0.5 }}>▶</span>
        </div>
      )}

      {/* Progress bar */}
      <div style={{ position: 'absolute', top: 320, left: 23, width: 352, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: '2px', pointerEvents: 'none' }}>
        <div style={{ width: `${progress}%`, height: '4px', background: 'linear-gradient(90deg, #f1301e, #9f2315)', borderRadius: '2px', transition: 'width 1s linear' }} />
      </div>

      {/* Prev episode */}
      {prevEp && (
        <button id="btn-prev" onClick={() => router.push(`/watch/${prevEp.number}`)}
          style={{ position: 'absolute', top: 635, left: 23, width: 163, height: 93, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label={`Episode ${prevEp.number}`} />
      )}

      {/* Next episode */}
      {nextEp && (
        <button id="btn-next"
          onClick={() => nextEp.tier === 'premium' ? router.push('/trailer') : router.push(`/watch/${nextEp.number}`)}
          style={{ position: 'absolute', top: 635, left: 188, width: 163, height: 93, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label={nextEp.tier === 'premium' ? `Episode Premium ${nextEp.number}` : `Episode ${nextEp.number}`} />
      )}

      {/* Nav bar handled by (dashboard)/layout.tsx — no duplicate overlay needed */}
    </ScaledIframeCanvas>
  );
}
