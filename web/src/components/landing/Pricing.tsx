"use client";

import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "@phosphor-icons/react";

const inclusions = [
  "Akses seumur hidup Episode 1-4",
  "Template CV Bahasa Indonesia & Inggris (ATS Friendly)",
  "Template Jawaban Pertanyaan Interview HRD",
  "Grup Diskusi Alumni Bantuan Ordal",
  "Kesempatan bergabung program Affiliate"
];

export function Pricing() {
  return (
    <section className="py-24 bg-[#050505] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Investasi Terkecil Untuk Karirmu
          </h2>
          <p className="text-lg text-slate-400">
            Harga promo spesial ini bisa naik kapan saja. Amankan kursi kamu sekarang.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto bg-brand-dark border border-brand-red/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(225,29,72,0.15)]"
        >
          {/* Popular Badge */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-red to-rose-400" />
          <div className="absolute top-0 right-8 bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-b-lg">
            PROMO TERBATAS
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Kelas Persiapan Karir</h3>
            <div className="flex items-end gap-3 mb-2 mt-4">
              <span className="text-5xl font-bold text-white">Rp 50.000</span>
              <span className="text-xl text-slate-500 line-through mb-1">Rp 149.000</span>
            </div>
            <p className="text-brand-red text-sm font-medium">
              Lebih murah dari biaya nongkrong kopi sekali!
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {inclusions.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle weight="fill" className="text-brand-red mt-0.5 shrink-0" size={20} />
                <span className="text-slate-300 text-sm">{item}</span>
              </div>
            ))}
          </div>

          <button className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-brand-red text-white font-bold hover:bg-brand-red-dark transition-all transform hover:scale-105 active:scale-95">
            Dapatkan Akses Sekarang
            <ArrowRight weight="bold" />
          </button>
          
          <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
            Pembayaran aman diproses oleh Midtrans.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
