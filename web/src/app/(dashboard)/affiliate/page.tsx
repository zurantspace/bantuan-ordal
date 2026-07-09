'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AFFILIATE_STATS, AFFILIATE_TRANSACTIONS } from '@/lib/mockData';

// Affiliate HTML canvas: 393×3220px
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
    <div style={{ position: 'relative', width: '393px', margin: '0 auto' }}>
      {/* ── Pixel-perfect HTML design ── */}
      <iframe
        src="/design/affiliate/index.html"
        width="393"
        height={CANVAS_HEIGHT}
        scrolling="no"
        style={{ border: 'none', display: 'block', pointerEvents: 'none' }}
        title="affiliate-design"
      />

      {/* ── Interactive overlay ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '393px', height: `${CANVAS_HEIGHT}px`,
        pointerEvents: 'none',
      }}>
        {/* Copy referral link area (top of link box) */}
        <button id="btn-copy-link"
          onClick={copyLink}
          style={{ position: 'absolute', top: 2093, left: 18, width: 354, height: 34, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label={copied ? 'Tersalin!' : 'Salin Link'} />

        {/* Share social buttons (bottom: X/Twitter, FB, Instagram, WA icons at top: 2141) */}
        <button id="btn-share-wa"
          onClick={shareWA}
          style={{ position: 'absolute', top: 2141, left: 343, width: 29, height: 29, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label="Share WhatsApp" />

        {/* "Dapatkan penghasilan" CTA button */}
        <button id="btn-cta"
          onClick={() => router.push('/wallet')}
          style={{ position: 'absolute', top: 2362, left: 43, width: 306, height: 45, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label="Cairkan Dana" />

        {/* Wallet tab in the profile header nav */}
        <button id="nav-wallet"
          onClick={() => router.push('/wallet')}
          style={{ position: 'absolute', top: 434, left: 118, width: 80, height: 30, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label="Wallet Tab" />

        {/* Watch tab */}
        <button id="nav-watch"
          onClick={() => router.push('/watch/1')}
          style={{ position: 'absolute', top: 434, left: 20, width: 80, height: 30, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label="Watch Tab" />

        {/* Setting tab */}
        <button id="nav-setting"
          onClick={() => router.push('/settings')}
          style={{ position: 'absolute', top: 434, left: 315, width: 80, height: 30, background: 'transparent', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}
          aria-label="Settings Tab" />
      </div>

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
    </div>
  );
}
