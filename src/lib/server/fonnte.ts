import 'server-only';
import axios from 'axios';
import { prisma } from './prisma';

// ─── Config ───────────────────────────────────────────────────────────────────

const FONNTE_URL = 'https://api.fonnte.com/send';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://bantuan-ordal.id';

type MessageData = Record<string, string | number | boolean>;

// ─── WhatsApp Message Templates ───────────────────────────────────────────────

function getWAMessage(code: string, data: MessageData): string | null {
  const templates: Record<string, string> = {
    W01: `Hai ${data.name}! 👋

Kamu hampir punya akses ke Kelas Bantuan Ordal tadi, tapi kayaknya pembayarannya belum selesai.

Harga Rp 50.000 masih berlaku buat kamu. Yuk lanjut:
👉 ${data.checkoutUrl}?utm_source=whatsapp&utm_medium=automation&utm_campaign=abandoned_checkout

Ada kendala? Balas pesan ini ya 😊`,

    W02: `Hai ${data.name}! 🎁

Khusus buat kamu, kami kasih harga spesial *Rp 99.000* untuk Kelas Persiapan Karir.

⏰ Berlaku 2 hari saja!

Klaim sekarang:
👉 ${data.checkoutUrl}?utm_source=whatsapp&utm_medium=automation&utm_campaign=promo_99k`,

    W03: `Hai ${data.name}! ⏰

Ini penawaran terakhir dari kami. Harga *Rp 79.000* berlaku HARI INI SAJA.

Besok kembali ke harga normal.

Klaim sebelum kehabisan:
👉 ${data.checkoutUrl}?utm_source=whatsapp&utm_medium=automation&utm_campaign=promo_79k`,

    W04: `Selamat, ${data.name}! 🎉

Pembayaran berhasil! Akses kelas kamu sudah aktif.

Login di sini:
👉 ${APP_URL}/login?utm_source=whatsapp&utm_medium=automation&utm_campaign=onboarding

Email: ${data.email}
Password: ${data.password || 'gunakan password yang kamu buat saat checkout'}

Selamat belajar! 🚀`,

    W05: `Selamat! 🎊

Kamu baru selesai Episode 4 Kelas Bantuan Ordal!

Mau lanjut ke Episode 5–9 Premium? Ada Personal Branding, Interview Mastery, Career Acceleration, dan lebih banyak lagi.

👉 ${APP_URL}/upgrade?utm_source=whatsapp&utm_medium=automation&utm_campaign=upsell_ep4`,

    W06: `Hey ${data.name}! 🔗

Link affiliate kamu sudah aktif!

Link kamu:
👉 ${data.affiliateLink}

Komisi: *50%* dari setiap transaksi + Rp 1.000 per 1.000 klik unik.

Dashboard affiliate:
👉 ${APP_URL}/affiliate?utm_source=whatsapp&utm_medium=automation&utm_campaign=affiliate_approved`,

    W07: `Komisi masuk! 💰

Hey ${data.name}, seseorang baru saja beli via link kamu!

Komisi kamu: *${data.amount}*
Status: Pending (akan approved dalam 7 hari)

Cek wallet:
👉 ${APP_URL}/wallet?utm_source=whatsapp&utm_medium=automation&utm_campaign=commission`,

    W08: `Pencairan Diproses ✅

Hey ${data.name}, pencairan komisi sebesar *${data.amount}* sedang kami proses.

Dana akan masuk dalam 1x24 jam ke:
${data.payoutMethod}: ${data.payoutAccount}

Ada pertanyaan? Balas pesan ini ya.`,
  };

  return templates[code] || null;
}

// ─── Rate Limiting (1 pesan per nomor per 5 menit) ────────────────────────────

async function isRateLimited(phone: string): Promise<boolean> {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const recent = await prisma.wALog.findFirst({
    where: {
      toPhone: phone,
      createdAt: { gte: fiveMinutesAgo },
      status: { in: ['sent', 'queued'] },
    },
  });
  return !!recent;
}

// ─── Send WhatsApp ────────────────────────────────────────────────────────────

export async function sendWA(
  templateCode: string,
  toPhone: string,
  data: MessageData,
  userId?: string
): Promise<void> {
  // Normalize phone number (remove leading 0, add 62)
  let phone = toPhone.replace(/\D/g, '');
  if (phone.startsWith('0')) phone = '62' + phone.slice(1);
  if (!phone.startsWith('62')) phone = '62' + phone;

  const message = getWAMessage(templateCode, data);
  if (!message) {
    console.error(`[Fonnte] Unknown template: ${templateCode}`);
    return;
  }

  // Rate limit check
  const limited = await isRateLimited(phone);
  if (limited) {
    console.warn(`[Fonnte] Rate limited: ${phone}`);
    return;
  }

  let status = 'sent';
  let error: string | undefined;

  try {
    await axios.post(
      FONNTE_URL,
      { target: phone, message, delay: '1' },
      {
        headers: {
          Authorization: process.env.FONNTE_TOKEN || '',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  } catch (err: unknown) {
    status = 'failed';
    error = err instanceof Error ? err.message : String(err);
    console.error(`[Fonnte] Failed to send ${templateCode} to ${phone}:`, error);
  }

  // Log to DB
  try {
    await prisma.wALog.create({
      data: {
        userId: userId || null,
        toPhone: phone,
        message,
        templateCode,
        status,
        error,
      },
    });
  } catch (logErr) {
    console.error('[Fonnte] Failed to log WA:', logErr);
  }
}
