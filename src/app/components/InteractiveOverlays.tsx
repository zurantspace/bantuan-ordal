"use client";

import React, { useState, useRef } from "react";

// ====== FAQ ACCORDION ======
const FAQ_ITEMS = [
  {
    question: "Saya fresh graduate, belum pernah kerja sama sekali. Cocok gak?",
    answer:
      "Justru ini dibuat untuk kamu. Ada episode khusus yang membahas cara dapat kerja saat pengalaman kerjamu masih kosong. Bagian yang paling sering bikin fresh grad merasa buntu.",
  },
  {
    question: "Durasi total kelas berapa lama?",
    answer:
      "Total durasi kelas sekitar 2-3 jam yang bisa kamu tonton kapanpun. Setiap episode dirancang ringkas dan langsung ke poin agar mudah dicerna.",
  },
  {
    question: "Materinya bakal basi gak dalam setahun dua tahun?",
    answer:
      "Tidak. Strategi yang diajarkan adalah prinsip-prinsip fundamental yang tidak berubah — cara HRD berpikir, cara CV dibaca, cara interview dinilai. Ini bukan tren, ini psikologi perekrutan.",
  },
  {
    question: "Kok murah banget 50rb? Jangan-jangan isinya receh.",
    answer:
      "Harga murah bukan berarti isi receh. Kelvin memilih harga ini supaya bisa diakses semua orang, terutama fresh grad yang belum punya penghasilan. Nilainya jauh lebih dari 50rb.",
  },
];

export function FAQOverlay() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  // FAQ items positioned at: top 5926px (first item), each item ~60-70px height
  const tops = [5926, 5926 + 141, 5926 + 141 + 59, 5926 + 141 + 59 + 59];
  const heights = [141, 59, 59, 59];

  return (
    <>
      {FAQ_ITEMS.map((item, idx) => (
        <div
          key={idx}
          onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
          style={{
            position: "absolute",
            left: "31px",
            top: `${tops[idx]}px`,
            width: "331px",
            height: openIdx === idx ? "auto" : `${heights[idx]}px`,
            minHeight: `${heights[idx]}px`,
            borderRadius: "11px",
            cursor: "pointer",
            zIndex: 20,
            backgroundColor: "#161616",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {/* Question row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              minHeight: `${heights[idx]}px`,
            }}
          >
            <span
              style={{
                color: "#fff",
                fontFamily: "Poppins, sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                lineHeight: "15px",
                flex: 1,
                paddingRight: "8px",
              }}
            >
              {item.question}
            </span>
            {/* Arrow icon — unique gradient ID per item */}
            <svg
              width="11"
              height="20"
              viewBox="0 0 11 20"
              fill="none"
              style={{
                flexShrink: 0,
                transform: openIdx === idx ? "rotate(90deg) scale(-1,1)" : "rotate(-90deg) scale(-1,1)",
                transition: "transform 0.3s ease",
              }}
            >
              <path
                d="M10.7009 17.865L9.1094 19.455 0.4409 10.7895C0.3012 10.6506 0.1903 10.4855 0.1146 10.3037 0.039 10.1218 0 9.9267 0 9.7298 0 9.5328 0.039 9.3377 0.1146 9.1558 0.1903 8.974 0.3012 8.8089 0.4409 8.67L9.1094 0 10.6994 1.59 2.5634 9.7275 10.7009 17.865Z"
                fill={`url(#faq-arrow-grad-${idx})`}
              />
              <defs>
                <linearGradient id={`faq-arrow-grad-${idx}`} x1="0" y1="0.5" x2="1" y2="0.5">
                  <stop stopColor="#f1301e" offset="0" />
                  <stop stopColor="#9f2315" offset="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Answer */}
          {openIdx === idx && (
            <div
              style={{
                padding: "0 16px 14px",
                color: "#ccc",
                fontFamily: "Poppins, sans-serif",
                fontSize: "9px",
                fontWeight: 400,
                lineHeight: "15px",
              }}
            >
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

// ====== VIDEO PLAYER ======
export function VideoPlayerOverlay() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  const fmt = (t: number) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    setProgress(dur ? (cur / dur) * 100 : 0);
    setCurrentTime(fmt(cur));
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(fmt(videoRef.current.duration));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const pct = Number(e.target.value);
    videoRef.current.currentTime = (pct / 100) * (videoRef.current.duration || 0);
    setProgress(pct);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "43px",
        top: "392px",
        width: "305px",
        height: "155px",
        borderRadius: "20px",
        overflow: "hidden",
        zIndex: 20,
        cursor: "pointer",
      }}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        poster="/images/95bdde574663222db6a16fc32e08d608bf39b10f.png"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => { setIsPlaying(false); setProgress(0); setCurrentTime("0:00"); }}
        playsInline
        onClick={(e) => e.stopPropagation()}
      />

      {/* Play button overlay */}
      {!isPlaying && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.3)",
          }}
          onClick={togglePlay}
        >
          <div style={{ width: 61, height: 61, filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))", transition: "transform 0.15s" }}>
            <svg width="100%" height="100%" viewBox="0 0 50 51" fill="none">
              <path
                d="M25 0C20.0555 0 15.222 1.4907 11.1108 4.2835 6.9995 7.0763 3.7952 11.0458 1.903 15.6901 0.0108 20.3344-0.4843 25.4449 0.4804 30.3752 1.445 35.3056 3.826 39.8344 7.3223 43.389 10.8187 46.9435 15.2732 49.3643 20.1228 50.345 24.9723 51.3257 29.9989 50.8223 34.5671 48.8986 39.1353 46.9749 43.0397 43.7172 45.7867 39.5374 48.5338 35.3577 50 30.4436 50 25.4167 50 22.0789 49.3534 18.7738 48.097 15.6901 46.8406 12.6064 44.9991 9.8045 42.6777 7.4444 40.3562 5.0842 37.6002 3.212 34.5671 1.9347 31.534 0.6574 28.2831 0 25 0ZM20 36.8542V13.9792L35 25.4167 20 36.8542Z"
                fill="#fff"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Controls bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
          padding: "20px 10px 8px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          opacity: isPlaying ? 1 : 0,
          transition: "opacity 0.3s",
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          if (isPlaying) (e.currentTarget as HTMLDivElement).style.opacity = "0";
        }}
      >
        <button
          onClick={togglePlay}
          style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        <span style={{ color: "#fff", fontSize: 9, fontFamily: "Poppins", minWidth: 28 }}>{currentTime}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleSeek}
          style={{
            flex: 1,
            height: 3,
            cursor: "pointer",
            appearance: "none",
            background: `linear-gradient(to right, #f1301e ${progress}%, rgba(255,255,255,0.3) ${progress}%)`,
            borderRadius: 3,
            outline: "none",
          }}
        />
        <span style={{ color: "#fff", fontSize: 9, fontFamily: "Poppins", minWidth: 28, textAlign: "right" }}>{duration}</span>
      </div>
    </div>
  );
}

