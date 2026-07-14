/**
 * BullMQ Workers — Background job processors
 *
 * IMPORTANT: This file should NOT be imported in Next.js pages/routes directly.
 * Workers should run via Next.js instrumentation hook (src/instrumentation.ts).
 */

import { Worker } from 'bullmq';
import { prisma } from './prisma';
import {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendAbandonedCartEmail,
  sendAffiliateApprovalEmail,
} from './brevo';
import { sendWA } from './fonnte';
import type { EmailJobData, WAJobData, AbandonedCheckoutJobData } from './redis';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://bantuan-ordal.id';

// ─── Email Worker ─────────────────────────────────────────────────────────────

export function startEmailWorker() {
  return new Worker<EmailJobData>(
    'email',
    async (job) => {
      const { templateCode, toEmail, toName, data } = job.data;

      switch (templateCode) {
        case 'E01': // Welcome - standard
          await sendWelcomeEmail(toEmail, toName, 'standard');
          break;
        case 'E02': // Welcome - premium
          await sendWelcomeEmail(toEmail, toName, 'premium');
          break;
        case 'E_ORDER': // Order confirmation
          await sendOrderConfirmationEmail(
            toEmail, toName,
            (data?.orderId as string) || '',
            (data?.amount as number) || 0,
            (data?.items as unknown as string[]) || [],
          );
          break;
        case 'E03':
        case 'E04':
        case 'E05':
        case 'E06': // Abandoned cart follow-up
          await sendAbandonedCartEmail(toEmail, toName);
          break;
        case 'E11': // Affiliate commission approved
          await sendAffiliateApprovalEmail(
            toEmail, toName,
            data?.referralCode as string || '',
          );
          break;
        default:
          console.warn(`[EmailWorker] Unknown template: ${templateCode}`);
      }
    },
    { connection, concurrency: 5 }
  );
}

// ─── WhatsApp Worker ──────────────────────────────────────────────────────────

export function startWAWorker() {
  return new Worker<WAJobData>(
    'whatsapp',
    async (job) => {
      const { templateCode, toPhone, data } = job.data;
      await sendWA(templateCode, toPhone, data || {});
    },
    { connection, concurrency: 2 }
  );
}

// ─── Abandoned Checkout Worker ────────────────────────────────────────────────

export function startAbandonedCheckoutWorker() {
  return new Worker<AbandonedCheckoutJobData>(
    'abandoned-checkout',
    async (job) => {
      const { orderId, customerEmail, customerPhone, customerName, followupStep } = job.data;

      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order || order.status !== 'PENDING') return; // already paid

      const checkoutUrl = `${APP_URL}/checkout?order=${order.id}`;
      const waData = { name: customerName, checkoutUrl };

      // Bitmask tracking for sent messages
      const SENT_E03 = 1;
      const SENT_W01 = 2;
      const SENT_E04 = 4;
      const SENT_E05 = 8;
      const SENT_W02 = 16;
      const SENT_E06 = 32;
      const SENT_W03 = 64;

      let flagsToAdd = 0;

      if (followupStep === 1 && !(order.followupSent & SENT_E03)) {
        // 30 min: abandoned cart email
        await sendAbandonedCartEmail(customerEmail, customerName);
        flagsToAdd |= SENT_E03;
      } else if (followupStep === 2 && !(order.followupSent & SENT_W01)) {
        // 1 hour: WA W01
        await sendWA('W01', customerPhone, waData);
        flagsToAdd |= SENT_W01;
      } else if (followupStep === 3 && !(order.followupSent & SENT_E04)) {
        // 24 hours: follow-up email
        await sendAbandonedCartEmail(customerEmail, customerName);
        flagsToAdd |= SENT_E04;
      } else if (followupStep === 4) {
        // Day 3: Promo Rp 99.000
        const promo = await prisma.promoSchedule.findFirst({
          where: { orderId, triggerType: 'day3_99k', executedAt: null },
        });
        if (promo) {
          const promoCheckoutUrl = `${APP_URL}/checkout?promo=${promo.promoToken}`;
          if (!(order.followupSent & SENT_E05)) {
            await sendAbandonedCartEmail(customerEmail, customerName);
            flagsToAdd |= SENT_E05;
          }
          if (!(order.followupSent & SENT_W02)) {
            await sendWA('W02', customerPhone, { name: customerName, checkoutUrl: promoCheckoutUrl, amount: 'Rp 99.000' });
            flagsToAdd |= SENT_W02;
          }
          await prisma.promoSchedule.update({
            where: { id: promo.id },
            data: { executedAt: new Date() },
          });
        }
      } else if (followupStep === 5) {
        // Day 10: Promo Rp 79.000
        const promo = await prisma.promoSchedule.findFirst({
          where: { orderId, triggerType: 'day10_79k', executedAt: null },
        });
        if (promo) {
          const promoCheckoutUrl = `${APP_URL}/checkout?promo=${promo.promoToken}`;
          if (!(order.followupSent & SENT_E06)) {
            await sendAbandonedCartEmail(customerEmail, customerName);
            flagsToAdd |= SENT_E06;
          }
          if (!(order.followupSent & SENT_W03)) {
            await sendWA('W03', customerPhone, { name: customerName, checkoutUrl: promoCheckoutUrl, amount: 'Rp 79.000' });
            flagsToAdd |= SENT_W03;
          }
          await prisma.promoSchedule.update({
            where: { id: promo.id },
            data: { executedAt: new Date() },
          });
        }
      }

      if (flagsToAdd > 0) {
        await prisma.order.update({
          where: { id: orderId },
          data: { followupSent: order.followupSent | flagsToAdd },
        });
      }
    },
    { connection }
  );
}

