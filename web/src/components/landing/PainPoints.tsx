"use client";

import { motion } from "framer-motion";
import { WarningCircle, FileX, Clock, CurrencyCircleDollar, BookOpen, UserSwitch, HandsClapping } from "@phosphor-icons/react";

const points = [
  {
    id: 1,
    title: "CV kamu gak pernah dibaca",
    description: "Faktanya, bukan karena kamu kurang kompeten, tapi karena sistem ATS dan HRD menolak format CV kamu dalam 5 detik pertama.",
    icon: FileX,
  },
  {
    id: 2,
    title: "HRD mencari yang duluan",
    description: "HRD bukan mencari kandidat terbaik di dunia, mereka mencari kandidat yang cukup baik dan melamar paling awal.",
    icon: Clock,
  },
  {
    id: 3,
    title: "Gaji ditentukan dalam 10 detik",
    description: "Kesan pertama dan caramu menjawab pertanyaan 'berapa ekspektasi gaji' menentukan angka final di kontrak kerjamu.",
    icon: CurrencyCircleDollar,
  },
  {
    id: 4,
    title: "IPK jelek gak usah ditulis",
    description: "Ada cara elegan menutupi IPK kurang memuaskan dengan menonjolkan value lain yang justru lebih dicari perusahaan.",
    icon: BookOpen,
  },
  {
    id: 5,
    title: "Interview cuma pola berulang",
    description: "Pertanyaan interview sebenarnya cuma ada segelintir. Jika kamu tahu polanya, kamu bisa menjawab dengan struktur STAR.",
    icon: UserSwitch,
  },
  {
    id: 6,
    title: "Orang dalam itu gak curang",
    description: "Networking adalah skill. Kamu akan belajar cara mendapatkan referensi internal dengan cara profesional, bukan nepotisme.",
    icon: HandsClapping,
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export function PainPoints() {
  return (
    <section className="py-20 bg-brand-black relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Yang Bakal Kamu Tahu Setelah Kelas Ini <br />
            <span className="text-brand-red">(Dan Orang Lain Tidak)</span>
          </h2>
          <p className="text-lg text-slate-400">
            Sebagian besar jobseeker melakukan kesalahan yang sama berulang kali. Saatnya kamu mengetahui aturan main yang sebenarnya.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {points.map((point) => (
            <motion.div 
              key={point.id}
              variants={item}
              className="bg-brand-dark/50 border border-white/5 p-8 rounded-2xl hover:border-brand-red/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red mb-6 group-hover:scale-110 transition-transform">
                <point.icon size={24} weight="duotone" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{point.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {point.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
