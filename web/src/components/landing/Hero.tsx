"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users } from "@phosphor-icons/react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pb-32 bg-brand-black">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-brand-red/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-dark border border-white/5 mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-brand-red animate-pulse" />
            <span className="text-sm font-medium text-slate-300">Kelas Persiapan Karir #1</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6"
          >
            Cari Kerja Bukan Soal Nasib{" "}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-rose-400">
              Ini Strateginya.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Pelajari rahasia membuat CV yang selalu lolos screening, strategi interview anti-gagal, dan cara menaikkan tawaran gaji hingga 3x lipat dari ex-recruiter.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-brand-red text-white font-semibold hover:bg-brand-red-dark transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(225,29,72,0.4)]">
              Mulai Belajar Rp 50.000
              <ArrowRight weight="bold" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-3 text-sm text-slate-400"
          >
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-brand-black bg-brand-gray" />
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <Users weight="fill" className="text-slate-500" />
              <span>Dipercaya oleh <strong>1,200+</strong> fresh grad</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
