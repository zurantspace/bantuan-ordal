import { BrevoClient } from '@getbrevo/brevo';

// Brevo v6 — uses BrevoClient class with nested resource APIs
// client.transactionalEmails.sendTransacEmail(payload)

let _client: ReturnType<typeof createClient> | null = null;

function createClient() {
  return new BrevoClient({ apiKey: process.env.BREVO_API_KEY || '' });
}

function getClient() {
  if (!_client) _client = createClient();
  return _client;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmailRecipient {
  email: string;
  name?: string;
}

interface SendEmailOptions {
  to: EmailRecipient | EmailRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: EmailRecipient;
}

// ─── Core send function ───────────────────────────────────────────────────────

export async function sendEmail(opts: SendEmailOptions): Promise<void> {
  const client = getClient();
  const toArray = Array.isArray(opts.to) ? opts.to : [opts.to];

  await client.transactionalEmails.sendTransacEmail({
    sender: {
      name: process.env.BREVO_SENDER_NAME || 'Bantuan Ordal',
      email: process.env.BREVO_SENDER_EMAIL || 'noreply@bantuan-ordal.id',
    },
    to: toArray,
    subject: opts.subject,
    htmlContent: opts.htmlContent,
    textContent: opts.textContent,
    replyTo: opts.replyTo,
  });
}

// ─── Templated email helpers ──────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name: string, tier: string): Promise<void> {
  const isPremium = tier === 'premium';
  await sendEmail({
    to: { email: to, name },
    subject: '🎉 Selamat! Akses Kelas Kamu Sudah Aktif',
    htmlContent: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:11px;font-weight:700;color:#f1301e;letter-spacing:2px;margin-bottom:8px;">BANTUAN ORDAL</div>
      <h1 style="color:#fff;font-size:24px;margin:0 0 8px;">Selamat, ${name}! 🎉</h1>
      <p style="color:#888;font-size:14px;margin:0;">Akses kelasmu sudah aktif dan siap digunakan.</p>
    </div>
    <div style="background:#111;border:1px solid #222;border-radius:16px;padding:28px;margin-bottom:24px;">
      <p style="color:#ccc;font-size:14px;line-height:1.7;margin:0 0 20px;">
        Hei <strong style="color:#fff">${name}</strong>,<br><br>
        Terima kasih sudah bergabung! Akses kelas <strong style="color:#f1301e">${isPremium ? 'Premium (Ep.1-9)' : 'Standard (Ep.1-4)'}</strong> kamu sudah aktif.
      </p>
      <div style="text-align:center;">
        <a href="https://bantuan-ordal.id/home"
           style="display:inline-block;background:linear-gradient(90deg,#f1301e,#9f2315);color:#fff;text-decoration:none;padding:14px 32px;border-radius:40px;font-weight:700;font-size:14px;">
          🚀 Mulai Belajar Sekarang
        </a>
      </div>
    </div>
    <div style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:12px;padding:20px;margin-bottom:24px;">
      <div style="font-size:11px;font-weight:700;color:#555;letter-spacing:1px;margin-bottom:12px;">YANG KAMU DAPATKAN</div>
      ${isPremium ? `
        <div style="color:#888;font-size:13px;line-height:1.8;">
          ✅ Episode 1–9 (Akses penuh)<br>
          ✅ Sertifikat digital<br>
          ✅ Grup diskusi alumni<br>
          ✅ Update konten gratis selamanya<br>
          ✅ Semua bonus premium templates
        </div>` : `
        <div style="color:#888;font-size:13px;line-height:1.8;">
          ✅ Episode 1–4 (Standard)<br>
          ✅ Sertifikat digital<br>
          ✅ Grup diskusi alumni<br>
          ✅ Update konten gratis
        </div>`}
    </div>
    <p style="color:#444;font-size:11px;text-align:center;line-height:1.6;">
      Ada pertanyaan? Balas email ini atau hubungi kami di WhatsApp.<br>
      &copy; ${new Date().getFullYear()} Bantuan Ordal. All rights reserved.
    </p>
  </div>
</body>
</html>`,
  });
}

export async function sendOrderConfirmationEmail(
  to: string,
  name: string,
  orderId: string,
  amount: number,
  items: string[],
): Promise<void> {
  const formatRp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
  await sendEmail({
    to: { email: to, name },
    subject: `✅ Konfirmasi Pembayaran #${orderId.slice(-8).toUpperCase()}`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:11px;font-weight:700;color:#f1301e;letter-spacing:2px;">BANTUAN ORDAL</div>
      <h1 style="color:#fff;font-size:22px;margin:12px 0 8px;">Pembayaran Berhasil ✅</h1>
    </div>
    <div style="background:#111;border:1px solid #222;border-radius:16px;padding:28px;margin-bottom:20px;">
      <div style="font-size:11px;font-weight:700;color:#555;letter-spacing:1px;margin-bottom:16px;">DETAIL PESANAN</div>
      <div style="color:#888;font-size:13px;margin-bottom:8px;">No. Order: <span style="color:#fff;font-weight:700">#${orderId.slice(-8).toUpperCase()}</span></div>
      <div style="color:#888;font-size:13px;margin-bottom:16px;">Nama: <span style="color:#fff">${name}</span></div>
      <div style="border-top:1px solid #222;padding-top:16px;margin-bottom:16px;">
        ${items.map(i => `<div style="color:#ccc;font-size:13px;margin-bottom:6px;">✓ ${i}</div>`).join('')}
      </div>
      <div style="display:flex;justify-content:space-between;border-top:1px solid #222;padding-top:16px;">
        <span style="color:#fff;font-weight:700;font-size:14px;">Total Dibayar</span>
        <span style="color:#f1301e;font-weight:700;font-size:18px;">${formatRp(amount)}</span>
      </div>
    </div>
    <div style="text-align:center;">
      <a href="https://bantuan-ordal.id/home"
         style="display:inline-block;background:linear-gradient(90deg,#f1301e,#9f2315);color:#fff;text-decoration:none;padding:14px 32px;border-radius:40px;font-weight:700;font-size:14px;">
        Akses Kelas Sekarang →
      </a>
    </div>
    <p style="color:#444;font-size:11px;text-align:center;margin-top:24px;">
      &copy; ${new Date().getFullYear()} Bantuan Ordal
    </p>
  </div>
</body>
</html>`,
  });
}

export async function sendAbandonedCartEmail(to: string, name: string): Promise<void> {
  await sendEmail({
    to: { email: to, name },
    subject: `${name}, kamu lupa sesuatu 👀`,
    htmlContent: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;text-align:center;">
    <div style="font-size:11px;font-weight:700;color:#f1301e;letter-spacing:2px;margin-bottom:24px;">BANTUAN ORDAL</div>
    <h1 style="color:#fff;font-size:22px;margin:0 0 12px;">Masih mau belajar, ${name}?</h1>
    <p style="color:#888;font-size:14px;line-height:1.7;margin:0 0 32px;">
      Kamu hampir selesai checkout. Akses kelas persiapan karir masih menunggu kamu —
      dengan harga promo yang belum berubah.
    </p>
    <a href="https://bantuan-ordal.id/checkout"
       style="display:inline-block;background:linear-gradient(90deg,#f1301e,#9f2315);color:#fff;text-decoration:none;padding:14px 32px;border-radius:40px;font-weight:700;font-size:14px;">
      Lanjutkan Checkout →
    </a>
    <p style="color:#444;font-size:11px;margin-top:32px;">&copy; ${new Date().getFullYear()} Bantuan Ordal</p>
  </div>
</body>
</html>`,
  });
}

