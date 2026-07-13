// @ts-nocheck
"use client";

import { FAQOverlay, VideoPlayerOverlay, TestimonialSlider } from "./components/InteractiveOverlays";

/**
 * MobileCanvas – the original 393px absolute-positioned landing page design.
 * This is rendered inside MobileLanding which handles CSS transform scaling.
 * Do NOT add any outer wrapper here — parent provides the scaled container.
 */
export default function MobileOriginalCanvas() {
  return (
    <>
      {/* ===== ORIGINAL STATIC BACKGROUND ELEMENTS ===== */}
      {/* Hero background image */}
      <div style={{"overflow":"hidden","left":"15px","top":"5047px","aspectRatio":"1.25","width":"auto","height":"292px","position":"absolute","filter":"drop-shadow(0px 0px 40px rgba(255,0,0,0.25))"}}>
        <img src="/images/4b5bc5bedc4e84f230af5162471599703d678d9a.png" alt="" style={{"inset":"0","width":"100%","height":"100%","position":"absolute","objectFit":"cover"}} />
      </div>
      <div style={{"overflow":"hidden","left":"85px","top":"5375px","width":"231px","height":"283px","position":"absolute"}}>
        <div style={{"overflow":"hidden","left":"0px","top":"0px","aspectRatio":"0.8","width":"auto","height":"288px","position":"absolute","maskRepeat":"no-repeat","maskType":"alpha","maskPosition":"0px 0px"}}>
          <img src="/images/e232b6dde94eee651266af90109671af703a64c3.png" alt="" style={{"inset":"0","width":"100%","height":"100%","position":"absolute","objectFit":"cover"}} />
        </div>
      </div>

      {/* Dark section backgrounds */}
      <div style={{"backgroundColor":"#090909","left":"0px","top":"1172px","width":"393px","height":"1237px","position":"absolute"}}></div>

      {/* Glow orbs */}
      <div style={{"borderRadius":"15px","backgroundColor":"rgba(197,28,28,0.14)","left":"-114px","top":"5566px","width":"198px","height":"225px","position":"absolute"}}></div>
      <div style={{"borderRadius":"15px","backgroundColor":"rgba(197,28,28,0.14)","left":"101px","top":"5566px","width":"198px","height":"225px","position":"absolute"}}></div>
      <div style={{"borderRadius":"15px","backgroundColor":"rgba(197,28,28,0.14)","left":"316px","top":"5566px","width":"198px","height":"225px","position":"absolute"}}></div>

      {/* Decorative SVG blobs */}
      <svg width="393" height="1237" viewBox="0 0 393 1237" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{"left":"-0.2px","top":"1172px","width":"393px","height":"1237px","position":"absolute"}}>
        <defs>
          <clipPath id="mc_def_0"><rect x="0" y="0" width="393" height="1237"></rect></clipPath>
          <mask id="mc_def_1" maskUnits="userSpaceOnUse" x="0" y="0" width="393" height="1237" style={{"maskType":"alpha"}}>
            <path d="M0 0L393 0 393 1237 0 1237Z" style={{"fillRule":"nonzero","fill":"#363636"}}></path>
          </mask>
          <linearGradient x1="0" y1="0.5" x2="1" y2="0.5" gradientUnits="userSpaceOnUse" gradientTransform="matrix(227 98 -170 277 335 1076)" id="mc_def_2">
            <stop stopColor="#f1301e" offset="0"></stop><stop stopColor="#9f2315" offset="1"></stop>
          </linearGradient>
          <linearGradient x1="0" y1="0.5" x2="1" y2="0.5" gradientUnits="userSpaceOnUse" gradientTransform="matrix(227 98 -170 277 -31 -5)" id="mc_def_3">
            <stop stopColor="#f1301e" offset="0"></stop><stop stopColor="#9f2315" offset="1"></stop>
          </linearGradient>
        </defs>
        <g style={{"clipPath":"url(#mc_def_0)"}}>
          <path d="M482 1308C444 1369 349 1433 289 1407 229 1381 239 1233 277 1172 315 1110 396 1102 456 1128 516 1154 519 1246 482 1308Z" style={{"fillRule":"nonzero","opacity":"0.2","fill":"url(#mc_def_2)","mask":"url(#mc_def_1)"}}></path>
          <path d="M115 226C77 287-17 351-77 325-137 299-127 151-89 90-51 28 29 20 89 46 149 72 152 165 115 226Z" style={{"fillRule":"nonzero","opacity":"0.2","fill":"url(#mc_def_3)","mask":"url(#mc_def_1)"}}></path>
        </g>
      </svg>

      {/* Main page image / content background */}
      <div style={{"overflow":"hidden","left":"0px","top":"0px","width":"393px","height":"7036px","position":"absolute"}}>
        <img src="/images/5057f55df3a0654d35ba33b5c7d724680455ffc1.png" alt="" style={{"position":"absolute","left":"16px","top":"71px","height":"24px","objectFit":"contain"}} />
      </div>

      {/* ===== INTERACTIVE OVERLAY COMPONENTS ===== */}
      <VideoPlayerOverlay />
      <TestimonialSlider />
      <FAQOverlay />

      {/* ===== CTA BUTTON CLICK TARGETS ===== */}
      <a href="/checkout" style={{"display":"block","left":"66px","top":"587px","width":"259px","height":"46px","position":"absolute","cursor":"pointer","zIndex":10}} aria-label="Klaim Sekarang" />
      <a href="/checkout" style={{"display":"block","left":"66px","top":"4990px","width":"259px","height":"46px","position":"absolute","cursor":"pointer","zIndex":10}} aria-label="Klaim Sekarang" />
      <a href="/checkout" style={{"display":"block","left":"66px","top":"6382px","width":"259px","height":"46px","position":"absolute","cursor":"pointer","zIndex":10}} aria-label="Klaim Sekarang" />
      <a href="/checkout" style={{"display":"block","left":"66px","top":"3083px","width":"259px","height":"46px","position":"absolute","cursor":"pointer","zIndex":10}} aria-label="Klaim Sekarang" />

      {/* Login button */}
      <a href="/login" style={{"display":"block","left":"290px","top":"71px","width":"83px","height":"25px","position":"absolute","cursor":"pointer","zIndex":10}} aria-label="Login" />

      {/* WhatsApp button */}
      <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" style={{"display":"block","left":"106px","top":"62px","width":"100px","height":"44px","position":"absolute","cursor":"pointer","zIndex":10}} aria-label="WhatsApp" />

      {/* ===== FALLBACK: Full page image (from original design export) ===== */}
      {/* The original index.html renders the design as a layered image export */}
      {/* We overlay interactive elements on top of the static design image */}
      <img
        src="/images/landing-full.png"
        alt="Landing page design"
        style={{
          position: "absolute", top: 0, left: 0,
          width: "393px", height: "auto",
          pointerEvents: "none",
          zIndex: 0,
        }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    </>
  );
}
