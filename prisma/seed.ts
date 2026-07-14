#!/usr/bin/env node
/**
 * Database seed script
 * Run: npx prisma db seed
 * Or:  npx tsx prisma/seed.ts
 *
 * Prisma 7 requires adapter-pg for driver adapter builds.
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Admin user ──────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('admin9999', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bantuan-ordal.id' },
    update: {},
    create: {
      name: 'Admin Bantuan Ordal',
      email: 'admin@bantuan-ordal.id',
      phone: '08570000000',
      passwordHash: adminHash,
      role: 'ADMIN',
      tier: 'premium',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // ─── Demo user ───────────────────────────────────────────────────────────────
  const demoHash = await bcrypt.hash('demo1234', 12);
  const demo = await prisma.user.upsert({
    where: { email: 'demo@bantuanordal.com' },
    update: { passwordHash: demoHash },
    create: {
      name: 'Demo User',
      email: 'demo@bantuanordal.com',
      phone: '08123456789',
      passwordHash: demoHash,
      role: 'MEMBER',
      tier: 'premium',
    },
  });
  console.log('✅ Demo user created:', demo.email);



  // ─── Products ─────────────────────────────────────────────────────────────────
  await prisma.product.upsert({
    where: { slug: 'main_course' },
    update: {},
    create: { slug: 'main_course', name: 'Kelas Persiapan Karir (Ep.1-4)', price: 50000 },
  });
  await prisma.product.upsert({
    where: { slug: 'order_bump' },
    update: {},
    create: { slug: 'order_bump', name: 'Bonus Template Pack', price: 47000 },
  });
  await prisma.product.upsert({
    where: { slug: 'premium_upgrade' },
    update: {},
    create: { slug: 'premium_upgrade', name: 'Premium Upgrade (Ep.5-9)', price: 149000 },
  });
  console.log('✅ Products seeded');

  // ─── Episodes ─────────────────────────────────────────────────────────────────
  const episodes = [
    { number: 1, title: 'Kenapa Fresh Grad Susah Kerja?', subtitle: 'Mindset Reset', tier: 'standard', sortOrder: 1, duration: '28 menit', description: 'Bongkar mitos-mitos yang bikin fresh grad stuck di tempat, dan kenapa strategi "lamar sebanyak mungkin" justru kontraproduktif.' },
    { number: 2, title: 'Buat CV yang Lolos ATS', subtitle: 'Resume Mastery', tier: 'standard', sortOrder: 2, duration: '35 menit', description: 'Formula CV satu halaman yang dirancang untuk lolos sistem ATS dan langsung menarik perhatian recruiter dalam 6 detik pertama.' },
    { number: 3, title: 'Menguasai LinkedIn Algorithm', subtitle: 'Digital Presence', tier: 'standard', sortOrder: 3, duration: '42 menit', description: 'Cara kerja LinkedIn algorithm dan bagaimana mengoptimalkan profil kamu agar recruiter yang datang ke kamu, bukan sebaliknya.' },
    { number: 4, title: 'Strategi Lamaran yang Convert', subtitle: 'Application System', tier: 'standard', sortOrder: 4, duration: '38 menit', description: 'Sistem lamaran yang terstruktur: cara riset perusahaan, customisasi lamaran, dan follow-up yang profesional.' },
    { number: 5, title: 'Personal Branding Otentik', subtitle: 'Brand Building', tier: 'premium', sortOrder: 5, duration: '45 menit', description: 'Bangun personal brand yang otentik dan konsisten di semua platform — tanpa harus jadi influencer.' },
    { number: 6, title: 'Network Building dari Nol', subtitle: 'Networking Mastery', tier: 'premium', sortOrder: 6, duration: '40 menit', description: 'Cara membangun jaringan profesional yang genuine, bahkan jika kamu introvert atau baru mulai.' },
    { number: 7, title: 'Interview Mastery', subtitle: 'Winning Interviews', tier: 'premium', sortOrder: 7, duration: '52 menit', description: 'Framework STAR yang dimodifikasi, cara menjawab pertanyaan jebakan, dan teknik negosiasi gaji.' },
    { number: 8, title: '90 Hari Pertama di Kantor', subtitle: 'Onboarding Excellence', tier: 'premium', sortOrder: 8, duration: '33 menit', description: 'Strategi onboarding yang membuat kamu standout dan membangun reputasi profesional sejak hari pertama.' },
    { number: 9, title: 'Career Acceleration', subtitle: 'Fast Track Growth', tier: 'premium', sortOrder: 9, duration: '47 menit', description: 'Roadmap karir 1-3 tahun pertama: kapan pindah, cara naik jabatan lebih cepat, dan membangun leverage finansial.' },
  ];

  for (const ep of episodes) {
    await prisma.episode.upsert({
      where: { number: ep.number },
      update: {},
      create: ep,
    });
  }
  console.log('✅ Episodes seeded (9 episodes)');

  // ─── Bonus Resources ─────────────────────────────────────────────────────────
  const bonuses = [
    { title: 'CV Template ATS-Friendly', description: 'Template CV satu halaman yang sudah dioptimasi untuk sistem ATS. Tersedia dalam format Word dan Google Docs.', tier: 'standard', sortOrder: 1, fileType: 'docx' },
    { title: 'Cover Letter Generator', description: 'Framework cover letter yang powerful untuk berbagai jenis posisi dan industri.', tier: 'standard', sortOrder: 2, fileType: 'pdf' },
    { title: 'LinkedIn Cheat Sheet', description: 'Panduan lengkap optimasi LinkedIn dalam 2 halaman: headline, summary, experience, dan keyword strategy.', tier: 'standard', sortOrder: 3, fileType: 'pdf' },
    { title: 'Interview Script 50 Soal', description: 'Script jawaban untuk 50 pertanyaan interview yang paling sering ditanyakan recruiter Indonesia.', tier: 'standard', sortOrder: 4, fileType: 'pdf' },
    { title: 'Salary Negotiation Playbook', description: 'Panduan negosiasi gaji: cara riset salary benchmark, script negosiasi, dan counter-offer strategy.', tier: 'standard', sortOrder: 5, fileType: 'pdf' },
    { title: 'Personal Brand Blueprint', description: 'Workbook membangun personal brand dari nol: positioning, content pillars, dan consistency framework.', tier: 'premium', sortOrder: 6, fileType: 'pdf' },
    { title: 'Network Building Tracker', description: 'Spreadsheet untuk tracking dan mengelola jaringan profesional kamu secara sistematis.', tier: 'premium', sortOrder: 7, fileType: 'docx' },
    { title: '90-Day Career Plan Template', description: 'Template rencana 90 hari pertama di kantor baru, lengkap dengan weekly goals dan metrics.', tier: 'premium', sortOrder: 8, fileType: 'docx' },
  ];

  for (const bonus of bonuses) {
    const existing = await prisma.bonusResource.findFirst({ where: { title: bonus.title } });
    if (!existing) {
      await prisma.bonusResource.create({ data: bonus });
    }
  }
  console.log('✅ Bonus resources seeded (8 resources)');

  // ─── App Settings ─────────────────────────────────────────────────────────────
  const settings = [
    { key: 'price_main', value: '50000' },
    { key: 'price_bump', value: '47000' },
    { key: 'price_premium', value: '149000' },
    { key: 'commission_rate', value: '0.5' },
    { key: 'click_bonus_per_1000', value: '1000' },
    { key: 'commission_approval_days', value: '7' },
    { key: 'min_withdrawal', value: '50000' },
    { key: 'whatsapp_support', value: '6285718752080' },
    { key: 'affiliate_enabled', value: 'true' },
    { key: 'promo_enabled', value: 'true' },
  ];

  for (const s of settings) {
    await prisma.appSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log('✅ App settings seeded');

  console.log('\n🎉 Seed complete! Login admin: admin@bantuan-ordal.id / admin9999');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