// ─── Affiliate Commission Approval Cron ───────────────────────────────────────

export function startAffiliateCronWorker() {
  return new Worker(
    'affiliate',
    async (job) => {
      if (job.name === 'approve-commissions') {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const pendingTxns = await prisma.affiliateTransaction.findMany({
          where: { status: 'PENDING', createdAt: { lte: sevenDaysAgo } },
          include: { affiliate: true },
        });

        for (const txn of pendingTxns) {
          await prisma.$transaction([
            prisma.affiliateTransaction.update({
              where: { id: txn.id },
              data: { status: 'APPROVED', approvedAt: new Date() },
            }),
            prisma.affiliate.update({
              where: { id: txn.affiliateId },
              data: {
                balance: { increment: txn.commissionAmount },
                totalCommission: { increment: txn.commissionAmount },
              },
            }),
          ]);

          const user = await prisma.user.findUnique({ where: { id: txn.affiliate.userId } });
          if (user) {
            const amount = `Rp ${txn.commissionAmount.toLocaleString('id-ID')}`;
            const referralCode = txn.affiliate.referralCode;
            // Notify via WA & email
            await sendWA('W07', user.phone, { name: user.name, amount });
            await sendAffiliateApprovalEmail(user.email, user.name, referralCode);
          }
        }
      }

      if (job.name === 'click-bonus') {
        const affiliates = await prisma.affiliate.findMany({
          where: { status: 'APPROVED' },
        });

        for (const aff of affiliates) {
          const uniqueClicks = await prisma.affiliateClick.groupBy({
            by: ['ip'],
            where: { affiliateId: aff.id },
            _count: { ip: true },
          });
          const totalUniqueClicks = uniqueClicks.length;
          const milestones = Math.floor(totalUniqueClicks / 1000);
          const bonusAlreadyPaid = Math.floor(aff.totalClicks / 1000);
          const newMilestones = milestones - bonusAlreadyPaid;

          if (newMilestones > 0) {
            const bonusAmount = newMilestones * 1000;
            await prisma.affiliate.update({
              where: { id: aff.id },
              data: {
                balance: { increment: bonusAmount },
                totalCommission: { increment: bonusAmount },
                totalClicks: totalUniqueClicks,
              },
            });
          } else {
            await prisma.affiliate.update({
              where: { id: aff.id },
              data: { totalClicks: totalUniqueClicks },
            });
          }
        }
      }
    },
    { connection }
  );
}
