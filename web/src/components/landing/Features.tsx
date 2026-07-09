"use client";

import { motion } from "framer-motion";
import { PlayCircle, LockKey } from "@phosphor-icons/react";

const episodes = [
  {
    id: 1,
    title: "JUAL DIRI",
    subtitle: "Ubah CV kamu menjadi iklan yang memikat HRD.",
    description: "Belajar merangkai kata, memilih template yang benar (bukan sekedar ATS friendly), dan menonjolkan value unikmu meskipun tanpa pengalaman kerja.",
    duration: "18 Menit",
    locked: false,
  },
  {
    id: 2,
    title: "PEMBUKTIAN",
    subtitle: "Strategi apply kerja yang efisien dan tepat sasaran.",
    description: "Cara memfilter lowongan bodong, mendekati rekruter via LinkedIn, dan membuktikan kamu adalah kandidat yang mereka cari.",
    duration: "24 Menit",
    locked: false,
  },
  {
    id: 3,
    title: "GAJI DOLLAR",
    subtitle: "Peluang kerja remote internasional.",
    description: "Membuka wawasan tentang kerja remote, platform yang digunakan, dan cara negosiasi gaji dengan klien luar negeri.",
    duration: "30 Menit",
    locked: false,
  },
  {
    id: 4,
    title: "INTERVIEW HACKS",
    subtitle: "Menjawab dengan metode STAR.",
    description: "Teknik psikologis untuk mengontrol jalannya interview dan membuat pewawancara setuju dengan angka gaji yang kamu minta.",
    duration: "22 Menit",
    locked: false,
  },
  {
    id: 5,
    title: "EPISODE PREMIUM",
    subtitle: "Episode 5 hingga 9 (Upsell)",
    description: "Akses eksklusif untuk mendalami strategi negosiasi tingkat lanjut, optimasi LinkedIn gila-gilaan, dan simulasi interview 1-on-1.",
    duration: "1.5 Jam+",
    locked: true,
  }
];

export function Features() {
  return (
    <section className="py-24 bg-[#050505] relative border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Apa Saja yang Akan Kamu Pelajari?
          </h2>
          <p className="text-lg text-slate-400">
            Kurikulum praktis tanpa basa-basi. Langsung ke inti permasalahan yang sering membuat pelamar gagal.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {episodes.map((ep, index) => (
            <motion.div
              key={ep.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 sm:p-8 rounded-2xl border ${
                ep.locked 
                  ? "bg-brand-black/50 border-white/5 border-dashed" 
                  : "bg-brand-dark/80 border-white/5 hover:border-brand-red/30 transition-colors"
              } flex flex-col sm:flex-row gap-6 items-start sm:items-center relative overflow-hidden`}
            >
              {/* Overlay for locked content */}
              {ep.locked && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <div className="bg-brand-black px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                    <LockKey weight="fill" className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-300">Tersedia di Premium Bundle</span>
                  </div>
                </div>
              )}

              <div className="shrink-0 w-16 h-16 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red font-bold text-xl">
                Ep.{ep.id}
              </div>
              
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-white mb-1">{ep.title}</h3>
                <h4 className="text-brand-red font-medium text-sm mb-3">{ep.subtitle}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {ep.description}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2 text-slate-500 text-sm font-medium bg-black/30 px-3 py-1.5 rounded-lg">
                <PlayCircle size={18} />
                {ep.duration}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