export async function sendAffiliateApprovalEmail(to: string, name: string, referralCode: string): Promise<void> {
  await sendEmail({
    to: { email: to, name },
    subject: '🎉 Komisi affiliate kamu sudah disetujui!',
    htmlContent: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;text-align:center;">
    <div style="font-size:11px;font-weight:700;color:#f1301e;letter-spacing:2px;margin-bottom:24px;">BANTUAN ORDAL AFFILIATE</div>
    <h1 style="color:#fff;font-size:22px;margin:0 0 12px;">Komisi kamu disetujui! 💰</h1>
    <p style="color:#888;font-size:14px;line-height:1.7;margin:0 0 24px;">
      Hei <strong style="color:#fff">${name}</strong>,<br>
      Komisi affiliate dari referral code <strong style="color:#f1301e">${referralCode}</strong> sudah disetujui dan masuk ke saldo wallet kamu.
    </p>
    <a href="https://bantuan-ordal.id/wallet"
       style="display:inline-block;background:linear-gradient(90deg,#f1301e,#9f2315);color:#fff;text-decoration:none;padding:14px 32px;border-radius:40px;font-weight:700;font-size:14px;">
      Lihat Saldo Wallet →
    </a>
    <p style="color:#444;font-size:11px;margin-top:32px;">&copy; ${new Date().getFullYear()} Bantuan Ordal</p>
  </div>
</body>
</html>`,
  });
}
