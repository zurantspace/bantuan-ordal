import 'server-only';
// @ts-expect-error — midtrans-client has no official TS types
import MidtransClient from 'midtrans-client';
import crypto from 'crypto';

// ─── Client instances ────────────────────────────────────────────────────────

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

export const snap = new MidtransClient.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export const coreApi = new MidtransClient.CoreApi({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SnapTransactionParam {
  orderId: string;
  grossAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
}

export interface MidtransNotification {
  order_id: string;
  transaction_status: string;
  fraud_status: string;
  payment_type: string;
  gross_amount: string;
  signature_key: string;
  status_code: string;
  transaction_id: string;
}

// ─── Create Snap Token ────────────────────────────────────────────────────────

export async function createSnapToken(params: SnapTransactionParam): Promise<{
  token: string;
  redirect_url: string;
}> {
  const parameter = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.grossAmount,
    },
    item_details: params.items,
    customer_details: {
      first_name: params.customerName,
      email: params.customerEmail,
      phone: params.customerPhone,
    },
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you`,
      error: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=1`,
      pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?pending=1`,
    },
  };

  return snap.createTransaction(parameter);
}

// ─── Verify Webhook Signature ─────────────────────────────────────────────────

/**
 * Midtrans signature: SHA512(orderId + statusCode + grossAmount + serverKey)
 */
export function verifyMidtransSignature(notification: MidtransNotification): boolean {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
  const raw = `${notification.order_id}${notification.status_code}${notification.gross_amount}${serverKey}`;
  const expected = crypto.createHash('sha512').update(raw).digest('hex');
  return expected === notification.signature_key;
}

// ─── Map Midtrans status → internal status ────────────────────────────────────

export function mapMidtransStatus(
  transactionStatus: string,
  fraudStatus: string
): 'PAID' | 'FAILED' | 'PENDING' | 'EXPIRED' | null {
  if (transactionStatus === 'capture') {
    return fraudStatus === 'accept' ? 'PAID' : null;
  }
  if (transactionStatus === 'settlement') return 'PAID';
  if (transactionStatus === 'cancel' || transactionStatus === 'deny') return 'FAILED';
  if (transactionStatus === 'expire') return 'EXPIRED';
  if (transactionStatus === 'pending') return 'PENDING';
  return null;
}

// ─── Refund ───────────────────────────────────────────────────────────────────

export async function processRefund(midtransOrderId: string, amount: number, reason: string) {
  return coreApi.transaction.refund(midtransOrderId, {
    refund_key: `REFUND-${Date.now()}`,
    amount,
    reason,
  });
}
