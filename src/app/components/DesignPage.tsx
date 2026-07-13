'use client';

import React, { useEffect, useRef } from 'react';

interface ClickZone {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  onClick: () => void;
  cursor?: string;
}

interface DesignPageProps {
  /** path to the HTML file in /public/design/, e.g. "/design/home/index.html" */
  src: string;
  /** total pixel height of the design canvas */
  canvasHeight: number;
  /** interactive transparent click zones overlaid on the design */
  clickZones?: ClickZone[];
}

/**
 * Renders a Figma-exported HTML design pixel-perfectly inside the dashboard shell.
 * Interactive elements are handled by transparent React overlay buttons.
 */
export default function DesignPage({ src, canvasHeight, clickZones = [] }: DesignPageProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync the current time into the iframe's clock spans once it loads
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onLoad = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        // Find any element that shows "9:41" and replace with real time
        doc.querySelectorAll('span').forEach(el => {
          if (el.textContent?.trim() === '9:41') {
            el.textContent = timeStr;
          }
        });
      } catch {
        // cross-origin guard — silently ignore
      }
    };
    iframe.addEventListener('load', onLoad);
    return () => iframe.removeEventListener('load', onLoad);
  }, [src]);

  return (
    <div style={{
      position: 'relative',
      width: '393px',
      height: `${canvasHeight}px`,
      overflow: 'hidden',
      margin: '0 auto',
    }}>
      {/* Pixel-perfect design iframe */}
      <iframe
        ref={iframeRef}
        src={src}
        width="393"
        height={canvasHeight}
        scrolling="no"
        style={{
          border: 'none',
          display: 'block',
          pointerEvents: 'none', // clicks pass through to overlay
        }}
        title="page-design"
      />

      {/* Transparent interactive overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '393px',
        height: `${canvasHeight}px`,
        pointerEvents: 'none', // default: pass-through
      }}>
        {clickZones.map(zone => (
          <button
            key={zone.id}
            onClick={zone.onClick}
            style={{
              position: 'absolute',
              top: `${zone.top}px`,
              left: `${zone.left}px`,
              width: `${zone.width}px`,
              height: `${zone.height}px`,
              background: 'transparent',
              border: 'none',
              cursor: zone.cursor || 'pointer',
              pointerEvents: 'auto', // clickable
              zIndex: 10,
            }}
            aria-label={zone.id}
          />
        ))}
      </div>
    </div>
  );
}
