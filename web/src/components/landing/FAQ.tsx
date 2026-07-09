"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react";

const faqs = [
  {
    q: "Apakah kelas ini cocok untuk fresh graduate yang belum punya pengalaman?",
    a: "Sangat cocok! Kelas ini justru didesain khusus untuk fresh graduate atau entry-level yang bingung cara 'menjual diri' padahal belum punya pengalaman kerja."
  },
  {
    q: "Saya lulusan universitas non-favorit, apakah kelas ini bisa bantu?",
    a: "Bisa banget. Kita akan belajar cara menutupi kelemahan akademik atau almamater dengan menonjolkan value dan portofolio yang benar-benar dicari HRD."
  },
  {
    q: "Apakah materinya berupa live zoom atau video?",
    a: "Materinya berupa rekaman video high-quality yang bisa kamu akses kapan saja dan di mana saja. Kamu tidak terikat jadwal."
  },
  {
    q: "Berapa lama masa akses kelasnya?",
    a: "Sekali bayar, kamu dapat akses seumur hidup untuk materi utama (Episode 1-4) beserta semua update-nya di masa depan."
  },
  {
    q: "Bagaimana cara belajarnya?",
    a: "Setelah pembayaran berhasil, kamu akan langsung mendapat akses ke member area khusus. Di sana kamu bisa menonton videonya secara berurutan."
  },
  {
    q: "Apakah ada grup diskusi?",
    a: "Ada. Kamu akan diundang ke grup diskusi alumni khusus untuk saling sharing informasi lowongan, review CV, dan networking."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-brand-black relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-lg text-slate-400">
            Masih ragu? Berikut beberapa pertanyaan dari member sebelum mereka bergabung.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border rounded-2xl overflow-hidden transition-colors ${
                  isOpen ? "border-brand-red/30 bg-brand-dark" : "border-white/5 bg-[#050505] hover:border-white/10"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-semibold text-white">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-slate-400"
                  >
                    <CaretDown size={20} weight="bold" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-slate-400 leading-relaxed text-sm">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
