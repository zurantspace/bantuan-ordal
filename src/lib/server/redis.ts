import { Queue } from 'bullmq';
import IORedis from 'ioredis';

// ─── Redis Connection ──────────────────────────────────────────────────────────

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // required for BullMQ
};

// Singleton IORedis connection
const globalForRedis = globalThis as unknown as {
  redis: IORedis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new IORedis(redisConfig);

redis.on('error', (err) => {
  // Silence connection errors to avoid flooding the node event loop in local development
  if (process.env.NODE_ENV !== 'production') {
    // Just a simple log, don't throw
    console.debug('[Redis] connection warning:', err.message);
  }
});

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

// ─── BullMQ Queues ─────────────────────────────────────────────────────────────

const connection = { host: redisConfig.host, port: redisConfig.port, password: redisConfig.password };

export const emailQueue = new Queue('email', { connection });
export const waQueue = new Queue('whatsapp', { connection });
export const abandonedCheckoutQueue = new Queue('abandoned-checkout', { connection });
export const affiliateQueue = new Queue('affiliate', { connection });

// ─── Job Types ─────────────────────────────────────────────────────────────────

export interface EmailJobData {
  templateCode: string; // E01–E11
  toEmail: string;
  toName: string;
  userId?: string;
  data: Record<string, string | number | boolean>;
}

export interface WAJobData {
  templateCode: string; // W01–W08
  toPhone: string;
  userId?: string;
  data: Record<string, string | number | boolean>;
}

export interface AbandonedCheckoutJobData {
  orderId: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  followupStep: number; // 1=E03, 2=W01, 3=E04, 4=E05+W02, 5=E06+W03
}

export interface AffiliateCommissionJobData {
  affiliateTransactionId: string;
}
