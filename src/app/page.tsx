"use client";

// Landing page served via iframe from the pixel-perfect original HTML.
// The HTML file is at /public/landing-original.html and handles:
//   - All visual design exactly matching Figma
//   - CTA button click handlers (navigate parent to /checkout)
//   - Login button (navigate parent to /login)
//   - Status bar hidden via built-in patch script

export default function Home() {
  const PAGE_HEIGHT = 7040; // matches the original design canvas height

  return (
    <div
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <iframe
        src="/landing-original.html"
        title="Landing Page"
        scrolling="no"
        style={{
          width: "100%",
          height: PAGE_HEIGHT + "px",
          border: "none",
          display: "block",
          backgroundColor: "#000",
          flexShrink: 0,
        }}
      />
    </div>
  );
}
