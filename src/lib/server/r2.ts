import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

// ─── R2 Client ───────────────────────────────────────────────────────────────

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
export const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'bantuan-ordal-2';
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`;

let _r2Client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (!_r2Client) {
    _r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
    });
  }
  return _r2Client;
}

// ─── Presigned Download URL ───────────────────────────────────────────────────

/**
 * Generate a presigned URL for secure file download.
 * URL expires in expiresIn seconds (default 15 minutes).
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn = 900 // 15 minutes
): Promise<string> {
  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn });
}

// ─── Presigned Upload URL ─────────────────────────────────────────────────────

/**
 * Generate a presigned URL for client-side file upload.
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 300 // 5 minutes
): Promise<string> {
  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(client, command, { expiresIn });
}

// ─── Direct Upload (Server-side) ──────────────────────────────────────────────

/**
 * Upload a Buffer or Uint8Array directly from the server.
 */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  const client = getR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return `${R2_PUBLIC_URL}/${BUCKET_NAME}/${key}`;
}

// ─── Delete Object ────────────────────────────────────────────────────────────

export async function deleteFromR2(key: string): Promise<void> {
  const client = getR2Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );
}
