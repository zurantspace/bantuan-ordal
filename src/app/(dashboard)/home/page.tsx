'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { EPISODES } from '@/lib/mockData';
import type { AuthUser } from '@/lib/auth';
import ScaledIframeCanvas from '@/app/components/ScaledIframeCanvas';

const CARD_TOPS_STD = [492, 655, 818];
const CARD_TOPS_PRM = [1046, 1205, 1368];
const CANVAS_WIDTH = 393;
const CANVAS_HEIGHT = 1688;

export default function HomeDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<'standard' | 'premium'>('standard');

  useEffect(() => {
    setUser(getUser());
  }, []);

  const standardEps = EPISODES.filter(e => e.tier === 'standard');
  const premiumEps  = EPISODES.filter(e => e.tier === 'premium');
  const continueEp  = EPISODES.find(e => !e.completed && e.tier === 'standard') || EPISODES[2];
  const isPremiumLocked = user?.tier === 'standard';

  return (
    <ScaledIframeCanvas
      src="/design/home/index.html"
      canvasWidth={CANVAS_WIDTH}
      canvasHeight={CANVAS_HEIGHT}
    >
      {/* Lanjutkan Menonton */}
      <button id="btn-continue-watch" onClick={() => router.push(`/watch/${continueEp.number}`)}
        style={{ position: 'absolute', top: 362, left: 39, width: 148, height: 28, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
        aria-label="Lanjutkan Menonton" />

      {/* Tab Standar */}
      <button id="btn-tab-std" onClick={() => setActiveTab('standard')}
        style={{ position: 'absolute', top: 444, left: 20, width: 176, height: 26, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
        aria-label="Tab Standar" />

      {/* Tab Premium */}
      <button id="btn-tab-prm" onClick={() => setActiveTab('premium')}
        style={{ position: 'absolute', top: 998, left: 196, width: 176, height: 26, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
        aria-label="Tab Premium" />

      {/* Standard episode cards */}
      {standardEps.map((ep, i) => (
        <button key={`std-${ep.id}`} id={`btn-ep-std-${ep.number}`}
          onClick={() => router.push(`/watch/${ep.number}`)}
          style={{ position: 'absolute', top: CARD_TOPS_STD[i] ?? CARD_TOPS_STD[0], left: 21, width: 352, height: 144, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label={`Episode ${ep.number}: ${ep.title}`} />
      ))}

      {/* Premium episode cards */}
      {premiumEps.map((ep, i) => (
        <button key={`prm-${ep.id}`} id={`btn-ep-prm-${ep.number}`}
          onClick={() => isPremiumLocked ? router.push('/trailer') : router.push(`/watch/${ep.number}`)}
          style={{ position: 'absolute', top: CARD_TOPS_PRM[i] ?? CARD_TOPS_PRM[0], left: 21, width: 352, height: 144, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label={`Premium Episode ${ep.number}: ${ep.title}`} />
      ))}

      {/* Nav bar */}
      <button id="nav-home"    onClick={() => router.push('/home')}      style={{ position: 'absolute', top: 1600, left: 39,  width: 64, height: 59, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }} />
      <button id="nav-kelas"   onClick={() => router.push('/watch/1')}   style={{ position: 'absolute', top: 1600, left: 103, width: 64, height: 59, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }} />
      <button id="nav-bonus"   onClick={() => router.push('/bonus')}     style={{ position: 'absolute', top: 1600, left: 167, width: 64, height: 59, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }} />
      <button id="nav-profile" onClick={() => router.push('/settings')}  style={{ position: 'absolute', top: 1600, left: 231, width: 64, height: 59, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }} />
    </ScaledIframeCanvas>
  );
}
