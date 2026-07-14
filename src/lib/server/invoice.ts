import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { uploadToR2 } from '@/lib/server/r2';

interface InvoiceData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  amount: number;
  hasOrderBump: boolean;
  orderBumpAmount: number;
  promoDiscount: number;
  promoCode?: string | null;
  paidAt: Date;
}

function formatRupiah(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Generate invoice PDF and upload to R2.
 * Returns the R2 key of the uploaded file.
 */
export async function generateAndUploadInvoice(data: InvoiceData): Promise<string> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const { width, height } = page.getSize();
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const RED = rgb(0.945, 0.188, 0.118); // #f1301e
  const BLACK = rgb(0, 0, 0);
  const GRAY = rgb(0.5, 0.5, 0.5);
  const LIGHT_GRAY = rgb(0.95, 0.95, 0.95);

  let y = height - 60;

  // ── Header ─────────────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: RED });

  page.drawText('BANTUAN ORDAL', {
    x: 40, y: height - 50,
    font: boldFont, size: 22, color: rgb(1, 1, 1),
  });

  page.drawText('INVOICE PEMBAYARAN', {
    x: 40, y: height - 68,
    font: regularFont, size: 10, color: rgb(1, 0.8, 0.8),
  });

  page.drawText(data.orderId, {
    x: width - 200, y: height - 45,
    font: boldFont, size: 11, color: rgb(1, 1, 1),
  });

  page.drawText(formatDate(data.paidAt), {
    x: width - 200, y: height - 62,
    font: regularFont, size: 9, color: rgb(1, 0.9, 0.9),
  });

  y = height - 110;

  // ── Customer Info ──────────────────────────────────────────────────────────
  page.drawText('TAGIHAN KEPADA', {
    x: 40, y, font: boldFont, size: 8, color: GRAY,
  });
  y -= 16;

  page.drawText(data.customerName, {
    x: 40, y, font: boldFont, size: 13, color: BLACK,
  });
  y -= 16;

  page.drawText(data.customerEmail, {
    x: 40, y, font: regularFont, size: 10, color: GRAY,
  });
  y -= 14;

  page.drawText(data.customerPhone, {
    x: 40, y, font: regularFont, size: 10, color: GRAY,
  });

  y -= 40;

  // ── Divider ────────────────────────────────────────────────────────────────
  page.drawLine({
    start: { x: 40, y },
    end: { x: width - 40, y },
    thickness: 1,
    color: rgb(0.88, 0.88, 0.88),
  });
  y -= 25;

  // ── Items Header ───────────────────────────────────────────────────────────
  page.drawText('ITEM', { x: 40, y, font: boldFont, size: 9, color: GRAY });
  page.drawText('HARGA', { x: width - 130, y, font: boldFont, size: 9, color: GRAY });
  y -= 8;

  page.drawLine({
    start: { x: 40, y },
    end: { x: width - 40, y },
    thickness: 0.5,
    color: rgb(0.88, 0.88, 0.88),
  });
  y -= 20;

  // ── Line Items ─────────────────────────────────────────────────────────────
  const baseAmount = data.amount - data.orderBumpAmount + data.promoDiscount;

  page.drawText(data.productName, { x: 40, y, font: regularFont, size: 11, color: BLACK });
  page.drawText(formatRupiah(baseAmount), {
    x: width - 130, y, font: regularFont, size: 11, color: BLACK,
  });
  y -= 20;

  if (data.hasOrderBump && data.orderBumpAmount > 0) {
    page.drawText('Order Bump — Bonus Extra', { x: 40, y, font: regularFont, size: 11, color: BLACK });
    page.drawText(formatRupiah(data.orderBumpAmount), {
      x: width - 130, y, font: regularFont, size: 11, color: BLACK,
    });
    y -= 20;
  }

  if (data.promoDiscount > 0) {
    page.drawText(`Diskon Promo${data.promoCode ? ` (${data.promoCode})` : ''}`, {
      x: 40, y, font: regularFont, size: 11, color: rgb(0.1, 0.6, 0.2),
    });
    page.drawText(`-${formatRupiah(data.promoDiscount)}`, {
      x: width - 130, y, font: regularFont, size: 11, color: rgb(0.1, 0.6, 0.2),
    });
    y -= 20;
  }

  y -= 10;

  // ── Total ──────────────────────────────────────────────────────────────────
  page.drawRectangle({
    x: 40, y: y - 8, width: width - 80, height: 34,
    color: LIGHT_GRAY,
  });

  page.drawText('TOTAL DIBAYAR', {
    x: 52, y: y + 7, font: boldFont, size: 11, color: BLACK,
  });
  page.drawText(formatRupiah(data.amount), {
    x: width - 130, y: y + 7, font: boldFont, size: 14, color: RED,
  });
  y -= 60;

  // ── Status ─────────────────────────────────────────────────────────────────
  page.drawRectangle({
    x: 40, y: y - 8, width: 100, height: 26,
    color: rgb(0.9, 1, 0.9),
    borderColor: rgb(0.1, 0.7, 0.2),
    borderWidth: 1,
  });
  page.drawText('✓  LUNAS', {
    x: 50, y: y + 3, font: boldFont, size: 11, color: rgb(0.1, 0.6, 0.2),
  });
  y -= 60;

  // ── Footer ─────────────────────────────────────────────────────────────────
  page.drawLine({
    start: { x: 40, y },
    end: { x: width - 40, y },
    thickness: 1,
    color: rgb(0.88, 0.88, 0.88),
  });
  y -= 16;

  page.drawText('Terima kasih telah bergabung dengan Bantuan Ordal!', {
    x: 40, y, font: boldFont, size: 10, color: BLACK,
  });
  y -= 14;

  page.drawText('Invoice ini digenerate otomatis. Simpan sebagai bukti pembayaran Anda.', {
    x: 40, y, font: regularFont, size: 9, color: GRAY,
  });

  // ── Generate & Upload ──────────────────────────────────────────────────────
  const pdfBytes = await pdfDoc.save();
  const key = `invoices/${data.orderId}.pdf`;
  await uploadToR2(key, Buffer.from(pdfBytes), 'application/pdf');

  return key;
}
