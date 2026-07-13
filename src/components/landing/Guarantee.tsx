"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "@phosphor-icons/react";

export function Guarantee() {
  return (
    <section className="py-24 bg-brand-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[300px] bg-brand-red/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-b from-brand-dark to-brand-black border border-white/10 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

          <div className="w-20 h-20 mx-auto bg-brand-red/10 rounded-full flex items-center justify-center mb-6 text-brand-red">
            <ShieldCheck size={40} weight="duotone" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            100% Money-Back Guarantee
          </h2>
          
          <div className="space-y-4 text-lg text-slate-300 max-w-2xl mx-auto mb-10">
            <p>
              Kami sangat yakin kelas ini akan mengubah cara pandangmu mencari kerja.
            </p>
            <p className="font-semibold text-white text-xl">
              Jika kamu merasa kelas ini tidak bermanfaat sama sekali, kami akan kembalikan uangmu 100%.
            </p>
            <p className="text-brand-red font-bold text-2xl mt-4">
              Tanpa debat. Tanpa negosiasi.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            *Klaim garansi berlaku 30 hari sejak tanggal pembelian.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
