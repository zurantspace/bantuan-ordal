// Mock data for Bantuan Ordal platform

export interface Episode {
  id: number;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  tier: 'standard' | 'premium';
  progress?: number; // 0-100
  completed?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'standard' | 'premium';
  avatar?: string;
  joinedAt: string;
  isAffiliate: boolean;
  affiliateCode?: string;
}

export interface AffiliateTransaction {
  id: string;
  date: string;
  type: 'click' | 'transaction';
  amount: number;
  commission: number;
  status: 'pending' | 'approved' | 'paid';
}

export interface WithdrawalRequest {
  id: string;
  date: string;
  amount: number;
  method: string;
  account: string;
  status: 'pending' | 'processing' | 'completed';
}

export const EPISODES: Episode[] = [
  {
    id: 1,
    number: 1,
    title: 'Jual Diri',
    subtitle: 'CV sebagai Iklan',
    description: 'CV kamu bukan riwayat hidup, ini adalah IKLAN. Pelajari cara menjual dirimu agar HRD nggak bisa melewatkan namamu. Kuasai teknik headline CV, bullet point achievement, dan format yang bikin recruiter langsung tertarik dalam 6 detik.',
    duration: '45 menit',
    thumbnail: '/images/3908b7a0f767afe6cf41279595bad9a7e5f615d5.png',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tier: 'standard',
    progress: 100,
    completed: true,
  },
  {
    id: 2,
    number: 2,
    title: 'Pembuktian',
    subtitle: 'Strategi Apply Kerja',
    description: 'Kandidat urutan ke-9 sampai 200 seringnya tidak pernah dibuka sama sekali. Pelajari strategi apply kerja yang sistematis: kapan harus apply, berapa perusahaan per hari, dan bagaimana membuat follow-up yang efektif.',
    duration: '52 menit',
    thumbnail: '/images/9ed8bdd22586e8961463be4aa56f94247d755f99.png',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tier: 'standard',
    progress: 100,
    completed: true,
  },
  {
    id: 3,
    number: 3,
    title: 'Gaji Dollar',
    subtitle: 'Kerja Remote Internasional',
    description: 'Tidak perlu di kantor untuk dapat gaji besar. Pelajari cara mendapatkan pekerjaan remote dari perusahaan internasional, platform mana yang harus digunakan, dan bagaimana positioning diri sebagai kandidat global.',
    duration: '61 menit',
    thumbnail: '/images/e26466b5c42f70d4191af984fd6c15e2cc1c1123.png',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tier: 'standard',
    progress: 34,
    completed: false,
  },
  {
    id: 4,
    number: 4,
    title: 'Negosiasi Gaji',
    subtitle: 'Maximize Your Offer',
    description: 'Gaji pertamamu ditentukan dalam 10 detik. Pelajari cara menjawab "berapa ekspektasi gaji kamu?" dengan teknik yang tepat, kapan harus negotiate, dan bagaimana mendapat offer terbaik.',
    duration: '48 menit',
    thumbnail: '/images/c544b901ed7a5f5012ce33f8860c4854b5cb9d50.png',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    tier: 'standard',
    progress: 0,
    completed: false,
  },
  // Premium episodes (locked)
  {
    id: 5,
    number: 5,
    title: 'Personal Branding',
    subtitle: 'LinkedIn & Portfolio',
    description: 'Bangun presence online yang membuat recruiter datang ke kamu. LinkedIn optimization, portfolio digital, dan teknik content creation yang menarik perhatian.',
    duration: '55 menit',
    thumbnail: '/images/3908b7a0f767afe6cf41279595bad9a7e5f615d5.png',
    videoUrl: '',
    tier: 'premium',
    progress: 0,
    completed: false,
  },
  {
    id: 6,
    number: 6,
    title: 'Network Building',
    subtitle: 'Koneksi = Peluang',
    description: '80% lowongan tidak dipublish. Pelajari cara membangun network yang menghasilkan referral dan informasi lowongan eksklusif.',
    duration: '43 menit',
    thumbnail: '/images/9ed8bdd22586e8961463be4aa56f94247d755f99.png',
    videoUrl: '',
    tier: 'premium',
    progress: 0,
    completed: false,
  },
  {
    id: 7,
    number: 7,
    title: 'Interview Mastery',
    subtitle: 'Jawab Seperti Pro',
    description: 'Pertanyaan interview itu cuma ada segelintir dan diulang di semua perusahaan. Kandidat yang keterima bukan yang paling jujur, tapi yang paling siap.',
    duration: '67 menit',
    thumbnail: '/images/e26466b5c42f70d4191af984fd6c15e2cc1c1123.png',
    videoUrl: '',
    tier: 'premium',
    progress: 0,
    completed: false,
  },
  {
    id: 8,
    number: 8,
    title: 'First 90 Days',
    subtitle: 'Survive & Thrive',
    description: 'Dapat kerja baru adalah satu hal. Bertahan dan berkembang adalah hal lain. Pelajari strategi onboarding yang membuat kamu dilihat sebagai aset berharga.',
    duration: '49 menit',
    thumbnail: '/images/c544b901ed7a5f5012ce33f8860c4854b5cb9d50.png',
    videoUrl: '',
    tier: 'premium',
    progress: 0,
    completed: false,
  },
  {
    id: 9,
    number: 9,
    title: 'Career Acceleration',
    subtitle: 'Naik Jabatan Cepat',
    description: 'Dari entry level ke posisi senior dalam waktu minimum. Framework promosi, cara bicara dengan atasan, dan strategi positioning karir jangka panjang.',
    duration: '71 menit',
    thumbnail: '/images/3908b7a0f767afe6cf41279595bad9a7e5f615d5.png',
    videoUrl: '',
    tier: 'premium',
    progress: 0,
    completed: false,
  },
];