// ====== TESTIMONIAL SLIDER ======
const SLIDES = [
  "/images/6ad72bf32a791010a1a4fb994e11e862a0379d83.png",
  "/images/83424aab9ef97c9c134d8ac55d65caa74a83f52d.png",
  "/images/ce6a0805330e942495a04badf4d43b52e986ab60.png",
];

export function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const startX = useRef<number | null>(null);

  const prev = () => setCurrent((c) => (c === 0 ? SLIDES.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === SLIDES.length - 1 ? 0 : c + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 30) {
      if (diff > 0) next();
      else prev();
    }
    startX.current = null;
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "0px",
        top: "866px",
        width: "393px",
        height: "225px",
        zIndex: 20,
        overflow: "hidden",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div
        style={{
          display: "flex",
          transition: "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          transform: `translateX(-${current * 100}%)`,
          height: "100%",
        }}
      >
        {SLIDES.map((src, i) => (
          <div
            key={i}
            style={{
              minWidth: "100%",
              height: "100%",
              overflow: "hidden",
              borderRadius: "12px",
              flexShrink: 0,
            }}
          >
            <img
              src={src}
              alt={`Testimoni ${i + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>

      {/* Left fade gradient */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "118px", background: "linear-gradient(-89.8deg, rgba(0,0,0,0) 5%, #000 95%)", pointerEvents: "none" }} />
      {/* Right fade gradient */}
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "118px", background: "linear-gradient(89.8deg, rgba(0,0,0,0) 5%, #000 95%)", pointerEvents: "none" }} />

      {/* Dots */}
      <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 6 }}>
        {SLIDES.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: i === current ? "#f1301e" : "rgba(255,255,255,0.4)",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
