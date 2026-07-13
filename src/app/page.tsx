// @ts-nocheck
"use client";

import { useEffect, useRef } from "react";

const PAGE_CANVAS_WIDTH = 393;
const PAGE_CANVAS_HEIGHT = 7036;

export default function LandingPage() {
  const shellRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const applyScale = () => {
      if (!shellRef.current || !containerRef.current) return;
      const vw = window.innerWidth;
      // Scale to EXACTLY fill the viewport width — no cap, no centering
      const scale = vw / PAGE_CANVAS_WIDTH;
      const scaledHeight = PAGE_CANVAS_HEIGHT * scale;

      containerRef.current.style.transform = `scale(${scale})`;
      containerRef.current.style.transformOrigin = "top left";
      containerRef.current.style.width = `${PAGE_CANVAS_WIDTH}px`;
      containerRef.current.style.position = "absolute";
      containerRef.current.style.top = "0";
      containerRef.current.style.left = "0";

      shellRef.current.style.width = `${vw}px`;
      shellRef.current.style.height = `${scaledHeight}px`;
      shellRef.current.style.position = "relative";
      shellRef.current.style.overflow = "hidden";
    };

    applyScale();
    window.addEventListener("resize", applyScale);
    return () => window.removeEventListener("resize", applyScale);
  }, []);

  return (
    <div
      ref={shellRef}
      style={{ background: "#000", display: "block" }}
    >
      <div
        ref={containerRef}
        style={{
          backgroundColor: "#000",
          overflow: "visible",
          minHeight: `${PAGE_CANVAS_HEIGHT}px`,
          position: "absolute",
          top: 0,
          left: 0,
          width: `${PAGE_CANVAS_WIDTH}px`,
        }}
      >
        {/* ── The ORIGINAL design rendered via iframe to preserve pixel-perfect layout ── */}
        <iframe
          src="/landing-original.html"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${PAGE_CANVAS_WIDTH}px`,
            height: `${PAGE_CANVAS_HEIGHT}px`,
            border: "none",
            overflow: "hidden",
            pointerEvents: "auto",
          }}
          scrolling="no"
          title="Landing Page"
        />
        {/* ── Interactive overlays on top of the iframe ── */}
        <LandingInteractive />
      </div>
    </div>
  );
}

// Interactive elements layered on top of the iframe design
function LandingInteractive() {
  return (
    <>
      {/* CTA buttons - positioned to match the original design hotspots */}
      <a
        href="/checkout"
        style={{
          display: "block",
          position: "absolute",
          left: "66px",
          top: "585px",
          width: "259px",
          height: "50px",
          cursor: "pointer",
          zIndex: 10,
          borderRadius: "10px",
        }}
        aria-label="Daftar Sekarang"
      />
      <a
        href="/checkout"
        style={{
          display: "block",
          position: "absolute",
          left: "66px",
          top: "4988px",
          width: "259px",
          height: "50px",
          cursor: "pointer",
          zIndex: 10,
          borderRadius: "10px",
        }}
        aria-label="Daftar Sekarang"
      />
      <a
        href="/checkout"
        style={{
          display: "block",
          position: "absolute",
          left: "66px",
          top: "6380px",
          width: "259px",
          height: "50px",
          cursor: "pointer",
          zIndex: 10,
          borderRadius: "10px",
        }}
        aria-label="Daftar Sekarang"
      />
      <a
        href="/checkout"
        style={{
          display: "block",
          position: "absolute",
          left: "66px",
          top: "3081px",
          width: "259px",
          height: "50px",
          cursor: "pointer",
          zIndex: 10,
          borderRadius: "10px",
        }}
        aria-label="Daftar Sekarang"
      />
      {/* Login link */}
      <a
        href="/login"
        style={{
          display: "block",
          position: "absolute",
          left: "286px",
          top: "68px",
          width: "90px",
          height: "30px",
          cursor: "pointer",
          zIndex: 10,
        }}
        aria-label="Login"
      />
    </>
  );
}