export const MOCK_USER: User = {
  id: 'user-001',
  name: 'Riyani Rahayu',
  email: 'riyani@email.com',
  phone: '08123456789',
  tier: 'standard',
  joinedAt: '2026-07-01',
  isAffiliate: true,
  affiliateCode: 'RIYANI2026',
};

export const AFFILIATE_TRANSACTIONS: AffiliateTransaction[] = [
  {
    id: 'tr-001',
    date: '2026-07-08',
    type: 'transaction',
    amount: 50000,
    commission: 25000,
    status: 'approved',
  },
  {
    id: 'tr-002',
    date: '2026-07-07',
    type: 'transaction',
    amount: 97000,
    commission: 48500,
    status: 'pending',
  },
  {
    id: 'tr-003',
    date: '2026-07-06',
    type: 'click',
    amount: 0,
    commission: 1000,
    status: 'approved',
  },
  {
    id: 'tr-004',
    date: '2026-07-05',
    type: 'transaction',
    amount: 50000,
    commission: 25000,
    status: 'paid',
  },
  {
    id: 'tr-005',
    date: '2026-07-03',
    type: 'transaction',
    amount: 50000,
    commission: 25000,
    status: 'paid',
  },
];


export const FAQS = [
  {
    id: 1,
    question: 'Apakah kelas ini cocok untuk yang baru lulus kuliah?',
    answer: 'Ya! Kelas ini didesain khusus untuk fresh graduate dan mereka yang baru masuk dunia kerja. Semua materi disajikan dengan bahasa yang mudah dipahami dan langsung bisa dipraktikkan.',
  },
  {
    id: 2,
    question: 'Berapa lama akses ke kelas ini?',
    answer: 'Kamu mendapatkan akses SEUMUR HIDUP ke semua materi yang sudah kamu beli. Termasuk update konten di masa depan.',
  },
  {
    id: 3,
    question: 'Bagaimana cara mengakses kelasnya?',
    answer: 'Setelah pembayaran berhasil, kamu akan menerima email berisi link dan password untuk login ke member area. Akses bisa langsung digunakan dari HP atau laptop.',
  },
  {
    id: 4,
    question: 'Apakah ada garansi uang kembali?',
    answer: 'Ya! Kami memberikan garansi refund 100% selama 30 hari. Jika kamu merasa tidak mendapat manfaat setelah menyelesaikan seluruh materi, kami kembalikan uangmu. Tanpa debat, tanpa negosiasi.',
  },
  {
    id: 5,
    question: 'Apakah saya bisa akses dari HP?',
    answer: 'Tentu! Platform kami mobile-friendly dan bisa diakses dari HP, tablet, maupun laptop. Belajar kapan saja dan di mana saja.',
  },
  {
    id: 6,
    question: 'Apa bedanya paket Standar dan Premium?',
    answer: 'Paket Standar (Ep.1-4) mencakup strategi dasar dari CV, apply kerja, kerja remote, hingga negosiasi gaji. Paket Premium menambahkan Ep.5-9 yang membahas personal branding, networking, interview mastery, hingga akselerasi karir.',
  },
  {
    id: 7,
    question: 'Kapan saya bisa mulai belajar setelah bayar?',
    answer: 'Akses langsung tersedia setelah pembayaran dikonfirmasi. Biasanya dalam 1-5 menit kamu sudah bisa login.',
  },
  {
    id: 8,
    question: 'Apakah ada sesi live atau tanya jawab?',
    answer: 'Saat ini kelas bersifat self-paced (belajar mandiri). Kamu bisa menghubungi tim support kami via WhatsApp jika ada pertanyaan seputar materi.',
  },
  {
    id: 9,
    question: 'Bisakah satu akun dipakai oleh banyak orang?',
    answer: 'Setiap akun hanya boleh digunakan dari 1 perangkat aktif dalam satu waktu. Berbagi akun tidak diperbolehkan.',
  },
  {
    id: 10,
    question: 'Apakah ada sertifikat?',
    answer: 'Ya! Kamu akan mendapatkan sertifikat penyelesaian digital setelah menyelesaikan semua episode di paket yang kamu beli.',
  },
  {
    id: 11,
    question: 'Bagaimana program affiliate bekerja?',
    answer: 'Setiap alumni bisa mendaftar jadi affiliate. Kamu dapat komisi 50% dari setiap transaksi yang berhasil melalui link referralmu. Plus bonus Rp 1.000 untuk setiap 1.000 klik unik.',
  },
  {
    id: 12,
    question: 'Kapan komisi affiliate bisa dicairkan?',
    answer: 'Komisi bisa dicairkan setelah usia transaksi 7 hari (masa refund). Pencairan minimum Rp 50.000 via GoPay, OVO, atau transfer bank.',
  },
  {
    id: 13,
    question: 'Apakah video bisa didownload?',
    answer: 'Video hanya bisa ditonton secara streaming untuk menjaga kualitas konten. Namun template dan file bonus bisa kamu download selamanya.',
  },
  {
    id: 14,
    question: 'Kelvin Sun siapa?',
    answer: 'Kelvin Sun adalah career coach dan content creator yang telah membantu ribuan fresh graduate mendapatkan pekerjaan impian mereka. Beliau punya pengalaman langsung di industri recruitment dan HR.',
  },
  {
    id: 15,
    question: 'Apakah Order Bump wajib dibeli?',
    answer: 'Tidak! Order Bump adalah tambahan opsional berupa bonus eksklusif senilai Rp 200.000 yang bisa kamu dapatkan hanya dengan tambahan Rp 47.000. Kamu bebas memilih.',
  },
  {
    id: 16,
    question: 'Bagaimana jika saya sudah kerja, apakah kelas ini masih relevan?',
    answer: 'Sangat relevan! Terutama jika kamu ingin pindah kerja, naik gaji, atau membangun karir yang lebih strategis. Materi di Ep.5-9 (Premium) sangat cocok untuk yang sudah bekerja.',
  },
];

