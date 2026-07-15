import { defineConfig } from 'prisma/config';
import fs from 'fs';
import path from 'path';

// Manually parse .env to guarantee DATABASE_URL is populated for Prisma 7 CLI on VPS
let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/^DATABASE_URL=["']?([^"\n\r#]+)["']?/m);
      if (match) {
        databaseUrl = match[1].trim();
      }
    }
  } catch (err) {
    console.error('Failed to read .env file manually:', err);
  }
}

// Prisma 7 config — connection URL here instead of schema.prisma datasource.url
// The adapter (PrismaPg) is configured in src/lib/server/prisma.ts
// Docs: https://pris.ly/d/config-datasource
export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: databaseUrl as string,
  },
});
