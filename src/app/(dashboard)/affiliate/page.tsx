'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ScaledIframeCanvas from '@/app/components/ScaledIframeCanvas';

const CANVAS_WIDTH  = 393;
const CANVAS_HEIGHT = 3220;

export default function AffiliatePage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const affiliateLink = 'https://bantuanordal/referral/456678';

  const copyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(affiliateLink);
      } else {
        const ta = document.createElement('textarea');
        ta.value = affiliateLink;
        ta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Salin link:', affiliateLink);
    }
  };

  const shareWA = () => {
    const msg = encodeURIComponent(`Aku lagi belajar strategi cari kerja dari Bantuan Ordal! Kelas ini beneran bagus, coba deh: ${affiliateLink}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <>
      <ScaledIframeCanvas
        src="/design/affiliate/index.html"
        canvasWidth={CANVAS_WIDTH}
        canvasHeight={CANVAS_HEIGHT}
      >
        {/* Copy referral link */}
        <button id="btn-copy-link" onClick={copyLink}
          style={{ position: 'absolute', top: 2093, left: 18, width: 354, height: 34, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label={copied ? 'Tersalin!' : 'Salin Link'} />

        {/* Share WA */}
        <button id="btn-share-wa" onClick={shareWA}
          style={{ position: 'absolute', top: 2141, left: 343, width: 29, height: 29, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label="Share WhatsApp" />

        {/* Cairkan Dana CTA */}
        <button id="btn-cta" onClick={() => router.push('/wallet')}
          style={{ position: 'absolute', top: 2362, left: 43, width: 306, height: 45, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label="Cairkan Dana" />

        {/* Profile sub-nav */}
        <button id="nav-wallet"  onClick={() => router.push('/wallet')}    style={{ position: 'absolute', top: 434, left: 118, width: 80, height: 30, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }} aria-label="Wallet Tab" />
        <button id="nav-watch"   onClick={() => router.push('/watch/1')}   style={{ position: 'absolute', top: 434, left: 20,  width: 80, height: 30, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }} aria-label="Watch Tab" />
        <button id="nav-setting" onClick={() => router.push('/settings')}  style={{ position: 'absolute', top: 434, left: 315, width: 80, height: 30, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }} aria-label="Settings Tab" />
      </ScaledIframeCanvas>

      {/* Copied toast */}
      {copied && (
        <div style={{
          position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
          background: '#4ade80', color: '#000', fontFamily: 'Poppins, sans-serif',
          fontSize: '13px', fontWeight: 700, padding: '10px 20px', borderRadius: '20px',
          zIndex: 300, pointerEvents: 'none',
        }}>
          ✓ Link Tersalin!
        </div>
      )}
    </>
  );
}