// Affiliate & Wallet data
export const AFFILIATE_STATS = {
  balance: 350000,
  totalEarned: 1250000,
  totalClicks: 843,
  totalLeads: 20,
  leadsVerified: 10,
  leadsUnverified: 10,
  paidCommission: 100000,
  unpaidCommission: 250000,
  affiliateCode: '456678',
  affiliateLink: 'https://bantuanordal/referral/456678',
};

export const WITHDRAWAL_HISTORY: WithdrawalRequest[] = [
  { id: 'wd-001', date: '2026-07-05', amount: 150000, method: 'GoPay', account: '082299887766', status: 'completed' },
  { id: 'wd-002', date: '2026-06-20', amount: 200000, method: 'Transfer Bank BCA', account: '1234567890', status: 'completed' },
  { id: 'wd-003', date: '2026-06-10', amount: 100000, method: 'OVO', account: '081234567890', status: 'completed' },
];

// Bonus Templates
export interface BonusTemplate {
  id: string;
  icon: string;
  title: string;
  description: string;
  fileType: string;
  downloadUrl?: string;
}

export const BONUS_TEMPLATES: BonusTemplate[] = [
  {
    id: 'tmpl-cv',
    icon: '📄',
    title: 'CV Template ATS-Friendly',
    description: 'Template CV yang lolos sistem ATS, sudah dipakai 1000+ alumni Bantuan Ordal berhasil dipanggil interview.',
    fileType: 'DOCX',
  },
  {
    id: 'tmpl-cover-letter',
    icon: '✉️',
    title: 'Cover Letter Generator',
    description: 'Template surat lamaran yang personal dan memikat, dengan 3 variasi gaya: formal, casual-professional, dan kreatif.',
    fileType: 'DOCX',
  },
  {
    id: 'tmpl-linkedin',
    icon: '💼',
    title: 'LinkedIn Headline & Summary Cheat Sheet',
    description: 'Formula teruji untuk menulis LinkedIn headline & about yang bikin recruiter terpaksa klik profil kamu.',
    fileType: 'PDF',
  },
  {
    id: 'tmpl-interview',
    icon: '🎯',
    title: 'Interview Answer Script (50 Soal)',
    description: 'Jawaban siap pakai untuk 50 pertanyaan interview paling umum, termasuk "Kenapa kami harus hire kamu?"',
    fileType: 'PDF',
  },
  {
    id: 'tmpl-salary',
    icon: '💰',
    title: 'Salary Negotiation Playbook',
    description: 'Strategi dan script negosiasi gaji step-by-step. Rata-rata alumni mendapat penawaran 15-30% lebih tinggi.',
    fileType: 'PDF',
  },
];
