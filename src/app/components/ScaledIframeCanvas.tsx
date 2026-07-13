'use client';

import { useEffect, useRef } from 'react';

interface ScaledIframeCanvasProps {
  /** Path ke file HTML design, e.g. "/design/home/index.html" */
  src: string;
  /** Lebar canvas asli dari design (default 393) */
  canvasWidth?: number;
  /** Tinggi canvas asli dari design */
  canvasHeight: number;
  /** Elemen interaktif yang diletakkan di atas iframe (sudah di-scale secara otomatis) */
  children?: React.ReactNode;
  /** Tambahan style untuk outer shell */
  className?: string;
}

/**
 * ScaledIframeCanvas
 *
 * Menampilkan sebuah iframe design (393px wide) yang di-scale secara proporsional
 * agar mengisi lebar kontainer saat ini. Di mobile tetap 393px. Di desktop,
 * scale naik proporsional.
 *
 * Elemen `children` juga ikut di-scale via CSS transform — koordinat anak tetap
 * dalam "canvas space" (393px), sehingga overlay hotspot tidak perlu diubah.
 */
export default function ScaledIframeCanvas({
  src,
  canvasWidth = 393,
  canvasHeight,
  children,
  className,
}: ScaledIframeCanvasProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const applyScale = () => {
      const shell = shellRef.current;
      const inner = innerRef.current;
      if (!shell || !inner) return;

      // Lebar efektif = lebar container (bisa lebih dari 393px di desktop)
      const containerWidth = shell.parentElement?.clientWidth ?? window.innerWidth;
      const scale = containerWidth / canvasWidth;
      const scaledHeight = canvasHeight * scale;

      inner.style.transform = `scale(${scale})`;
      inner.style.transformOrigin = 'top left';
      inner.style.width = `${canvasWidth}px`;
      inner.style.position = 'absolute';
      inner.style.top = '0';
      inner.style.left = '0';

      shell.style.width = '100%';
      shell.style.height = `${scaledHeight}px`;
      shell.style.position = 'relative';
      shell.style.overflow = 'hidden';
    };

    applyScale();

    const ro = new ResizeObserver(applyScale);
    if (shellRef.current?.parentElement) {
      ro.observe(shellRef.current.parentElement);
    }
    window.addEventListener('resize', applyScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', applyScale);
    };
  }, [canvasWidth, canvasHeight]);

  return (
    <div
      ref={shellRef}
      className={className}
      style={{ background: '#000', display: 'block', width: '100%' }}
    >
      <div ref={innerRef} style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* iframe design – pointer events disabled; interactive layer on top */}
        <iframe
          src={src}
          width={canvasWidth}
          height={canvasHeight}
          scrolling="no"
          style={{
            border: 'none',
            display: 'block',
            pointerEvents: 'none',
          }}
          title={src}
        />
        {/* Overlay: children inherit the same 393px coordinate space */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            pointerEvents: 'none',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
