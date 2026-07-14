/**
 * Next.js Instrumentation Hook
 * This runs ONCE when the server starts (both edge and node runtime).
 * Use it to start BullMQ workers and schedule recurring jobs.
 *
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
  // Only start workers in Node.js runtime (not Edge)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startEmailWorker, startWAWorker, startAbandonedCheckoutWorker, startAffiliateCronWorker } =
      await import('./lib/server/workers');
    const { affiliateQueue, abandonedCheckoutQueue } = await import('./lib/server/redis');

    // Start all workers
    const emailWorker = startEmailWorker();
    const waWorker = startWAWorker();
    const abandonedWorker = startAbandonedCheckoutWorker();
    const affiliateWorker = startAffiliateCronWorker();

    // Schedule recurring affiliate commission approval (every day at 2 AM)
    await affiliateQueue.add(
      'approve-commissions',
      {},
      {
        repeat: { pattern: '0 2 * * *' }, // Every day at 02:00
        removeOnComplete: true,
        removeOnFail: 100,
      }
    );

    // Schedule click bonus calculation (every day at 3 AM)
    await affiliateQueue.add(
      'click-bonus',
      {},
      {
        repeat: { pattern: '0 3 * * *' }, // Every day at 03:00
        removeOnComplete: true,
        removeOnFail: 100,
      }
    );

    console.log('[Workers] Email, WA, Abandoned Checkout, Affiliate workers started ✅');

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      await emailWorker.close();
      await waWorker.close();
      await abandonedWorker.close();
      await affiliateWorker.close();
    });
  }
}
